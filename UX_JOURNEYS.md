# UX Architecture & User Journeys
**Project:** Michael Bakare Digital Experience Platform
**Status:** Approved - Architecture Phase 1 Complete

This document outlines the detailed user experience architecture, mapping the exact entry points, actions, system responses, validations, and edge cases for the seven core platform journeys.

---

## JOURNEY A: The Discovery Flow
**Visitor → Discover Michael → Explore biography → Explore works**

*   **Entry Point:** Organic search landing on `/` (Home) or `/about`.
*   **User Actions:**
    1. Scrolls through the Home page hero and value propositions.
    2. Clicks "About Michael" in the navigation.
    3. Reads biographical timeline and legacy achievements.
    4. Clicks the call-to-action "Explore Works" or navigates to `/works`.
    5. Filters works by category (e.g., "Creative Direction").
    6. Selects a specific portfolio item.
*   **System Response:** 
    *   Renders static UI with smooth Framer Motion entrance animations.
    *   Queries Firestore `portfolio` collection on the `/works` route.
    *   Filters UI state instantly based on category selection.
*   **Validation:** Read-only operation; standard Firestore security rules (`allow read: if true`).
*   **Errors:** 
    *   *Data fetch failure:* Display a graceful fallback UI ("Unable to load portfolio items at this time.").
*   **Success State:** User successfully views high-resolution imagery and detailed case study of a past project.
*   **Edge Cases:** User selects a filter category with zero active projects (System displays: "No projects found in this category. View all works.").
*   **Notifications:** None.

---

## JOURNEY B: The Lead Generation Flow
**Visitor → Services → Select service → Request quotation**

*   **Entry Point:** `/services` page.
*   **User Actions:**
    1. Reads through available professional services.
    2. Clicks "Request a Quote".
    3. Is routed to `/contact` (or `/quote`).
    4. Fills out Name, Email, selects a Service Type from a dropdown, and types Project Details.
    5. Clicks "Submit".
*   **System Response:**
    *   Captures input in React state.
    *   Initiates Firestore `addDoc` to the `quotes` collection with `status: 'pending'` and a server timestamp.
*   **Validation:** 
    *   *Client:* HTML5 required attributes, email regex, string length checks.
    *   *Server (Firestore Rules):* Strict schema validation via `isValidQuoteRequest` (checking max lengths, exact keys, and valid enum values).
*   **Errors:**
    *   Invalid email format (Client halts submission).
    *   Payload size exceeds limits (Firestore rejects, UI shows "Submission failed. Please try again.").
*   **Success State:** Form dissolves into a smooth success animation with a checkmark and a "Thank you" confirmation message. Fields are cleared.
*   **Edge Cases:** User double-clicks "Submit" (UI disables button during `isSubmitting` state to prevent duplicate documents).
*   **Notifications:** Inline UI success message.

---

## JOURNEY C: The E-Commerce Flow
**Visitor → Shop → Product → Cart → Selar checkout → Purchase**

*   **Entry Point:** `/store`
*   **User Actions:**
    1. Browses digital products.
    2. Clicks a product card to view details (`/store/:productId`).
    3. Clicks "Add to Cart".
    4. Opens the Cart drawer/page (`/cart`).
    5. Reviews total and clicks "Proceed to Checkout".
*   **System Response:**
    *   Adds item to local React state / `localStorage` cart.
    *   On checkout click, system packages cart metadata and redirects the user's browser to the dynamically generated or static Selar checkout URL for those products.
*   **Validation:** 
    *   Check if the product `isActive` is true before adding to cart.
    *   Verify cart is not empty before allowing checkout.
*   **Errors:**
    *   Product becomes inactive while in cart (UI alerts: "This item is no longer available").
    *   Selar integration fails to generate link (UI alerts: "Checkout is temporarily unavailable.").
*   **Success State:** User is successfully redirected to the Selar hosted checkout page.
*   **Edge Cases:** User abandons checkout and clicks "Back" (Cart retains items via local storage).
*   **Notifications:** Toast notification: "Added to cart".

---

## JOURNEY D: The Fulfillment Flow
**Customer → Successful payment → Secure digital delivery**

