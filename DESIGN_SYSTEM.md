# Design System Specification
**Project:** Michael Bakare Digital Experience Platform
**Status:** Approved - Architecture Phase 1 Complete

---

## 1. Brand Personality & Core Principles
**Design Philosophy:** Clean editorial sophistication. The platform merges contemporary human-centered design with the quiet elegance of classical music culture, premium publishing, and refined cultural institutions. 
- **Intelligent:** Clear, intentional, and content-first. No decorative clutter.
- **Artistic:** Celebrates negative space, exquisite typography, and high-quality imagery.
- **Elegant:** Mathematical precision in layouts and restrained interactions.
- **Warm:** Avoids clinical, cold tech aesthetics in favor of tactile, organic nuances.
- **Internationally Credible:** Speaks a universal visual language of premium quality.

---

## 2. Colour System
The palette is built on warm, sophisticated neutrals to create a high-contrast but eye-safe reading environment.

*   **Backgrounds:**
    *   `Canvas Primary:` Warm Off-White (`#FAFAFA` or Tailwind `zinc-50`)
    *   `Surface Elevated:` Pure White (`#FFFFFF`) for cards and overlapping containers.
    *   `Canvas Inverted:` Deep Charcoal (`#18181B` or Tailwind `zinc-900`) for high-contrast sections (e.g., Footers, Hero feature blocks).
*   **Typography:**
    *   `Text Primary:` Deep Charcoal (`#18181B`) for maximum legibility without the harshness of pure black.
    *   `Text Secondary:` Warm Grey (`#71717A` or Tailwind `zinc-500`) for metadata, timestamps, and subtitles.
    *   `Text Inverted:` Pure White (`#FFFFFF`) or Light Grey (`#E4E4E7`) on dark backgrounds.
*   **Accents & Borders:**
    *   `Border Subtle:` Light Warm Grey (`#E4E4E7` or Tailwind `zinc-200/50`).
    *   `Focus Ring:` Deep Charcoal (`#18181B`).
*   *(Note: No vibrant accent colors, gradients, or cyan/purple glows. Hierarchy is achieved through contrast and scale).*

---

## 3. Typography System
Pairing a classical, authoritative serif with a highly legible, modern geometric sans-serif.

*   **Display / Headings:** `Newsreader` (Serif, Italic/Regular/Medium)
*   **Body / UI Controls:** `Instrument Sans` (Sans-Serif, Light/Regular/Medium)

### 4. Heading Hierarchy
*   **H1 (Hero):** 5xl to 7xl (`48px` to `72px`), `Newsreader`, Medium, tight tracking (`tracking-tight`), line-height `1.1`.
*   **H2 (Section):** 3xl to 4xl (`30px` to `36px`), `Newsreader`, Medium, line-height `1.2`.
*   **H3 (Card/Item):** xl to 2xl (`20px` to `24px`), `Newsreader`, Regular, line-height `1.3`.
*   **Label/Kicker:** xs (`12px`), `Instrument Sans`, Semibold, uppercase, wide tracking (`tracking-widest`).

### 5. Body Typography
*   **Body Large (Lead):** lg to xl (`18px` to `20px`), `Instrument Sans`, Light, line-height `1.7`.
*   **Body Default:** base (`16px`), `Instrument Sans`, Regular, line-height `1.6`. Width constrained to `max-w-prose` (approx 65-75 characters) for optimal readability.
*   **Caption/Legal:** sm (`14px`), `Instrument Sans`, Light, text-zinc-500.

---

## 6. Spacing & Layout Systems

### Spacing System
Based on a strict 8px baseline grid (with 4px for micro-adjustments).
- **Micro:** 4px, 8px (Inner button padding, icon gaps).
- **Component Inner:** 16px, 24px, 32px (Card padding, form inputs).
- **Component Outer:** 48px, 64px (Spacing between distinct elements in a section).
- **Section/Rhythmic:** 96px, 128px, 192px (Generous vertical padding between major page sections).

### 7. Grid System
- 12-column fluid grid on desktop.
- 6-column on tablet.
- 4-column (or 1-column stacked) on mobile.
- **Gutters:** 24px (desktop), 16px (mobile).

### 8. Container System
- **Max Width:** `max-w-7xl` (1280px) to prevent infinite stretching on ultra-wide monitors.
- **Alignment:** Always `mx-auto` (centered).
- **Padding:** Outer padding `px-6` on mobile, `md:px-12` on desktop.

---

## Component Library Specification

### 9. Buttons
- **Primary:** Solid `#18181B` background, `#FFFFFF` text. Fully rounded (`rounded-full`) for an elegant, organic feel. Padding: `px-8 py-4` (horizontal padding strictly 2x vertical).
- **Secondary:** Transparent background, `#18181B` border (`border-zinc-200` resting, `border-zinc-900` hover), `#18181B` text. Fully rounded.
- **Text/Link:** Border-bottom only, uppercase, wide tracking, with a subtle hover transition affecting border color/opacity.

