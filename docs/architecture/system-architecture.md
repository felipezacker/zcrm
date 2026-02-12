# NossoCRM Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the NossoCRM codebase, including technical debt, patterns, and structure. It serves as a reference for AI agents working on enhancements or refactoring.

### Document Scope
Comprehensive documentation of the entire system as part of the Brownfield Discovery workflow.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-11 | 1.0 | Initial brownfield analysis | Architect Agent (Orion) |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `app/layout.tsx` (Root layout)
- **Configuration**: `next.config.ts`, `tailwind.config.js`, `.env.example`
- **Core Libraries**: `lib/supabase/`, `lib/ai/`, `lib/auth/`
- **API Routes**: `app/api/` (Next.js App Router API)
- **Database Schema**: `supabase/migrations/` (SQL migrations)
- **Global Styles**: `app/globals.css`
- **Authentication**: `app/auth/`, `lib/supabase/server.ts`, `lib/supabase/client.ts`
- **Installation Wizard**: `app/install/`

## High Level Architecture

### Technical Summary
NossoCRM is a modern CRM application built with Next.js 16 (App Router), leveraging Supabase for backend services (Database, Auth, Realtime) and deployed on Vercel. It features an AI assistant integration using Vercel AI SDK.

### Actual Tech Stack

| Category | Technology | Version | Notes |
|----------|------------|---------|--------|
| Runtime | Node.js | >=20 | Driven by `package.json` engines/types |
| Framework | Next.js | 16.0.10 | App Router, Server Actions, RSC |
| Language | TypeScript | 5.x | Strict mode enabled |
| Database | PostgreSQL | 15+ | Managed by Supabase |
| Auth | Supabase Auth | - | Email/Password, potential OAuth |
| ORM | None / Raw SQL | - | Uses `@supabase/supabase-js`, direct SQL in migrations |
| UI Framework | React | 19.2.1 | Latest React features |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Components | Radix UI | - | Headless UI primitives |
| AI | Vercel AI SDK | 3.x/4.x | Google, OpenAI, Anthropic adapters |
| Testing | Vitest | 4.x | Unit and Integration testing |
| Monitoring | Sentry | 10.x | Error tracking and performance |
| Analytics | Web Vitals | 5.x | Performance metrics |

### Repository Structure Reality Check

- **Type**: Monorepo structure within a single package (not using workspaces, but organized by domain in `features/`).
- **Package Manager**: npm (lockfile v3)
- **Notable**: `docs/` folder is well-populated. `app/install` suggests a self-hosted/installable nature.

## Source Tree and Module Organization

### Project Structure (Actual)

```text
project-root/
├── app/                 # Next.js App Router
│   ├── (protected)/     # Authenticated routes (dashboard, pipeline, etc.)
│   ├── api/             # API Routes
│   ├── auth/            # Auth pages
│   ├── install/         # Installation wizard
│   ├── join/            # Invite acceptance
│   ├── login/           # Login page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # Shared UI components (likely shadcn/ui style)
├── features/            # Domain-specific modules (inferred from imports/usage)
├── lib/                 # Shared utilities and core logic
│   ├── ai/              # AI SDK configuration and helpers
│   ├── auth/            # Auth utilities
│   ├── supabase/        # Supabase client clients (server/client/middleware)
│   ├── utils/           # General helpers
│   └── ...              # Other libs (sentry, analytics, logger)
├── public/              # Static assets
├── supabase/            # Supabase configuration
│   ├── migrations/      # SQL migrations
│   └── config.toml      # Local dev config
├── test/                # Test setup and utilities
└── docs/                # Project documentation
```

### Key Modules and Their Purpose

- **Authentication**: Managed via Supabase Auth + Middleware (`lib/middleware/`).
- **Database Access**: `lib/supabase/` provides typed clients. Migrations in `supabase/migrations/` define the schema.
- **AI Integration**: `lib/ai/` handles interactions with LLMs using Vercel AI SDK.
- **CRM Features**: Likely located in `features/` (not fully explored yet, but inferred from standard practices and `app` structure).
- **Installation**: `app/install/` and `lib/installer/` handle the setup wizard logic.

## Data Models and APIs

### Data Models
Schema is defined in `supabase/migrations/`.
There isn't a centralized ORM class definition (like Prisma schema), so truth is in SQL files.
`lib/supabase/database.types.ts` (if exists, usually generated) provides TypeScript types.

### API Specifications
- **Internal API**: `app/api/` contains Next.js Route Handlers.
- **External API**: Documented in `docs/public-api.md` (referenced in README).

## Technical Debt and Known Issues

### Critical Technical Debt (Inferred)
1. **Raw SQL Migrations**: While powerful, managing raw SQL migrations without an ORM layer can lead to drift or complexity in type generation if not automated.
2. **"features/" Directory**: Need to verify if `features/` is strictly enforced or if logic leaks into `app/` or `lib/`.
3. **Testing Coverage**: `vitest` is set up, but coverage needs verification.

### Workarounds and Gotchas
- **Installation Flow**: The app has a custom installation wizard (`app/install`), which implies state management for "installed" vs "not installed" (likely in DB or basic env check).
- **Barrel Files**: `next.config.ts` has `optimizePackageImports` for `lucide-react`, etc., to handle tree-shaking performance.

## Integration Points and External Dependencies

### External Services
| Service | Purpose | Integration Type | Key Files |
|---------|---------|------------------|-----------|
| Supabase | Backend (Auth, DB, Realtime) | SDK | `lib/supabase/` |
| Vercel | Hosting & AI SDK | SDK/Platform | `next.config.ts`, `lib/ai/` |
| Sentry | Error Monitoring | SDK | `sentry.*.config.ts` |
| Google/OpenAI/Anthropic | AI Models | API via SDK | `lib/ai/` |

### Internal Integration Points
- **Webhooks**: Mentioned in README/docs (`docs/webhooks.md`).
- **Events**: Likely uses Supabase Realtime for live updates.

## Development and Deployment

### Local Development Setup
1. Clone repo
2. Copy `.env.example` to `.env.local`
3. `npm install`
4. `npm run dev` for Supabase (if local) + Next.js

### Build and Deployment
- **Build**: `npm run build` (Next.js build)
- **Deploy**: Vercel (standard Next.js deployment)
- **Env Vars**: Critical for Supabase connection and AI keys.

## Testing Reality
- **Unit/Integration**: Vitest configured (`vitest.config.ts`).
- **E2E**: Playwright mentioned in `package.json` (`playwright` devDep).
- **Scripts**: `test`, `test:run`, `smoke:integrations`.

## Success Criteria Checklist
- [x] Tech stack identified
- [x] Project structure mapped
- [x] Data layer approach identified (Supabase + Migrations)
- [x] Key integration points listed
- [x] Initial technical debt assessment
