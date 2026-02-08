# Frontend Specification - ZCRM

**Project:** crmia-next v0.1.0
**Generated:** 2026-02-07
**Type:** Next.js 16 + React 19 + TailwindCSS 4
**Framework Pattern:** Atomic Design + Component-Driven Development

---

## 1. Technology Stack

### Core Framework
- **Next.js:** 16.0.10 (App Router)
- **React:** 19.2.1
- **TypeScript:** 5.x (strict mode)
- **Node.js:** 18+ recommended

### Styling & Design
- **TailwindCSS:** v4.0.x (CSS-first config via @theme directive)
- **PostCSS:** 4 (via @tailwindcss/postcss)
- **CSS Variables:** OKLCH color space (light & dark modes)
- **Font System:** Inter, Space Grotesk, Cinzel

### UI Components & Primitives
- **Radix UI:** 11 packages (headless components)
  - @radix-ui/react-accordion
  - @radix-ui/react-avatar
  - @radix-ui/react-checkbox
  - @radix-ui/react-dialog
  - @radix-ui/react-dropdown-menu
  - @radix-ui/react-label
  - @radix-ui/react-popover
  - @radix-ui/react-scroll-area
  - @radix-ui/react-select
  - @radix-ui/react-separator
  - @radix-ui/react-slider
  - @radix-ui/react-slot
  - @radix-ui/react-switch
  - @radix-ui/react-tabs
  - @radix-ui/react-tooltip

### Icon Library
- **Lucide React:** 0.560.0 (200+ SVG icons)

### Form & Validation
- **React Hook Form:** 7.68.0 (lightweight form management)
- **Zod:** 4.1.13 (schema validation)

### Data Management
- **TanStack React Query:** 5.90.12 (server state)
- **Zustand:** 5.0.9 (client state)
- **Immer:** 11.0.1 (immutable updates)

### Animation & Motion
- **Framer Motion:** 12.23.26 (declarative animations)

### Utilities
- **clsx:** 2.1.1 (classname builder)
- **tailwind-merge:** 3.4.0 (smart class merging)

---

## 2. Project Structure

```
zcrm/
├── app/                          # Next.js App Router
│   ├── api/                      # Server-side API routes
│   ├── auth/                     # Authentication pages
│   ├── login/
│   ├── join/
│   ├── (protected)/              # Protected route group
│   │   ├── boards/
│   │   ├── contacts/
│   │   ├── deals/
│   │   ├── activities/
│   │   └── ...
│   ├── globals.css               # Global styles (Tailwind v4)
│   ├── layout.tsx                # Root layout
│   └── manifest.ts               # PWA manifest
│
├── components/                   # Reusable UI Components
│   ├── ui/                       # Base components (atoms)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── sheet.tsx
│   │   ├── tabs.tsx
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── popover.tsx
│   │   ├── tooltip.tsx
│   │   ├── FormField.tsx         # molecule: label + input
│   │   ├── ContactSearchCombobox.tsx
│   │   └── ... (19 total)
│   ├── navigation/               # Navigation components
│   │   ├── NavigationRail.tsx
│   │   ├── BottomNav.tsx
│   │   ├── MoreMenuSheet.tsx
│   │   └── navConfig.ts
│   ├── charts/                   # Chart components
│   ├── ai/                       # AI-specific components
│   │   └── AIAssistant.tsx
│   ├── filters/                  # Filter components
│   │   └── PeriodFilterSelect.tsx
│   ├── notifications/            # Notification components
│   ├── debug/                    # Debug utilities
│   ├── pwa/                      # PWA components
│   ├── Layout.tsx                # App layout wrapper
│   ├── PageLoader.tsx
│   ├── MaintenanceBanner.tsx
│   ├── ConsentModal.tsx
│   ├── ConfirmModal.tsx
│   ├── OnboardingModal.tsx
│   └── AIAssistant.tsx
│
├── features/                     # Feature modules (vertical slices)
│   ├── activities/
│   │   ├── components/
│   │   └── hooks/
│   ├── boards/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── contacts/
│   │   ├── components/
│   │   └── hooks/
│   ├── deals/
│   │   └── ...
│   ├── dashboard/
│   │   └── ...
│   ├── ai-hub/
│   │   └── hooks/
│   ├── inbox/
│   │   └── ...
│   ├── reports/
│   │   └── utils/
│   └── settings/
│       └── ...
│
├── hooks/                        # Shared React hooks
│   └── useQuery, useAuth, etc.
│
├── lib/                          # Shared utilities
│   ├── utils.ts                  # cn() classname helper
│   └── ...
│
├── types/                        # Shared TypeScript types
│
├── tailwind.config.js            # Tailwind configuration (legacy compat)
└── app/globals.css               # CSS with Tailwind v4 @theme
```

