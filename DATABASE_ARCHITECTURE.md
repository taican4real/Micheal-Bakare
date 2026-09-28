# Firebase Database Architecture
**Project:** Michael Bakare Digital Experience Platform
**Status:** Approved - Architecture Phase 1 Complete

This document outlines the complete data schema, relationships, indexing, and security architecture for the Firestore database and Firebase Cloud Storage.

---

## I. Data Schema & Collections

### 1. Platform Administration & Settings

#### `users` (Administrators)
- **Purpose:** Stores authenticated administrative accounts.
- **Document ID:** Firebase Auth UID
- **Fields:**
  - `email` (string, required)
  - `role` (string, required, enum: `['admin']`)
  - `displayName` (string, optional)
  - `createdAt` (timestamp, required)
  - `lastLogin` (timestamp, optional)
- **Validation:** `role` must be exactly 'admin'. Read/Write restricted to admins.

#### `settings` (Site Settings)
- **Purpose:** Singleton documents for global configuration.
- **Document ID:** Explicit strings (e.g., `global`, `seo`, `social`)
- **Fields (for `global` doc):**
  - `siteName` (string, required)
  - `contactEmail` (string, required)
  - `socialLinks` (map: `{ linkedin: string, twitter: string, instagram: string }`, optional)
  - `seoMetadata` (map: `{ defaultTitle: string, defaultDescription: string, ogImageUrl: string }`, optional)
  - `updatedAt` (timestamp, required)

### 2. The Legacy & Biography

#### `legacy` 
- **Purpose:** Contains foundational biographical data.
- **Document ID:** `biography`
- **Fields:**
  - `content` (string/markdown, required)
  - `shortBio` (string, required)
  - `featuredImage` (string/URL, optional)
  - `updatedAt` (timestamp, required)

#### `timelineEvents` (Career, Education, Achievements, Awards)
- **Purpose:** A unified collection for chronological milestones.
- **Document ID:** Auto-generated
- **Fields:**
  - `title` (string, required)
  - `type` (string, required, enum: `['career', 'education', 'achievement', 'award']`)
  - `institutionOrIssuer` (string, optional)
  - `date` (timestamp/string, required)
  - `description` (string, optional)
  - `isActive` (boolean, required, default: true)
- **Indexes:** Composite index on `type` ASC + `date` DESC.

### 3. Portfolio & Media

#### `portfolio` (Works, Projects, Compositions)
- **Purpose:** Central hub for professional works.
- **Document ID:** Auto-generated or URL-friendly slug
- **Fields:**
  - `title` (string, required)
  - `slug` (string, required, unique)
  - `category` (string, required)
  - `type` (string, required, enum: `['project', 'composition', 'exhibition']`)
  - `description` (string, required)
  - `client` (string, optional)
  - `featuredImageUrl` (string/URL, required)
  - `gallery` (array of strings/URLs, optional)
  - `isFeatured` (boolean, required, default: false)
  - `publishedAt` (timestamp, required)
  - `status` (string, required, enum: `['draft', 'published']`)
- **Indexes:** `status` ASC + `publishedAt` DESC; `isFeatured` ASC + `publishedAt` DESC.

#### `media` (Publications, Press, Interviews)
- **Purpose:** External features and free content.
- **Document ID:** Auto-generated
- **Fields:**
  - `title` (string, required)
  - `type` (string, required, enum: `['publication', 'interview', 'press']`)
  - `url` (string/URL, required)
  - `publisher` (string, required)
  - `publishedAt` (timestamp, required)
  - `status` (string, required, enum: `['draft', 'published']`)

### 4. Professional Services & Leads

#### `services`
- **Purpose:** Offerings and service tiers.
- **Document ID:** URL-friendly slug
- **Fields:**
  - `title` (string, required)
  - `shortDescription` (string, required)
  - `fullDescription` (string/markdown, required)
  - `deliverables` (array of strings, optional)
  - `basePrice` (number, optional)
  - `order` (number, required - for UI sorting)
  - `isActive` (boolean, required)

#### `quotes` (Quote Requests)
- **Purpose:** Inbound leads from the Contact/Quote form.
- **Document ID:** Auto-generated
- **Fields:**
  - `name` (string, required)
  - `email` (string, required)
  - `serviceType` (string, required)
  - `details` (string, required)
  - `status` (string, required, enum: `['pending', 'reviewed', 'replied', 'archived']`)
  - `createdAt` (timestamp, required)
  - `updatedAt` (timestamp, required)
- **Indexes:** `status` ASC + `createdAt` DESC.

#### `testimonials`
- **Purpose:** Client reviews and social proof.
- **Document ID:** Auto-generated
- **Fields:**
  - `clientName` (string, required)
  - `role` (string, optional)
  - `company` (string, optional)
  - `quote` (string, required)
  - `associatedServiceId` (string, optional) // Relationship to `services`
  - `isFeatured` (boolean, required)

### 5. Digital Storefront (E-Commerce)

#### `categories` (Product Categories)
- **Purpose:** Store taxonomy.
- **Document ID:** URL-friendly slug
- **Fields:**
  - `name` (string, required)
  - `order` (number, required)

#### `products`
- **Purpose:** Digital goods available for purchase.
- **Document ID:** Auto-generated or URL-friendly slug
- **Fields:**
  - `title` (string, required)
  - `slug` (string, required, unique)
  - `categoryId` (string, required) // Relationship to `categories`
  - `description` (string, required)
  - `price` (number, required)
  - `currency` (string, required, enum: `['USD', 'NGN', 'GBP', 'EUR']`)
  - `coverImageUrl` (string/URL, required)
  - `digitalAssetId` (string, required) // Relationship to `digitalAssets`
  - `status` (string, required, enum: `['draft', 'active', 'archived']`)
  - `createdAt` (timestamp, required)
  - `updatedAt` (timestamp, required)

