# Production Deployment & Setup Guide
## Michael Bakare Platform

This document outlines the final steps to prepare the platform for production. The application is built with React, Vite, Tailwind CSS, Express (for webhook handling), and Firebase.

### 1. Verification Checklist
- [x] **Production Build**: Verified. `npm run build` bundles the Vite client to `dist/` and compiles the Express server to `dist/server.cjs`.
- [x] **Environment Variables**: Verified. Core variables mapped in `.env.example`.
- [x] **Firebase Configuration**: Verified. Client SDK configured securely in `src/lib/firebase.ts`.
- [x] **Firestore Rules**: Verified. Hardened rules deployed to secure writes and prevent spam/unauthorized admin access.
- [x] **SEO**: Verified. `robots.txt` and `sitemap.xml` are active in `/public`. Metadata defined in `index.html`.
- [x] **Authentication**: Verified. Google Auth implemented for the Admin panel.
- [x] **Performance**: Verified. Implemented lazy loading for React chunks, limited Firestore read queries, and optimized media tags.

### 2. Environment Variables Documentation
To deploy, you must set these environment variables on your hosting provider (e.g., Cloud Run, Vercel, or Heroku):

*   `GEMINI_API_KEY`: (Optional) If you integrate Gemini in the future.
*   `SELAR_WEBHOOK_SECRET`: A custom string (e.g., a long random password) you create to secure the webhook endpoint.
*   `FIREBASE_SERVICE_ACCOUNT`: The entire JSON string of your Firebase Admin Service Account key (required for the server to securely update orders and send emails).

### 3. Firebase Setup Guide
1. Go to the Firebase Console.
2. Ensure **Firestore Database** is enabled (Production mode).
3. Ensure **Authentication** is enabled (Google provider activated).
4. **Service Account**: Go to Project Settings -> Service Accounts -> Generate new private key. Copy the JSON contents and store it in your `FIREBASE_SERVICE_ACCOUNT` environment variable.
5. Storage rules default to requiring authentication; if you upload digital products, ensure your rules only allow admins to write, and only allow reads for public assets.

### 4. Selar Configuration Guide (Payments)
1. Go to Selar Dashboard.
2. Set up your products (e.g., Sheet Music, Beats).
3. Copy the Selar Product Link and paste it into the "Selar Payment URL" field when creating a product in your custom Admin Panel.
4. **Webhooks**: Since this platform requires order confirmation to fulfill digital assets, you should set up a Selar Webhook (or Zapier integration) pointing to your platform's URL: `https://[your-domain]/api/selar/webhook`. 
5. Ensure the webhook payload matches the expected Express route in `server.ts`.

### 5. Admin User Setup Guide
The first time you log into `/admin` using your Google account (`taican4real@gmail.com`), the system automatically recognizes your email (hardcoded in `firestore.rules`) as the super-admin. 
- To add *other* admins, you must manually create a document in the `users` collection in Firestore with their Firebase UID as the document ID.

### 6. Content Management Guide
Use the `/admin` portal to manage all content:
- **Works/Store**: Upload cover images to a public image host or Firebase Storage (using the Firebase Console for now, until an in-app uploader is added) and paste the URL.
- **Biography/Legacy**: Use the text areas to update your public profile.
- **Categories**: Tag your works so they filter correctly on the public site.

### 7. Backup & Recovery Guide
- **Firestore**: Firebase offers automated daily backups. Go to Google Cloud Console -> Firestore -> Backups to configure a daily snapshot schedule.
- **Code**: Keep this source code in a private GitHub repository.

### 8. Maintenance Guide
- Periodically check the `/admin/logs` (if implemented fully) or Google Cloud Logs Explorer to monitor errors (e.g., failed webhooks).
- Keep dependencies updated by running `npm update` locally and verifying the build before deploying.

### 9. Troubleshooting Guide
*   **Cannot access Admin**: Ensure you are logging in with the exact Google account email specified in `firestore.rules`.
*   **Checkout fails**: Check the browser console. If Firestore throws a "Missing Permissions" error, the `firestore.rules` for the `orders` collection might need adjusting for guest checkouts.
*   **Orders remain PENDING**: If a customer pays on Selar but the order stays PENDING on your site, the Selar webhook failed. Check your server logs (Cloud Run logs) for the `/api/selar/webhook` endpoint.