---

## 3. Design System

### 3.1 Color System (OKLCH)

**Light Mode (Default):**
```css
--color-bg: oklch(97% 0.005 90);           /* Soft cream background */
--color-surface: oklch(99% 0.002 90);      /* Card surfaces */
--color-muted: oklch(95% 0.008 90);        /* Inactive elements */
--color-border: oklch(90% 0.01 90);        /* Borders */
```

**Dark Mode (.dark class):**
```css
--color-bg: oklch(11% 0.025 260);          /* Deep slate */
--color-surface: oklch(15% 0.02 260);
--color-muted: oklch(22% 0.015 260);
--color-border: oklch(26% 0.012 260);
```

**Status Colors (Light & Dark):**
- `--color-success`: oklch(65% 0.17 145) - Green
- `--color-warning`: oklch(75% 0.15 85) - Orange
- `--color-error`: oklch(62% 0.25 25) - Red
- `--color-info`: oklch(60% 0.20 240) - Blue

**Primary Colors (Brand):**
- Blue palette: Sky blue (#0ea5e9) primary
- 10-step scale: primary-50 to primary-900

**Text Colors:**
- Primary: oklch(25% 0.015 260) - Main text
- Secondary: oklch(45% 0.02 260) - Supporting text
- Muted: oklch(55% 0.025 260) - Subtle text
- Subtle: oklch(62% 0.025 260) - Very subtle

### 3.2 Typography

**Font Families:**
```css
--font-sans: 'Inter', var(--font-inter), sans-serif;      /* Default */
--font-display: 'Space Grotesk', sans-serif;              /* Headings */
--font-serif: 'Cinzel', serif;                            /* Accents */
```

**Type Scale (TailwindCSS defaults):**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### 3.3 Spacing System

**Scale:** 4px base unit (TailwindCSS default)
```
1 = 4px,   2 = 8px,   3 = 12px,   4 = 16px,   5 = 20px,   6 = 24px,
8 = 32px,  10 = 40px, 12 = 48px,  16 = 64px,  20 = 80px,  24 = 96px
```

**Common Usage:**
- Padding: p-4 (standard), p-6 (cards)
- Margins: m-4, m-6
- Gaps: gap-2 (tight), gap-4 (normal)

### 3.4 Shadow System

**Tailwind Defaults (no customization):**
- sm: 0 1px 2px 0 rgba(0,0,0,0.05)
- md: 0 4px 6px -1px rgba(0,0,0,0.1)
- lg: 0 10px 15px -3px rgba(0,0,0,0.1)
- xl: 0 20px 25px -5px rgba(0,0,0,0.1)

### 3.5 Border Radius

**Defaults:**
- sm: 0.125rem (2px)
- base: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px) ← Most common in ZCRM
- xl: 1rem (16px)
- full: 9999px (circles)

### 3.6 Transition & Animation

**Durations:**
- fast: 150ms
- base: 200ms
- slow: 300ms

**Animations (Framer Motion defaults):**
- Spring physics for interactive elements
- Fade transitions for modals
- Slide animations for side sheets

---

## 4. Component Hierarchy (Atomic Design)

### 4.1 Atoms (Base Components)

**Form Elements:**
- `Button` - CTA button with variants (primary, secondary, ghost)
- `Input` - Text input (styled with Tailwind)
- `Textarea` - Multi-line input
- `Label` - Form label
- `Checkbox` - Radix-based checkbox
- `Radio` - Radix-based radio button
- `Select` - Radix-based select dropdown
- `Slider` - Radix-based range slider
- `Switch` - Radix-based toggle switch

**Display Elements:**
- `Badge` - Status / label badge
- `Alert` - Alert message container
- `Avatar` - User profile picture
- `Icon` - Lucide SVG icon wrapper
- `Tooltip` - Radix-based tooltip

**Structural:**
- `Card` - Container with border & shadow
- `Separator` - Visual divider (Radix)
- `ScrollArea` - Custom scrollbar (Radix)

### 4.2 Molecules (Combinations)

