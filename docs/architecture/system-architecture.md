# System Architecture - ZCRM

**Project:** crmia-next v0.1.0
**Generated:** 2026-02-07
**Type:** Brownfield - Existing Project Assessment

---

## 1. Stack Tecnológico

### Frontend
- **Framework:** Next.js 16.0.10 (App Router)
- **UI Library:** React 19.2.1
- **Styling:** TailwindCSS 4 + PostCSS
- **Component Library:** Radix UI (primitives + headless components)
- **Forms:** React Hook Form + Zod validation
- **State Management:** Zustand 5.0.9
- **Data Fetching:** TanStack React Query 5.90.12
- **Animations:** Framer Motion 12.23.26
- **Icons:** Lucide React 0.560.0
- **Charts:** Recharts 3.5.1
- **PDF Export:** jsPDF 3.0.4 + jsPDF-AutoTable 5.0.2

### Backend/Services
- **Backend Framework:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (@supabase/ssr 0.8.0)
- **Client:** @supabase/supabase-js 2.87.1
- **AI Integration:**
  - Vercel AI SDK 6.0.72
  - @ai-sdk/anthropic 3.0.37
  - @ai-sdk/google 3.0.21
  - @ai-sdk/openai 3.0.25
  - @ai-sdk/react 3.0.74
- **Database Driver:** pg 8.16.3

### Development Tools
- **Language:** TypeScript 5
- **Testing:** Vitest 4.0.0 + Testing Library
- **Linting:** ESLint 9
- **Accessibility:** Axe Core 4.10.3 + vitest-axe
- **Package Manager:** npm 9+
- **Node Version:** 18+

---

## 2. Estrutura do Projeto

### Arquitetura por Features
```
zcrm/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   ├── auth/                     # Authentication pages
│   ├── login/
│   ├── join/
│   ├── install/
│   └── (protected)/              # Protected routes
│
├── features/                     # Feature modules (vertical slices)
│   ├── activities/               # Activity tracking & timeline
│   │   ├── components/
│   │   └── hooks/
│   ├── ai-hub/                   # AI features & integrations
│   │   └── hooks/
│   ├── boards/                   # Kanban/board views
│   │   ├── components/
│   │   └── hooks/
│   ├── contacts/                 # Contact management
│   │   ├── components/
│   │   └── hooks/
│   ├── dashboard/                # Main dashboard
│   │   ├── components/
│   │   └── hooks/
│   ├── deals/                    # Sales deals management
│   ├── decisions/                # Decision tracking
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── inbox/                    # Messaging/inbox
│   │   ├── components/
│   │   └── hooks/
│   ├── profile/                  # User profile
│   ├── reports/                  # Reporting & analytics
│   │   └── utils/
│   └── settings/                 # Configuration
│       ├── components/
│       └── hooks/
│
├── components/                   # Shared UI components
├── types/                        # TypeScript type definitions
├── lib/                          # Shared utilities & helpers
├── utils/                        # Common utility functions
├── hooks/                        # Shared React hooks
├── services/                     # API clients & services
│
└── test/                         # Test files & fixtures
```

### Padrões de Arquitetura
- **Feature-based organization:** Cada feature tem seus próprios components, hooks, services
- **Vertical slicing:** Features contêm UI, lógica, serviços
- **Shared components layer:** Componentes reutilizáveis em `components/`
- **Type-safe:** Tipos centralizados em `types/`

---

## 3. Camadas & Responsabilidades

### Frontend Layer
- **Components:** Radix UI primitives + custom components
- **State Management:** Zustand stores
- **Data Fetching:** TanStack Query + Supabase client
- **Forms:** React Hook Form + Zod schemas
- **Styling:** TailwindCSS utility-first + component classes

### Backend Layer
- **API Routes:** Next.js API routes (/app/api/)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth + JWT tokens
- **AI Services:** Vercel AI SDK (Claude, GPT-4, Gemini)

### Integration Points
- **Supabase:** Real-time data sync, auth, storage
- **AI Services:** Chat, completions, generations
- **External APIs:** Via API routes as proxy layer