### 10. Cards
- **Base:** `#FFFFFF` background, subtle border (`border-zinc-200`), NO heavy drop shadows. Border radius: `rounded-2xl` (16px).
- **Nesting Rule:** NO nested cards. Content sits directly on the canvas or within a single, flat card.

### 11. Forms & 12. Inputs
- **Inputs/Textareas:** Background `#FAFAFA`, border `zinc-200`, `rounded-xl` (12px).
- **Labels:** `text-sm`, `font-medium`, `text-zinc-700`, positioned above the input (never as placeholders alone).
- **Focus State:** 2px solid ring (`ring-zinc-900`), removing default browser outlines.

### 13. Navigation
- **Header:** Fixed top, translucent background (`backdrop-blur-md` with `#FAFAFA/80`). Bottom border `zinc-200/50`.
- **Links:** `text-sm`, `tracking-wide`, smooth color transition on hover (`zinc-500` to `zinc-900`).

### 14. Modals
- **Backdrop:** `#FAFAFA/90` frosted glass.
- **Container:** Pure white, `rounded-3xl`, subtle entrance scale (0.95 -> 1.0).

### 15. Product Cards (Store)
- **Image:** Square (1:1) or Portrait (3:4) aspect ratio, `bg-zinc-100` placeholder fill.
- **Content:** Title (Serif, `text-2xl`), Price (Sans-serif, `font-medium`), "Add to Cart" button revealed on hover or placed cleanly below.

### 16. Portfolio Cards (Works)
- **Image:** 4:3 or 16:9 aspect ratio. Overflow hidden, `rounded-2xl`.
- **Hover:** Image scales up by 5% (`scale-105`) slowly over 700ms.
- **Metadata:** Uppercase category kicker, Serif title. Minimalist.

### 17. Service Cards
- Flat layout. Often built as an accordion list or an asymmetric grid rather than literal "cards" to maintain the editorial feel. Typography-led.

### 18. Testimonial Components
- Large Serif typography (`text-3xl`, italicized), accompanied by the client's name and role in uppercase sans-serif.

### 19. Media Components
- Full-width or container-width image/video blocks. Sharp or `rounded-2xl` corners. Caption text underneath in `text-sm text-zinc-500`.

### 20. Tables
- Clean, border-bottom only for rows. No vertical borders. Header row uses uppercase `text-xs` typography. Used heavily in the Admin Dashboard.

---

## States & Feedback

### 21. Alerts
- Minimalist banners. 
- Success: Green-tinted background (`bg-green-50`), dark green text.
- Info: Grey-tinted (`bg-zinc-100`), dark grey text.

### 22. Empty States
- Used in Cart, Works, or Dashboard.
- Dashed border (`border-dashed border-zinc-200`), centered text, muted typography (`text-zinc-500`), and a clear call-to-action button (e.g., "Return to Store").

### 23. Loading States
- **Primary:** Skeleton screens matching the exact geometry of the loaded content (e.g., grey boxes pulsing subtly). No spinning circles for primary content loading.
- **Buttons:** Text swaps to "Processing..." and opacity drops to 50%.

### 24. Error States
- Inline form validation errors: `text-sm text-red-600` below the input. Input border turns red.
- Page errors: Centered message with a "Return Home" action.

### 25. Accessibility States
- **Contrast:** All body text meets WCAG AA 4.5:1 ratio (e.g., `zinc-500` on `#FAFAFA`).
- **Focus:** All interactive elements have a visible focus ring (`focus:outline-none focus:ring-2 focus:ring-zinc-900`) for keyboard navigation.
- **Touch Targets:** Minimum 44x44px for all mobile icons and buttons.

---

## Responsive Rules

*   **Mobile (< 640px):** Single column layouts. 16px baseline margins. Headings scale down (e.g., H1 becomes `48px`). Hamburger navigation required.
*   **Tablet (640px - 1023px):** 2-column grids for portfolios and products. 24px/32px margins.
*   **Laptop (1024px - 1279px):** 3-column grids. 48px margins. Hover interactions become active (touch disabled).
*   **Desktop (1280px - 1535px):** Standard viewing experience. 12-column grid active.
*   **Large Desktop (> 1536px):** Content remains locked to max-width (1280px). Margins expand fluidly.

---

## Motion & Interaction (Animation Philosophy)

**Rule:** Subtle motion only. Absolutely no bouncing, heavy elasticity, or aggressive sliding. Motion should feel like turning a page in a high-end magazine or drawing breath.

*   **Easing Curve:** Custom cubic-bezier: `ease: [0.22, 1, 0.36, 1]` (Decelerated, incredibly smooth).
*   **Page Transitions:** Fade in (`opacity: 0 -> 1`) over 400ms.
*   **Reveal Animations (Scroll):** Elements fade in and translate upward by exactly `20px`. Staggered delays (`0.1s`) for lists/grids.
*   **Hover States (Buttons):** Background color cross-fade over 200ms.
*   **Image Transitions:** Images within portfolio cards scale up (`scale: 1.05`) over a slow `700ms` duration on hover.
*   **Micro-interactions:** Accordion openings animate `height` smoothly. Modals scale slightly `0.95 -> 1.0` upon entering.