**Form Molecules:**
- `FormField` - Label + Input + Error message
- `SearchInput` - Input + Clear button + Icon
- `DatePicker` - Input + Calendar popup
- `TimeSelect` - Select styled as time picker

**Navigation Molecules:**
- `NavLink` - Link with active state indicator
- `BreadcrumbItem` - Single breadcrumb
- `TabsHeader` - Tab navigation (Radix)

**Data Display:**
- `DataTable` - Table with sorting/filtering
- `ListItem` - Row item (contact, deal, activity)
- `StatCard` - Metric display card

**Modals & Overlays:**
- `Modal` - Dialog wrapper (Radix Dialog)
- `ConfirmModal` - Yes/No dialog
- `Sheet` - Side sheet drawer
- `ActionSheet` - Bottom action menu
- `Popover` - Popover container (Radix)

### 4.3 Organisms (Complex Components)

**Navigation:**
- `NavigationRail` - Sidebar navigation (desktop)
- `BottomNav` - Bottom navigation (mobile)
- `HeaderBar` - App header with logo/menu

**Forms:**
- `ContactForm` - New/edit contact form
- `DealForm` - New/edit deal form
- `FilterPanel` - Advanced filters UI

**Sections:**
- `DealCard` - Deal card with actions
- `ContactCard` - Contact profile card
- `ActivityTimeline` - Timeline of activities
- `KanbanBoard` - Draggable Kanban columns

**Data Visualization:**
- `PipelineChart` - Sales pipeline dashboard
- `ForecastChart` - Revenue forecast
- `ActivityChart` - Activity metrics chart

### 4.4 Templates (Page Layouts)

- `ProtectedLayout` - Main app layout with nav + content
- `AuthLayout` - Login/signup layout
- `DashboardTemplate` - Dashboard with widgets
- `DetailTemplate` - Detail view (contact, deal)
- `ListTemplate` - List view with filters

### 4.5 Pages (Specific Instances)

- `/boards` - Kanban pipeline view
- `/contacts` - Contact list & detail
- `/deals` - Deal pipeline management
- `/dashboard` - Analytics dashboard
- `/activities` - Activity timeline
- `/inbox` - Messages/inbox
- `/settings` - Configuration

---

## 5. Current Component Inventory

### UI Components (19 files)
✅ **Atomic components:**
- button.tsx - CTA button
- card.tsx - Container
- alert.tsx - Alert message
- avatar.tsx - Profile picture
- badge.tsx - Status label
- tooltip.tsx - Hover tooltip
- popover.tsx - Dropdown content (Radix)
- tabs.tsx - Tab navigation (Radix)

✅ **Molecules:**
- FormField.tsx - Label + Input + Error
- ContactSearchCombobox.tsx - Searchable contact picker

✅ **Complex:**
- Modal.tsx - Dialog wrapper
- Sheet.tsx - Side drawer
- FullscreenSheet.tsx - Full-height drawer
- ActionSheet.tsx - Bottom action menu
- LossReasonModal.tsx - Specific modal
- AudioPlayer.tsx - Audio playback

✅ **Styles:**
- modalStyles.ts - Shared modal styling

✅ **Tests:**
- FormField.test.tsx
- Modal.test.tsx
- ConfirmModal.test.tsx

### Feature Components (80+ files)
- Navigation: NavigationRail, BottomNav, MoreMenuSheet
- Charts: PipelineChart, ForecastChart, ActivityChart
- AI: AIAssistant component
- Filters: PeriodFilterSelect
- Layouts: Layout.tsx (app shell)
- Modals: ConsentModal, ConfirmModal, OnboardingModal

---

## 6. Design System Status

### ✅ Strengths
- Modern Tailwind v4 with @theme CSS config
- OKLCH color space (perceptually uniform, accessible)
- Comprehensive dark mode support
- Radix UI for accessible primitives
- Consistent spacing & typography scale
- Good icon library (Lucide)
- A11y utilities (sr-only, focus-visible, skip-link)

### ⚠️ Areas for Improvement

**Component Consolidation:**
- 📋 Need official button variants documented
- 📋 Modal styles scattered in multiple files
- 📋 Form field patterns need standardization
- 📋 No documented color palette for charts

**Design Tokens:**
- 📋 Colors defined in CSS variables (good)
- 📋 But no JSON/YAML design token export
- 📋 No figma plugin / design system sync
- 📋 Tailwind config doesn't import tokens

