# Product Requirements Document (PRD)
**Project Name:** Michael Bakare Digital Experience Platform
**Client:** Michael Bakare
**Status:** Approved - Architecture Phase 1 Complete

---

## I. Strategic Foundation

### 1. Product Vision
To build a premium, globally accessible, production-ready digital experience platform that consolidates Michael Bakare's personal brand, professional legacy, service offerings, and digital commerce into a single, cohesive, and sophisticated architectural system. The platform will serve as an internationally credible digital headquarters.

### 2. Business Objectives
- **Lead Generation:** Capture high-intent, high-value professional service inquiries through a streamlined quotation system.
- **Direct Monetization:** Facilitate seamless, secure sales of digital products via automated fulfillment and Selar payment integration.
- **Brand Authority:** Establish international credibility through a premium, editorial visual identity and a meticulously organized legacy archive.
- **Operational Efficiency:** Centralize content management, sales tracking, and quote reviews into a secure, proprietary administrative dashboard.

### 3. Target Audiences
- Corporate clients and organizations seeking professional services or consulting.
- Creative industry peers and collaborators.
- Global consumers of digital products, literature, or digital goods published by Michael Bakare.

### 4. User Personas
- **Persona A: The Corporate Client:** Time-poor, requires immediate understanding of service offerings, past legacy/credibility, and a frictionless way to request a detailed, high-budget quote.
- **Persona B: The Digital Consumer:** Discovers the brand via external channels, seeks to browse available digital products, expects a secure and instant checkout/delivery process via regional payment providers (Selar).
- **Persona C: The Administrator (Michael Bakare & Team):** Requires secure, low-friction access to review incoming quotes, track sales, upload new legacy items, and manage digital store inventory without technical intervention.

### 5. Core User Journeys
- **The Service Journey:** User lands on the platform $\rightarrow$ reviews Professional Services $\rightarrow$ browses Portfolio for credibility $\rightarrow$ submits a tailored Request-a-Quote $\rightarrow$ Admin receives and reviews the inquiry.
- **The Commerce Journey:** User lands on Digital Store $\rightarrow$ browses products $\rightarrow$ adds to Shopping Cart $\rightarrow$ proceeds to Selar Checkout $\rightarrow$ payment verified via Webhook $\rightarrow$ secure digital delivery.
- **The Management Journey:** Admin logs in securely via Firebase Auth $\rightarrow$ accesses CMS Dashboard $\rightarrow$ reviews pending quotes, processes new portfolio entries, uploads media to Storage.

---

## II. Platform Requirements

### 6. Functional Requirements
- Secure administrator authentication system (Firebase Auth).
- CRUD (Create, Read, Update, Delete) capabilities for portfolio items, products, and services via an authenticated CMS.
- Interactive Shopping Cart with local session persistence.
- Server-side webhook listener for Selar payment confirmations.
- Automated generation of secure digital product download links upon verified payment.

### 7. Non-Functional Requirements
- **Availability:** Compatible with cloud-native hosting (Google Cloud Run) for high availability.
- **Code Quality:** Modular React component architecture, strong typing (TypeScript), separation of concerns between client UI and server logic.
- **Maintainability:** Clear API contracts and environment variable management (no secrets in client code).

### 8. Public Website Requirements
- Editorial, timeless, and minimalist UI following the established design tokens.
- Cross-device responsive navigation with subtle, purposeful Framer Motion animations.
- Dynamic data hydration from the Firestore backend.

### 9. Portfolio Requirements
- Dynamic grid layout for professional works.
- Detailed single-item view supporting high-resolution imagery and rich text descriptions.
- Filtering and categorization capabilities.
- **Implemented Categories:** Compositions, Film Scores, Solo Piano, Chamber Works, Choral, Theater & Dance, Productions, and Arrangements.

### 10. Works and Legacy Requirements
- A distinct archival section chronicling historical achievements, awards, publications, and performances.
- **Implemented Legacy Milestones:** Complete chronological narrative (2016-2026), Royal Festival Hall commissions, IFMCA honors, European recital tours, and conservatory fellowships.

