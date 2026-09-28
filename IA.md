# Information Architecture & Route Map
**Project:** Michael Bakare Digital Experience Platform
**Status:** Approved - Architecture Phase 1 Complete

---

## 1. UX Consolidation & Rationalization

The initial proposed navigation (Home, About Michael, Works, Projects, Legacy, Services, Publications, Shop, Media, Contact) contains cognitive overlap that could confuse users. Based on UX principles (Hick's Law and cognitive load reduction), the architecture has been streamlined:

1. **Works & Projects $\rightarrow$ Merged into "Works"**: Users typically do not distinguish between a "work" and a "project". These will be consolidated into a single highly-filterable Portfolio hub.
2. **About & Legacy $\rightarrow$ Merged into "About"**: "Legacy" is fundamentally the historical narrative of the individual. This will be a dedicated, immersive section within the "About" page.
3. **Publications, Media & Shop $\rightarrow$ Merged into "Store" and "Media"**: Paid digital publications will live in the "Store" (E-commerce). Free articles, press features, and brand assets will live in "Media".
4. **Contact & Request-a-Quote $\rightarrow$ Merged into "Contact"**: The primary conversion metric is the Quote request. The Contact page will house the Quotation system alongside general inquiry information.

### Final Public Primary Navigation:
Home | About | Works | Services | Store | Media | Contact

---

## 2. Route Map & Sitemap

- `/` (Home)
- `/about` (About Michael & Legacy)
- `/works` (Portfolio & Projects Hub)
  - `/works/:itemId` (Individual Work Detail)
- `/services` (Professional Services)
- `/store` (Digital Shop & Paid Publications)
  - `/store/:productId` (Individual Product Detail)
  - `/cart` (Shopping Cart & Checkout)
- `/media` (Press, Free Publications, Assets)
- `/contact` (Request a Quote & General Contact)
- `/admin` (Protected CMS Dashboard)

---

## 3. Page Definitions

### 3.1. Home (`/`)
- **Purpose:** Act as the digital concierge, establishing premium brand authority and routing users to high-value actions.
- **Target Audience:** All personas (Corporate Clients, Digital Consumers).
- **Content:** Hero introduction, featured service highlights, selected works carousel, featured digital product, social proof/legacy stats.
- **CTA:** "Explore Works", "Request a Quote", "Visit Store".
- **Components:** Hero Banner, Bounded Feature Grids, Testimonial/Stat Block, Newsletter Signup.
- **SEO Intent:** Brand exact match ("Michael Bakare"), "Creative Director", "Professional Services". Schema: `Person`, `WebSite`.
- **Data Source:** Static layout hydrated with featured items from Firestore (`portfolio`, `products`).
- **Related Pages:** Works, Services, Store.

### 3.2. About (`/about`)
- **Purpose:** Chronicle Michael Bakare’s biography, credentials, and legacy.
- **Target Audience:** Corporate clients verifying credibility, peers, press.
- **Content:** Detailed biography, historical timeline (Legacy), awards, philosophies, high-quality editorial photography.
- **CTA:** "View Services", "Download Press Kit".
- **Components:** Split-pane text/image blocks, Timeline/Chronology component, Press Logo grid.
- **SEO Intent:** Biographical queries, background, credentials. Schema: `AboutPage`, `Person`.
- **Data Source:** Primarily static/CMS-driven text.
- **Related Pages:** Media, Works.

### 3.3. Works Hub (`/works`)
- **Purpose:** Showcase the professional portfolio and past projects.
- **Target Audience:** Prospective corporate and creative clients.
- **Content:** Filterable grid of projects categorized by discipline/industry.
- **CTA:** "View Project".
- **Components:** Category Filter Bar, Asymmetric Image Grid, Hover-reveal cards.
- **SEO Intent:** Portfolio, case studies, specific project keywords. Schema: `CollectionPage`.
- **Data Source:** Firestore `portfolio` collection.
- **Related Pages:** Work Detail, Services.

### 3.4. Work Detail (`/works/:itemId`)
- **Purpose:** Deep dive into a specific project's challenges, solutions, and outcomes.
- **Target Audience:** Deep-researching clients.
- **Content:** High-res imagery, project scope, client name (if public), role, outcome metrics.
- **CTA:** "Start a Similar Project" (Routes to Contact/Quote).
- **Components:** Hero Image/Video, Rich Text Content Block, Metadata Sidebar, "Next Project" pagination.
- **SEO Intent:** Long-tail keywords related to the specific project/industry. Schema: `CreativeWork`.
- **Data Source:** Firestore `portfolio` document.
- **Related Pages:** Contact, Works Hub.

### 3.5. Services (`/services`)
- **Purpose:** Outline professional offerings, methodologies, and engagement models.
- **Target Audience:** Corporate clients ready to hire.
- **Content:** Service tiers, process explanation, deliverables, baseline timelines.
- **CTA:** "Request a Quote".
- **Components:** Accordion/Tabbed Service details, Process Timeline, Sticky CTA banner.
- **SEO Intent:** "Hire Michael Bakare", specific service keywords (e.g., "Digital Consulting"). Schema: `Service`.
- **Data Source:** Static structural content.
- **Related Pages:** Contact, Works (for proof).

### 3.6. Store Hub (`/store`)
- **Purpose:** Sell digital products and paid publications.
- **Target Audience:** Digital consumers, industry peers.
- **Content:** Product grid with prices (multi-currency support), product categories (E-books, templates, courses).
- **CTA:** "Add to Cart", "Buy Now".
- **Components:** Product Cards with Price Tags, Currency Selector, Category Nav.
- **SEO Intent:** E-commerce queries, digital downloads, book titles. Schema: `ItemList`.
- **Data Source:** Firestore `products` collection (where `isActive == true`).
- **Related Pages:** Product Detail, Cart.

### 3.7. Product Detail (`/store/:productId`)
- **Purpose:** Convert interest into a sale for a specific digital asset.
- **Target Audience:** High-intent digital consumers.
- **Content:** Product cover image, detailed description, table of contents/features, price, reviews/ratings (future).
- **CTA:** "Add to Cart".
- **Components:** Product Showcase Split View, Rich Text Description, Sticky Add-to-Cart bar on mobile.
- **SEO Intent:** Specific product name, author name. Schema: `Product`.
- **Data Source:** Firestore `products` document.
- **Related Pages:** Cart, Store Hub.

### 3.8. Cart & Checkout (`/cart`)
- **Purpose:** Review selected items, calculate totals, and transition to Selar payment gateway.
- **Target Audience:** Consumers ready to purchase.
- **Content:** Line items, quantities, subtotal, terms agreement.
- **CTA:** "Proceed to Secure Checkout".
- **Components:** Line Item List, Order Summary Panel, Secure Payment Badges.
- **SEO Intent:** `noindex` (Private transactional page). Schema: `CheckoutPage`.
- **Data Source:** Client-side local storage (Cart state), hydrating product details from Firestore.
- **Related Pages:** Selar Gateway (External).

### 3.9. Media (`/media`)
- **Purpose:** Host free publications, press releases, interviews, and brand assets.
- **Target Audience:** Journalists, fans, industry peers.
- **Content:** Article feed, downloadable press kits, embedded interviews/podcasts.
- **CTA:** "Read More", "Download Kit".
- **Components:** Article List/Grid, Download Button Cards, Media Embeds.
- **SEO Intent:** Thought leadership, industry commentary, "Michael Bakare press". Schema: `Article`, `NewsArticle`.
- **Data Source:** Static or future Firestore `media` collection.
- **Related Pages:** About.

### 3.10. Contact & Quote (`/contact`)
- **Purpose:** Capture high-value leads and general inquiries.
- **Target Audience:** Prospective clients.
- **Content:** Multi-step Quote Request form, general contact email, response time expectations.
- **CTA:** "Submit Request".
- **Components:** Complex Form (Validation, Step-by-step or Long-form), Success State Animation.
- **SEO Intent:** "Contact Michael Bakare". Schema: `ContactPage`.
- **Data Source:** Writes to Firestore `quotes` collection.
- **Related Pages:** Services.

---

## 4. System & Navigational Design

### 4.1. Global Navigation
- **Desktop:** Sticky top header. Left-aligned Logo/Monogram. Center-aligned links (About, Works, Services, Store, Media). Right-aligned Cart Icon (with badge) and solid "Request Quote" button.
- **Behavior:** Background transitions from transparent to solid white/frosted glass on scroll to maintain editorial feel without obscuring content.

### 4.2. Footer
- **Layout:** Minimal, grid-based.
- **Columns:** 
  1. Brand Monogram & Copyright.
  2. Quick Links (Store, Works, About).
  3. Legal (Terms, Privacy, Refund Policy - critical for Selar).
  4. Social Links (LinkedIn, Twitter/X, etc.).
- **Utility:** Admin Login hidden quietly in the copyright row.

### 4.3. Mobile Navigation
- **Trigger:** Hamburger menu in the top right.
- **State:** Full-screen modal overlay (frosted glass/solid background).
- **Typography:** Oversized, serif typography for links to enhance touch targets and premium feel.
- **Placement:** Cart icon remains visible in the header even when the menu is closed.

### 4.4. Breadcrumb System
- **Implementation:** Utilized exclusively in deep nested structures (Store and Works).
- **Format:** `Store / E-Books / [Product Name]` or `Works / Consulting / [Project Name]`.
- **Design:** Small, muted sans-serif typography (e.g., `text-zinc-500 text-xs tracking-widest uppercase`).

### 4.5. Search Architecture
- **Phase 1 (MVP):** No global search. Cognitive load is managed through strict categorization.
- **Local Search:** Client-side text filtering applied only within the Store and Works hubs (e.g., a simple input field that filters the rendered React state).

### 4.6. Product Navigation (Store)
- **Design:** Horizontal scrollable pill/tab list below the Store page header (e.g., `All` | `E-Books` | `Templates` | `Masterclasses`).
- **Behavior:** Updates URL parameters (`?category=ebooks`) for shareability and SEO.

### 4.7. Portfolio Navigation (Works)
- **Design:** Sticky sidebar (desktop) or sticky dropdown (mobile) allowing users to filter by industry or discipline.
- **Interactions:** Seamless cross-fade animations (Framer Motion) when items enter/exit the filtered grid.

### 4.8. Service Navigation
- **Design:** Anchor jump-links within the Services page. Since services are high-consideration, they are laid out sequentially on a single long-scroll page to tell a cohesive story, rather than clicking into multiple sub-pages. A sticky table-of-contents on the left tracks scroll position.