**Documentation:**
- 📋 No Storybook or component library
- 📋 No design spec document
- 📋 No usage guidelines for components
- 📋 README doesn't mention design system

**Accessibility:**
- ✅ Good: sr-only, focus-visible, live-region classes
- ✅ Good: WCAG contrast ratios in OKLCH
- ⚠️ Need: Accessibility audit (axe-core)
- ⚠️ Need: a11y testing in CI/CD

**Responsive Design:**
- 📋 Mobile-first approach (good)
- 📋 Bottom nav for mobile (✅)
- 📋 No documented breakpoint strategy
- 📋 Tablet viewport optimization needed

---

## 7. Feature Module UI Patterns

### Boards (Kanban Pipeline)
**Components:**
- BoardHeader - Title + filters + actions
- StageColumn - Draggable column
- DealCard - Deal item (draggable)
- EmptyState - No deals placeholder

**Data Flow:**
1. Fetch boards & deals via React Query
2. Render stages in columns
3. Enable drag-drop (dnd-kit or react-beautiful-dnd)
4. Update deal stage on drop → API call

### Contacts
**Components:**
- ContactList - Paginated table
- ContactCard - Mini profile
- ContactDetail - Full profile page
- ContactForm - Create/edit modal

**Patterns:**
- Table with sorting/filtering
- Detail view in modal or side sheet
- Form validation with Zod

### Deals
**Components:**
- DealPipeline - Kanban view
- DealDetail - Side sheet or page
- DealForm - Create/edit
- DealNotes - Timeline of notes

### Activities
**Components:**
- ActivityTimeline - Chronological list
- ActivityCard - Single activity item
- ActivityForm - Create activity

### Dashboard
**Components:**
- StatCard - Metric card
- Chart - Recharts graphs
- RecentActivity - Mini activity list

---

## 8. Accessibility (WCAG AA)

### ✅ Implemented
- Skip link for keyboard navigation
- Focus visible rings with proper contrast
- sr-only for screen reader content
- Live regions for announcements
- Reduced motion support
- Dark mode contrast compliance
- Semantic HTML (form labels, headings)
- Radix UI accessible primitives

### ⚠️ To Audit
- [ ] Color contrast on all text (axe-core)
- [ ] Keyboard navigation on all interactive elements
- [ ] ARIA labels on custom components
- [ ] Tab order consistency
- [ ] Form error announcements
- [ ] Modal focus management
- [ ] Icon fallback text

### Accessibility Checklist
```
- [ ] Run axe DevTools on all pages
- [ ] Test keyboard-only navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Test with browser zoom
- [ ] Verify reduced motion support
- [ ] Check form error handling
- [ ] Test touch target sizes (44x44px min)
```

---

## 9. Responsive Design Strategy

### Mobile First
**Breakpoints (Tailwind defaults):**
- `sm`: 640px (tablet)
- `md`: 768px (tablet+)
- `lg`: 1024px (desktop)
- `xl`: 1280px (desktop large)
- `2xl`: 1536px (desktop XL)

### Navigation
- **Mobile:** BottomNav (tab navigation)
- **Tablet:** BottomNav + collapsible sidebar
- **Desktop:** Full sidebar NavigationRail

### Layout Modes
- **Mobile:** Single column, full-width cards
- **Tablet:** 2-column grid
- **Desktop:** 3-column + sidebar

### Content Visibility
```css
.cv-auto { content-visibility: auto; }
.cv-row-md { contain-intrinsic-size: auto 60px; }
.cv-card { contain-intrinsic-size: auto 120px; }
```
Performance optimization for long lists (Kanban, contacts, activities).

---

## 10. Performance Optimizations

### ✅ Implemented
- Next.js 16 App Router (SSR by default)
- React 19 with automatic batching
- Server Components for data fetching
- React Query for caching
- Zustand for lightweight state
- Framer Motion (optimized animations)
- TailwindCSS (unused CSS removed at build)
- Content visibility for long lists
- Image optimization (next/image)

### Metrics to Track
- [ ] Core Web Vitals (LCP, FID, CLS)
- [ ] Bundle size analysis
- [ ] First contentful paint
- [ ] Time to interactive

---

## 11. Routing & Navigation

### App Router Structure
```
/                          # Unauthenticated
├── /login                 # Login page
└── /join                  # Signup page

/(protected)               # Authenticated routes
├── /boards                # Kanban pipelines
├── /contacts              # Contact management
├── /deals                 # Deal pipeline
├── /dashboard             # Analytics
├── /activities            # Timeline
├── /inbox                 # Messages
├── /profile               # User profile
├── /reports               # Reports & analytics
└── /settings              # Configuration
```

