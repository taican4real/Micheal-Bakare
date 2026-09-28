# Michael Bakare Digital Experience Platform - Architecture

## Technology Decisions
- **Frontend Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons), Framer Motion (Subtle Animations)
- **Typography**: Newsreader (Display/Serif), Instrument Sans (Body/Sans)
- **Backend Architecture**: Node.js/Express full-stack setup with Vite middleware, Server-side Gemini API (optional later).
- **Database**: Firebase Cloud Firestore
- **Authentication**: Firebase Auth (Admin initially)
- **Storage**: Firebase Cloud Storage
- **Payments**: Selar Integration

## Routes
- `/` - Landing / Personal Brand Platform
- `/portfolio` - Professional Portfolio
- `/archive` - Works and Legacy Archive
- `/services` - Professional Services Platform
- `/quote` - Request-a-quote System
- `/store` - Digital Product Storefront
- `/cart` - Shopping Cart
- `/admin` - Administrative CMS/Dashboard

## Database Schema (Firestore Blueprint - Upcoming)
- `users`
- `products`
- `orders` (Selar verification)
- `quotes`
- `portfolio_items`
- `settings`

## API Contracts (Upcoming)
- `/api/selar/webhook` - Webhook for Selar Payments
- `/api/admin/*` - Protected admin routes

## Integrations
- **Firebase**: Firestore, Auth, Storage
- **Selar**: Payments and Checkout

## Known Limitations & Outstanding Tasks
- [x] Initialize Firebase configuration and rules (Completed)
- [x] Set up routing and basic layout shells (Completed)
- [x] Implement UI tokens and Design System (Completed)
- [x] Build landing page UI (Completed)
- [x] Build Request-a-quote System (Completed)
- [x] Build Portfolio (Completed)
- [ ] Implement Selar integration
- [ ] Develop CMS Dashboard
- [ ] Digital Storefront
- [ ] Professional Services Details
