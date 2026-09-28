const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const importAdd = `
import { getStorage } from 'firebase-admin/storage';
`;
content = content.replace("import { getFirestore } from 'firebase-admin/firestore';", "import { getFirestore } from 'firebase-admin/firestore';\n" + importAdd);

const initAdd = `
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
`;
content = content.replace("function getDb() {", initAdd + "\nfunction getDb() {");

const downloadRoute = `
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
`;

content = content.replace("  // Vite middleware for development", downloadRoute + "\n  // Vite middleware for development");
fs.writeFileSync('server.ts', content);