*   **Entry Point:** Selar Server-to-Server Webhook (`/api/selar/webhook`).
*   **User Actions:** None (Automated background process), followed by user checking their email or the Selar success page.
*   **System Response:**
    1. Express backend receives POST request from Selar.
    2. System verifies the webhook signature using the Selar secret key.
    3. If valid, system retrieves the associated digital file's secure download link (e.g., Signed URL from Firebase Storage).
    4. System provisions access and delivers the asset via Selar's automated delivery mechanics or a triggered email.
*   **Validation:** 
    *   Strict HMAC signature verification of the Selar webhook payload.
    *   Verification of transaction status (`status === 'successful'`).
*   **Errors:**
    *   Signature mismatch (System rejects with 401 Unauthorized, logs potential fraud).
*   **Success State:** Customer receives the high-resolution digital file or access link.
*   **Edge Cases:** Webhook delivery is delayed by Selar (System must be idempotent; processing the same webhook ID twice should not cause duplicate actions).
*   **Notifications:** Email receipt with download link sent to the customer.

---

## JOURNEY E: The Admin Authentication Flow
**Administrator → Login → Dashboard → Manage content**

*   **Entry Point:** `/admin`
*   **User Actions:**
    1. Clicks "Login with Google".
    2. Authenticates via Google popup.
*   **System Response:**
    *   Firebase Auth triggers `signInWithPopup`.
    *   Upon success, UI router checks if the authenticated user's UID exists in the Firestore `users` collection with `role == 'admin'`.
    *   Grants access and routes to the Dashboard overview.
*   **Validation:** 
    *   Firestore rule `isAdmin()` strictly evaluates the token against the `users` collection.
*   **Errors:**
    *   User authenticates successfully but is not in the `users` collection (UI displays: "Unauthorized. You do not have administrator access.", calls `signOut()`).
*   **Success State:** Admin views the private CMS dashboard showing high-level metrics (e.g., Pending Quotes).
*   **Edge Cases:** Auth token expires while session is open (System detects unauthorized read, prompts re-login).
*   **Notifications:** Toast notification: "Welcome back, Michael."

---

## JOURNEY F: The Product Publishing Flow
**Administrator → Manage products → Upload digital file → Publish product**

*   **Entry Point:** `/admin/products/new`
*   **User Actions:**
    1. Fills out product title, description, price, and currency.
    2. Selects a cover image and a digital product file (PDF, ZIP, etc.) from their local machine.
    3. Clicks "Publish".
*   **System Response:**
    *   Uploads cover image and digital file to Firebase Cloud Storage.
    *   Retrieves the secure download URLs.
    *   Writes a new document to the Firestore `products` collection with `isActive: true`.
*   **Validation:** 
    *   File size checks (e.g., Cover < 2MB, Product File < 100MB).
    *   Required field validation (Title, Price must be > 0).
*   **Errors:**
    *   Upload interrupted by network loss (UI shows: "Upload failed, please retry.").
*   **Success State:** Form clears, UI redirects to the Products list, new product is instantly visible on the public `/store`.
*   **Edge Cases:** Admin closes browser tab mid-upload (Upload terminates, product is not published).
*   **Notifications:** Progress bar during file upload. Toast notification: "Product published successfully."

---

## JOURNEY G: The Lead Management Flow
**Administrator → Receive quote request → Review → Respond → Update status**

*   **Entry Point:** `/admin/quotes`
*   **User Actions:**
    1. Sees a badge indicating "1 New Quote".
    2. Clicks the pending quote to view client details, email, and project scope.
    3. Clicks a `mailto:` link to respond to the client via their native email client.
    4. Clicks a dropdown in the UI to change the status from `pending` to `replied`.
*   **System Response:**
    *   Executes `updateDoc` on the specific `quotes/{quoteId}` document in Firestore, modifying only the `status` field.
*   **Validation:** 
    *   Firestore rules validate that the incoming update only mutates allowed fields and that the new status is a valid enum (`replied`).
*   **Errors:**
    *   Network failure during update (UI reverts optimistic update, shows error toast).
*   **Success State:** Quote moves from the "Pending" list to the "Archived/Replied" list. Badge count decrements.
*   **Edge Cases:** Admin attempts to update a quote that was deleted by another admin (UI alerts: "This quote no longer exists.").
*   **Notifications:** Toast notification: "Quote marked as replied."