#### `digitalAssets`
- **Purpose:** Metadata pointing to the actual secure file in Firebase Storage. Separated from `products` so the file path is never exposed to public reads.
- **Document ID:** Auto-generated
- **Fields:**
  - `fileName` (string, required)
  - `storagePath` (string, required) // E.g., `secure-assets/ebook_v1.pdf`
  - `fileSize` (number, required)
  - `mimeType` (string, required)
  - `uploadedAt` (timestamp, required)

#### `customers`
- **Purpose:** Buyers of digital products.
- **Document ID:** Email address (lowercased) or Auto-generated
- **Fields:**
  - `email` (string, required)
  - `name` (string, optional)
  - `totalOrders` (number, required, default: 0)
  - `totalSpent` (number, required, default: 0)
  - `createdAt` (timestamp, required)

#### `orders` (and Order Items)
- **Purpose:** Transaction records from Selar.
- **Document ID:** Selar Transaction ID (guarantees idempotency)
- **Fields:**
  - `customerId` (string, required) // Relationship to `customers`
  - `customerEmail` (string, required)
  - `amount` (number, required)
  - `currency` (string, required)
  - `status` (string, required, enum: `['pending', 'successful', 'failed', 'refunded']`)
  - `selarReference` (string, required)
  - `items` (array of objects, required):
    - `productId` (string)
    - `price` (number)
    - `quantity` (number)
  - `createdAt` (timestamp, required)

#### `downloadTokens`
- **Purpose:** Secure, single-use or time-bound access tokens for digital delivery.
- **Document ID:** Secure random UUID
- **Fields:**
  - `orderId` (string, required) // Relationship to `orders`
  - `productId` (string, required)
  - `customerEmail` (string, required)
  - `digitalAssetId` (string, required)
  - `expiresAt` (timestamp, required)
  - `isUsed` (boolean, required, default: false)
  - `downloadCount` (number, required, default: 0)

#### `notifications`
- **Purpose:** System alerts for the Admin Dashboard (e.g., "New Quote Request", "New Sale").
- **Document ID:** Auto-generated
- **Fields:**
  - `type` (string, required, enum: `['quote', 'sale', 'system']`)
  - `message` (string, required)
  - `isRead` (boolean, required, default: false)
  - `referenceId` (string, optional) // ID of the quote or order
  - `createdAt` (timestamp, required)

*(Note: `carts` is handled purely via client-side `localStorage` state prior to the Selar redirect, reducing unnecessary database writes for abandoned sessions).*

---

## II. Security Architecture

### 1. Role-Based Access Control (RBAC) Principles
- **Admin Principle:** Administrators authenticate via Google Auth. Their UID must exist in the `/users/{userId}` collection with `role: 'admin'`. Only the system (or existing admins) can create new admins.
- **Zero-Trust Principle:** The frontend client is never trusted. All writes are strictly validated against field schemas, exact key matches, type enforcement, and boundary limits via Firestore Security Rules (`hasOnly()`, `size()`, `is string`).
- **Read Masking:** Public users can only read documents where `status == 'published'` or `status == 'active'`.

### 2. Firestore Security Rules Strategy
*   **Public Read:** 
    *   `/portfolio`, `/timelineEvents`, `/media`, `/services`, `/categories`, `/products`, `/testimonials`, `/settings`, `/legacy`.
    *   *Constraint:* Allow `list` and `get` ONLY if `status == 'published'` or `isActive == true`.
*   **Public Write:** 
    *   `/quotes` (Create only).
    *   *Constraint:* Strict schema validation enforcing string lengths (e.g., details < 2000 chars) to prevent payload bloat.
*   **Protected System Write (Webhook):**
    *   `/orders`, `/customers`, `/downloadTokens`.
    *   *Constraint:* These collections are locked down (`allow write: if false`) to client SDKs. They are ONLY written to by the backend Node.js Express server using the Firebase Admin SDK after cryptographically verifying the Selar webhook signature.
*   **Protected Admin Operations:**
    *   *Constraint:* `allow read, write: if isAdmin();` applied across all collections for authenticated content management.

### 3. Firebase Cloud Storage Security Rules
The storage bucket is partitioned into two distinct security zones:

#### Public Zone: `/public/...`
- **Usage:** Cover images, portfolio gallery, press kit assets, public media.
- **Rules:** 
  - `allow read: if true;`
  - `allow write: if isAdmin() && isValidImage(request.resource);` (e.g., checking `contentType.matches('image/.*')` and size < 5MB).

#### Secure Zone: `/secure-assets/...`
- **Usage:** Actual digital product files (PDFs, ZIPs, EPUBs) sold through the store.
- **Rules:**
  - `allow read: if false;` (Clients CANNOT directly read these files).
  - `allow write: if isAdmin();` (Admins can upload products via the CMS).
- **Delivery Mechanism:** 
  - When an order is successful, the backend Express server verifies the Selar webhook.
  - The server generates a **Signed URL** with a short expiration time (e.g., 24 hours) using the Firebase Admin SDK.
  - This Signed URL is sent to the customer via email or a secure download portal utilizing a `downloadToken`. This completely circumvents unauthorized sharing of static storage links.
