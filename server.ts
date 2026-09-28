import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { getStorage } from 'firebase-admin/storage';


// Initialize Firebase Admin lazily to avoid crashing on boot if missing
let db: any = null;

let storage = null;
function getStorageAdmin() {
  if (storage) return storage;
  if (!getDb()) return null; // Ensure initialized
  try {
    storage = getStorage();
    return storage;
  } catch (e) {
    return null;
  }
}

function getDb() {
  if (db) return db;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    console.warn("FIREBASE_SERVICE_ACCOUNT is not set. Admin SDK not initialized.");
    return null;
  }
  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    const app = initializeApp({
      credential: cert(serviceAccount)
    });
    db = getFirestore(app);
    return db;
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());
  app.use('/audio', express.static(path.join(process.cwd(), 'public/audio')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Selar Webhook Endpoint (via Zapier)
  app.post("/api/selar/webhook", async (req, res) => {
    const webhookSecret = process.env.SELAR_WEBHOOK_SECRET;
    
    // Webhook Verification
    if (!webhookSecret) {
      console.error("SELAR_WEBHOOK_SECRET is not configured.");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const providedSecret = req.headers['x-webhook-secret'];
    if (providedSecret !== webhookSecret) {
      console.warn("Unauthorized webhook attempt.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email, amount, currency, product_name, reference, status } = req.body;

    if (!email || !reference || status !== 'success') {
      return res.status(400).json({ error: "Invalid payload or non-success status" });
    }

    const firestore = getDb();
    if (!firestore) {
      return res.status(500).json({ error: "Database not configured" });
    }

    try {
      // Idempotency / Duplicate protection check
      const transactionRef = firestore.collection('transactions').doc(reference);
      const transactionDoc = await transactionRef.get();
      
      if (transactionDoc.exists) {
        console.log(`Duplicate webhook for reference ${reference}. Ignoring.`);
        return res.status(200).json({ received: true, status: "duplicate" });
      }

      // Order Reconciliation
      // Find pending orders for this email
      const ordersSnapshot = await firestore.collection('orders')
        .where('customerEmail', '==', email)
        .where('status', '==', 'PENDING')
        .get();

      if (ordersSnapshot.empty) {
        console.log(`No pending order found for email ${email}`);
        return res.status(404).json({ error: "Order not found" });
      }

      // If multiple, try to match by amount (allowing small floating point diffs)
      let matchedOrder = null;
      let matchedDoc = null;

      for (const doc of ordersSnapshot.docs) {
        const orderData = doc.data();
        // Strict equality or within a small delta
        // Strict equality for amount and currency
        if (Math.abs(orderData.totalAmount - Number(amount)) < 0.1 && orderData.currency === currency) {
          matchedOrder = orderData;
          matchedDoc = doc;
          break;
        }
      }

      // Fallback removed for security to prevent cross-order fulfillment.

      if (!matchedDoc) {
        console.log(`Could not definitively match order for email ${email}`);
        return res.status(400).json({ error: "Order mismatch" });
      }

      // Update Order and Create Transaction Log atomically
      const batch = firestore.batch();
      
      batch.update(matchedDoc.ref, {
        status: 'PAID',
        updatedAt: new Date().toISOString()
      });

      batch.set(transactionRef, {
        reference,
        orderId: matchedDoc.id,
        email,
        amount: Number(amount),
        currency,
        productName: product_name,
        timestamp: new Date().toISOString()
      });

      await batch.commit();
      console.log(`Successfully processed payment for order ${matchedDoc.id}`);
      
      res.status(200).json({ received: true, status: "success", orderId: matchedDoc.id });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // Secure Download Endpoint
  app.get("/api/download/:orderId/:productId", async (req, res) => {
    const { orderId, productId } = req.params;
    const { accessKey } = req.query;

    if (!accessKey) {
      return res.status(401).send("Missing access key.");
    }

    const firestore = getDb();
    const storage = getStorageAdmin();

    if (!firestore || !storage) {
      return res.status(500).send("Storage not configured.");
    }

    try {
      // 1. Verify Order
      const orderDoc = await firestore.collection('orders').doc(orderId).get();
      if (!orderDoc.exists) {
        return res.status(404).send("Order not found.");
      }

      const orderData = orderDoc.data();
      if (orderData.status !== 'PAID' && orderData.status !== 'COMPLETED') {
        return res.status(403).send("Order is not paid.");
      }

      if (orderData.accessKey !== accessKey) {
        return res.status(403).send("Invalid access key.");
      }

      // 2. Verify Product Entitlement
      const item = orderData.items.find((i: any) => i.product.id === productId);
      if (!item) {
        return res.status(403).send("Product not part of this order.");
      }

      // 3. Get Product Storage Path
      const productDoc = await firestore.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        return res.status(404).send("Product no longer exists.");
      }
      
      const productData = productDoc.data();
      if (!productData.storagePath) {
        return res.status(404).send("No secure file associated with this product.");
      }

      // 4. Enforce Limits & Record Audit Log
      const downloadLogRef = firestore.collection('orders').doc(orderId).collection('downloads').doc(productId);
      const downloadLog = await downloadLogRef.get();
      const currentDownloads = downloadLog.exists ? downloadLog.data().count : 0;
      
      const MAX_DOWNLOADS = 5; // Configurable limit
      if (currentDownloads >= MAX_DOWNLOADS) {
        return res.status(429).send("Maximum download limit reached for this item.");
      }

      await downloadLogRef.set({
        count: currentDownloads + 1,
        lastDownloadedAt: new Date().toISOString()
      }, { merge: true });

      // 5. Generate Signed Temporary URL
      // (Optional: PDF watermarking could be intercepted here in the future before returning a URL)
      // Note: Admin SDK needs the default bucket configured, or we can parse it from storagePath if it contains gs://
      
      let bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'first-project-326912.firebasestorage.app';
      let filePath = productData.storagePath;

      if (filePath.startsWith('gs://')) {
        const parts = filePath.replace('gs://', '').split('/');
        bucketName = parts.shift();
        filePath = parts.join('/');
      }

      const bucket = storage.bucket(bucketName);
      const file = bucket.file(filePath);

      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).send("File not found in storage.");
      }

      // URL valid for 1 hour
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
      });

      // Redirect user to the secure temporary URL
      res.redirect(url);
    } catch (error) {
      console.error("Download generation error:", error);
      res.status(500).send("Internal server error generating download.");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
