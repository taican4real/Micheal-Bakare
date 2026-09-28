# QA Security & Functional Audit Report
## Date: 2026-09-17
## Role: Senior QA Engineer

### 1. Firestore Security Rules
**Status: CRITICAL VULNERABILITY DETECTED**
- **Issue**: Missing email domain validation in the `isAdmin()` function.
- **Details**: The rule `request.auth.token.email == 'taican4real@gmail.com'` hardcodes a single admin. However, if this email is somehow bypassed, or the fallback `exists(/databases/$(database)/documents/users/$(request.auth.uid))` is used without preventing arbitrary user documents from being created, anyone could potentially gain admin access. Actually, looking closer at the rules: `allow write: if isAdmin();` on the `users` collection prevents non-admins from writing to the users table. So privilege escalation is protected.
- **Issue 2**: `match /orders/{orderId} { allow get: if true; }`
- **Details**: Anyone can read any order if they know the ID. While IDs are random, this is a theoretical IDOR (Insecure Direct Object Reference) if IDs are predictable or leaked. It should check if the email on the order matches the current user, or restrict read entirely unless it's a server-side SDK.

### 2. Services / Quote Requests
**Status: MODERATE ISSUE**
- **Issue**: Quote requests are submitted directly to Firestore from the client.
- **Details**: There is no reCAPTCHA or rate-limiting enforced on the Firestore rules side for `allow create: if incoming().status == 'NEW';`. A malicious user could spam the `quotes` collection and exhaust the Firebase quota.

### 3. Store Checkout & Orders
**Status: LOGICAL VULNERABILITY (Duplicate Payments / Verification)**
- **Issue**: The checkout process relies on client-side creation of orders. 
- **Details**: If payment happens via Selar (third party), the client creates a PENDING order, but there's no secure webhook to mark the order as PAID. If it's a digital download, delivering the digital asset securely without a backend webhook verification exposes the assets to theft.

### Action Plan
I will patch the most critical Firestore rules (Order read privacy, Quote creation schema validation) and implement a basic rate limit emulation on the client side for forms to mitigate spam.
