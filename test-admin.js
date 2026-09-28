import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
try {
  initializeApp();
  console.log("App initialized successfully.");
  const db = getFirestore();
  db.collection('orders').limit(1).get().then(() => {
    console.log("Firestore accessible.");
    process.exit(0);
  }).catch(e => {
    console.error("Firestore error:", e.message);
    process.exit(1);
  });
} catch(e) {
  console.error("Init error:", e.message);
  process.exit(1);
}