---

## 4. Fluxos Principais

### Authentication Flow
1. User accesses `/login` or `/join`
2. Supabase Auth handles signup/signin
3. JWT token stored (via @supabase/ssr)
4. Redirects to protected routes
5. API routes verify JWT on requests

### Data Flow (Example: Contacts)
1. User navigates to `/contacts`
2. Component mounts, uses `contacts` hook
3. Hook uses TanStack Query to fetch from `/api/contacts`
4. API route queries Supabase
5. Data returned to component
6. Component renders with TailwindCSS + Radix UI

### AI Integration
1. User interacts with AI features (ai-hub)
2. Frontend sends prompt to `/api/ai/*`
3. Server uses Vercel AI SDK to call LLM
4. Response streamed back via ReadableStream
5. Frontend updates UI with streamed content

---

## 5. Dependências Críticas

### Direct Dependencies (87 packages)
- **Core:** React, Next.js, TailwindCSS
- **UI Components:** Radix UI (11 packages)
- **Data Management:** React Query, Zustand, Zod
- **AI/LLM:** Vercel AI SDK + 3 provider integrations
- **Database:** Supabase, pg driver
- **Utilities:** date-fns, libphonenumber-js, immer

### Dev Dependencies (18 packages)
- **Testing:** Vitest, Testing Library
- **Type Checking:** TypeScript
- **Linting:** ESLint
- **Accessibility:** Axe Core

---

## 6. Performance Characteristics

### Optimization Opportunities
- ✅ Server-side rendering (SSR) via Next.js
- ✅ Streaming UI with Framer Motion
- ✅ Query caching via React Query
- ⚠️ Image optimization (no next/image found)
- ⚠️ Code splitting strategy (not documented)
- ⚠️ Bundle size tracking (no monitoring)

### Known Bottlenecks
- Large AI responses might cause hydration issues
- PDF export (jsPDF) adds ~200KB client-side
- Multiple Radix UI packages increase bundle
- No documented CDN strategy
- Real-time Supabase sync not optimized for large datasets

---

## 7. Security Architecture

### Authentication & Authorization
- **Method:** Supabase Auth + JWT
- **Storage:** Browser cookies (secure via SSR)
- **Verification:** JWT checked in API routes
- **Protected Routes:** Middleware via (protected) folder

### Data Security
- **Database:** Supabase with RLS policies (status TBD)
- **API:** NextAuth-style validation on routes
- **Encryption:** HTTPS enforced
- **Secrets:** Environment variables (.env)

### Security Gaps
- ⚠️ No documented RLS policies
- ⚠️ No rate limiting on API routes
- ⚠️ No CSRF protection mentioned
- ⚠️ API input validation (Zod only on frontend)
- ⚠️ No documented incident response plan

---

## 8. Deployment Strategy

### Current Setup
- **Hosting:** Not documented (likely Vercel for Next.js)
- **Database:** Supabase (cloud-hosted PostgreSQL)
- **Environment:** Staging/production via .env files
- **CI/CD:** GitHub Actions (.github/workflows)

### Build Process
```bash
npm run precheck    # lint + typecheck + test + build
npm run build       # Next.js build
npm start           # Production start
```

### Deployment Considerations
- Build time: ~3-5 minutes (estimated)
- Database migrations: Supabase migrations
- Secrets: Managed via environment variables
- Rollback: Git-based via GitHub

---

## 9. Monitoring & Observability

### Current State
- ❌ No logging framework (console.log only)
- ❌ No error tracking (Sentry, Rollbar)
- ❌ No APM/performance monitoring
- ❌ No analytics instrumentation
- ❌ No database query logging

### Required for Production
- Error tracking & alerting
- Performance monitoring (Core Web Vitals)
- Database query analysis
- User session tracking
- Deployment notifications

---

## 10. Testing Strategy

### Current Setup
- **Framework:** Vitest 4.0.0
- **Components:** Testing Library (React)
- **Accessibility:** vitest-axe + Axe Core
- **Command:** `npm test` or `npm run test:run`