### Navigation Config
**navConfig.ts:** Centralized route definitions
- Sidebar items (desktop)
- Bottom nav items (mobile)
- Meta (icons, labels, active state)

---

## 12. State Management

### React Query (Server State)
```typescript
// Fetching data
const { data: contacts } = useQuery({
  queryKey: ['contacts'],
  queryFn: () => api.getContacts()
})
```

### Zustand (Client State)
```typescript
// Global UI state
const useUIStore = create(store => ({
  sidebarOpen: true,
  toggleSidebar: () => store.sidebarOpen = !store.sidebarOpen
}))
```

### Local State (useState)
- Form input values
- Modal open/closed
- UI toggles

---

## 13. Known Issues & Debt

### Component Library
- 📋 No Storybook or component library
- 📋 Many custom modals (LossReasonModal, ConsentModal, OnboardingModal)
- 📋 Form field pattern needs standardization
- 📋 No button variant documentation

### Design System
- 📋 Design tokens not exported as JSON/YAML
- 📋 No figma integration
- 📋 Color palette for charts not documented
- 📋 Shadow system not customized

### Accessibility
- 📋 No automated a11y testing in CI
- 📋 No ARIA labels audit
- 📋 Form validation announcements not tested
- 📋 Modal focus trap behavior not documented

### Performance
- 📋 No bundle size tracking
- 📋 Image optimization not fully utilized
- 📋 No lazy loading for modals
- 📋 Chart library (Recharts) could be lazy-loaded

### Type Safety
- 📋 Some components use React.HTMLAttributes instead of proper typing
- 📋 No strict prop validation
- 📋 Generic modal types could be more specific

### Responsive
- 📋 Tablet optimization needs work
- 📋 Touch target sizes not verified (44x44px)
- 📋 Long list rendering not tested (content-visibility)

---

## 14. Recommendations

### Immediate (Quality)
1. Create component documentation (Storybook or Nextra)
2. Run axe-core accessibility audit
3. Add a11y testing to CI/CD
4. Document button variants & usage
5. Create form field guidelines

### Short-term (System)
1. Extract design tokens to JSON/YAML
2. Set up design token pipeline (Figma → Code)
3. Consolidate modal patterns
4. Add image optimization guide
5. Create responsive design guide

### Medium-term (Scale)
1. Implement Storybook with chromatic
2. Add Percy visual regression testing
3. Create design system documentation site
4. Add e2e accessibility tests
5. Implement bundle size tracking

### Long-term (Excellence)
1. Build design tokens from scratch (DTCG format)
2. Create design system component library
3. Implement design-to-code workflow
4. Add real-time collaboration features
5. Build design system metrics dashboard

---

## 15. Development Checklist

**Before Starting New Features:**
- [ ] Review existing components for reuse
- [ ] Follow Atomic Design patterns
- [ ] Add TypeScript types
- [ ] Document component props
- [ ] Test accessibility (keyboard, screen reader)
- [ ] Test responsive design
- [ ] Add dark mode support
- [ ] Create unit tests

**Component Quality Gate:**
- [ ] Props properly typed
- [ ] Forwards ref where applicable
- [ ] Displays name set
- [ ] Dark mode colors
- [ ] Accessible (WCAG AA)
- [ ] Mobile responsive
- [ ] Touch-friendly (44x44px)
- [ ] Unit tested

---

## Appendix: Design System Quick Reference

### Color Palette
```
Primary: #0ea5e9 (Sky Blue)
Success: oklch(65% 0.17 145) - Green
Warning: oklch(75% 0.15 85) - Orange
Error: oklch(62% 0.25 25) - Red
Info: oklch(60% 0.20 240) - Blue
```

### Common Utility Classes
```
Spacing: p-4, m-4, gap-4
Text: text-sm, text-base, text-lg
Colors: text-primary, bg-surface
Interactive: hover:bg-muted, focus-visible-ring
Dark mode: dark:bg-surface, dark:text-primary
```

### Common Component Patterns
```tsx
// Button
<Button variant="primary" size="md">Action</Button>

// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Form
<FormField
  label="Name"
  type="text"
  error={errors.name}
/>
```

---

**Document Status:** ✅ Complete
**Last Updated:** 2026-02-07
**Next Review:** Post-accessibility audit