### 11. Services Requirements
- Clear, structured presentation of professional service tiers or offerings.
- **Implemented Services:** Film & Media Scoring, Orchestral Arranging & Direction, Masterclasses & Academic Lectures, and Executive Audio Branding & Direction.

### 12. Request-a-Quote Requirements
- Multi-step or comprehensive form capturing Name, Email, Service Type, and detailed project scope.
- Server-side validation of all inputs to prevent abuse.
- Status tracking pipeline (`pending`, `reviewed`, `replied`) managed via the Admin Dashboard.

### 13. Digital Store Requirements
- Grid display of active digital products.
- Support for multi-currency display (USD, NGN, GBP, EUR) mirroring Selar's capabilities.
- Detailed product pages with descriptions and pricing.

### 14. Shopping Cart Requirements
- Persistent cart state across the user session.
- Clear itemization, quantity management, and subtotal calculations prior to Selar redirection.

### 15. Selar Integration Requirements
- **Strict Compliance:** Integration must adhere strictly to official Selar API/Webhook documentation.
- Server-to-server webhook endpoint (`/api/selar/webhook`) to verify transaction signatures before releasing products.
- Checkout redirect mechanism passing cart metadata and customer details to Selar.

### 16. Digital Delivery Requirements
- Delivery of digital goods must be strictly gated behind successful Selar webhook confirmations.
- Secure, authenticated download mechanisms (e.g., signed URLs via Firebase Storage or emailed secure links) to prevent unauthorized file sharing.

---

## III. Administrative & Infrastructure Requirements

### 17. Admin Dashboard Requirements
- Protected route (`/admin`) accessible only to verified administrator emails.
- High-level metric overview: Total pending quotes, recent sales, active products.

### 18. CMS Requirements
- Form-based interfaces to add, edit, or toggle visibility of Portfolio Items and Digital Products.
- Status management interface for Quote Requests.

### 19. Media Management Requirements
- Integration with Firebase Cloud Storage for uploading portfolio imagery and digital product files securely from the CMS.
- Implementation of image placeholders `[IMAGE PLACEHOLDER]` when media is absent.

### 20. SEO Requirements
- Dynamic manipulation of `<title>`, `<meta name="description">`, and OpenGraph tags per page.
- Implementation of `Schema.org` JSON-LD structured data for the Person, Portfolio, and Products.
- Semantic HTML5 structure (proper heading hierarchies).

### 21. Analytics Requirements
- Extensible infrastructure to inject privacy-compliant analytics (e.g., Google Analytics 4) to track user journeys, cart abandonment, and quote conversion rates.

### 22. Security Requirements
- **Zero-Trust Database:** Strict Firestore Security Rules ensuring public users can only write to quotes (create only) and read active products/portfolio items.
- Server-side environment variables for API keys and Selar secrets.
- Input sanitization on all client and server boundaries.

### 23. Accessibility Requirements
- Full WCAG 2.1 AA compliance.
- Keyboard navigability across all menus, forms, and cart interactions.
- Sufficient color contrast adhering to the sophisticated, minimal brand palette.

### 24. Performance Requirements
- Optimized Vite build process.
- Lazy loading for high-resolution portfolio images.
- Sub-second interaction responses and lightweight layout animations.

### 25. Future Scalability Requirements
- The database schema and Express backend must be structured to accommodate physical products, shipping calculations, or multi-author blogging in the future without a complete system rewrite.

---

## IV. Phased Implementation Plan

### Phase 1: MVP (Minimum Viable Product)
- Architecture setup and design system implementation (Completed).
- Public Website shell, Home page, Portfolio grid, and Request-a-Quote system (Completed).
- Basic Firebase provisioning and Zero-Trust rules (Completed).

### Phase 2: E-Commerce & Admin Integration
- Admin Dashboard UI and Firebase Authentication lock-down.
- CMS forms for Portfolio and Quote management.
- Digital Storefront UI and Shopping Cart state management.
- Selar Checkout redirection and Webhook verification endpoint.
- Automated Digital Delivery via Firebase Storage.

### Phase 3: Future Enhancements (Post-Launch)
- Advanced Analytics Dashboard integration.
- Rich text editor for a Blog / Publications section.
- Client Portal for ongoing service tracking and secure invoice management.
- Multi-currency localization mapping.