### Coverage
- Unit tests: Component folder structure unclear
- Integration tests: Not documented
- E2E tests: Not implemented
- Accessibility tests: vitest-axe integrated

### Gaps
- No test documentation
- Coverage metrics not tracked
- No CI integration visible
- Smoke tests available: `npm run smoke:integrations`

---

## 11. Known Issues & Debt

### Code Quality
- 📋 No documented coding standards
- 📋 TypeScript strict mode status unclear
- 📋 Eslint max-warnings: 0 (strict)
- 📋 No documented error handling patterns

### Architecture
- 📋 Feature module independence not documented
- 📋 Shared utilities organization could be clearer
- 📋 Service layer patterns inconsistent (some have services/, some don't)
- 📋 No documented data fetching strategy (SWR vs React Query usage)

### Dependencies
- 📋 Multiple Radix UI packages (11) - consider bundling
- 📋 jsPDF adds ~200KB - consider lazy loading
- 📋 No dependency version pinning
- 📋 Dev dependencies not aligned with production build

### Documentation
- 📋 No API documentation (OpenAPI/Swagger)
- 📋 No component storybook
- 📋 No deployment runbook
- 📋 No database schema documentation

### Performance
- 📋 Image optimization not configured
- 📋 Font loading not optimized
- 📋 No mentioned bundle analysis
- 📋 Real-time subscriptions overhead not documented

---

## 12. Technology Recommendations

### Current Strengths
✅ Modern React ecosystem (19.2)
✅ Type-safe development (TypeScript)
✅ Excellent form handling (React Hook Form)
✅ Strong styling foundation (TailwindCSS 4)
✅ Integrated AI capabilities (Vercel AI SDK)

### Improvement Areas
- Add structured logging (pino, winston)
- Implement error boundary & tracking
- Set up database observability
- Create component documentation (Storybook)
- Add E2E testing (Playwright, Cypress)
- Implement feature flags (LaunchDarkly, PostHog)

---

## 13. Team & Skills Required

### Current Stack Expertise Needed
- **Frontend:** React, Next.js, TailwindCSS, Radix UI
- **Backend:** Node.js, TypeScript, PostgreSQL
- **Database:** Supabase, SQL, RLS policies
- **AI/LLM:** Prompting, token management, streaming
- **DevOps:** Docker, GitHub Actions, Vercel

### Onboarding Checklist
- [ ] Clone repo & install dependencies
- [ ] Configure `.env` with Supabase credentials
- [ ] Run `npm run dev`
- [ ] Familiarize with feature structure
- [ ] Review TypeScript types in `types/`
- [ ] Check Supabase schema via dashboard
- [ ] Review `.github/workflows` for CI/CD

---

## 14. Next Steps / Recommendations

**Immediate (Week 1):**
1. ✅ Create system architecture documentation (THIS FILE)
2. ⏳ Audit database schema (RLS, indexes, constraints)
3. ⏳ Review frontend component consistency
4. ⏳ Document API endpoints

**Short-term (Weeks 2-4):**
1. Implement structured logging
2. Add error tracking (Sentry/Rollbar)
3. Create component storybook
4. Add E2E testing
5. Document Supabase migrations

**Medium-term (Month 2):**
1. Performance audit (bundle, Core Web Vitals)
2. Security audit (penetration testing)
3. Load testing & optimization
4. Monitoring & alerting setup

---

## Appendix: Quick Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm start                # Run production build
npm test                 # Run tests (watch mode)
npm run test:run         # Run tests once

# Quality
npm run lint             # ESLint check (zero warnings policy)
npm run typecheck        # TypeScript check (no emit)
npm run precheck         # lint + typecheck + test + build
npm run precheck:fast    # lint + typecheck + test (skip build)

# Testing & Integration
npm run stories          # Run tests matching "stories" pattern
npm run smoke:integrations  # Smoke tests for integrations
```

---

**Document Status:** ✅ Complete
**Last Updated:** 2026-02-07
**Next Review:** Post-database-audit
