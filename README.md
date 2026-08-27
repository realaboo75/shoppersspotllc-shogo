# ShoppersSpot LLC — Founder Studio

> AI-powered business platform. Build, launch, and scale your business with Cherri — your AI assistant.

**Built by:** Aboobakar — Founder, ShoppersSpot LLC  
**Platform:** Vite + React + TypeScript + Tailwind CSS + Prisma (SQLite)  
**Architecture:** Vite/React frontend with Vercel Functions for authentication; see the deployment notes below.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## What's Included

### 🌐 Public Website (`src/components/PublicSite.tsx`)
- Landing page with hero section
- 8 business industry solutions
- Lead capture chatbot (Cherri)
- Marketplace with founder-built projects
- 3-tier pricing page

### 🏢 Founder Studio (`src/components/founder-studio/`)
Private dashboard for managing your business empire:
- **Dashboard** — Welcome, metrics, revenue charts
- **Cherri AI** — Full-page chat with smart responses
- **9 Business Modules** — Projects, Templates, Marketing, Sales, Wallet, Marketplace, Analytics, Settings

### 🎨 Design System
- **Theme:** Light / Dark / Auto
- **Style:** Glassmorphism with gradient borders
- **Animations:** Fade-in, slide-in, scale-in with staggered delays

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5, Vite 7 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Charts | Recharts |
| Icons | lucide-react |
| Database | Prisma 7, SQLite |
| Server | Hono |
| Package Manager | bun |

---

## Authentication and deployment

The Founder Studio authentication boundary is server-side. Configure `FOUNDER_EMAIL`, `FOUNDER_PASSWORD_HASH`, and `AUTH_SECRET` as deployment environment variables; never put real values in source or client-exposed environment variables. Generate a password hash with `PASSWORD='your-password' node scripts/hash-password.mjs` in a secure shell, then store only the resulting hash in the deployment environment.

The frontend can be developed with `npm run dev`; `npm run build && npm start` serves the compiled frontend and the same `/api/auth/*` handlers locally. Vercel deploys the functions from `api/` automatically. Password reset intentionally returns a configuration error until a real email provider and single-use token store are connected. Project data remains local browser demo data until a durable database/API is provisioned; it must not be treated as a multi-user production data store.

Available checks: `npm run typecheck`, `npm test`, and `npm run build`.

## License

© 2026 Shoppers Spot LLC. All rights reserved.

---

*Built with ❤️ by Aboobakar & Cherri AI*