# Tech Stack Overview

- **Framework & Runtime:** React 19 with TanStack React Start (Vinxi & Vite) providing SSR and file-based routing via TanStack React Router.
- **Data & State Management:** TanStack React Query for client caching, Zero Sync (client/server mutators) with Zero Cache service for real-time sync, Drizzle ORM and drizzle-zero integration for database access.
- **UI & Styling:** Tailwind CSS (PostCSS, tailwind-merge, tailwindcss-animate), Shadcn UI components (canary), Radix UI primitives, Lucide React icons, clsx & class-variance-authority for utility styling.
- **Forms & Validation:** @tanstack/react-form with @tanstack/zod-form-adapter powered by Zod.
- **Authentication & Database:** Better-auth for auth flows, Drizzle-managed PostgreSQL schemas (with Docker Compose), drizzle-kit for migrations & studio.
- **Tooling & Testing:** Bun/Bunx scripts, Biome (lint & format), Vitest & Testing Library, vite-tsconfig-paths, and shadcn@canary CLI for component scaffolding.

_Patterns:_ Schema-driven code generation, optimistic updates via Zero mutators, file-based routing, and Zod-driven validation.
