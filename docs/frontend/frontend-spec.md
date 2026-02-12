# NossoCRM UI/UX Specification

**Version**: 2.0
**Date**: 2026-02-11
**Status**: Draft

## Introduction

This document defines the user experience goals, information architecture, user flows, and visual design specifications for NossoCRM. It reflects the current state of the application's frontend architecture and design system.

## Overall UX Goals & Principles

### Target User Personas
1. **Sales Representative**: Focused on speed, pipeline visibility, and quick actions. Needs mobile access and efficient data entry.
2. **Sales Manager**: Focused on team performance, analytics, and process oversight. Needs dashboards and reporting.
3. **Administrator**: Manages system configuration, users, and integrations.

### Design Principles
1. **Efficiency First**: Reduce clicks for common actions (logging calls, moving deals).
2. **Clarity**: Use clear visual hierarchy and distinct status colors.
3. **AI-Augmented**: AI features should be context-aware and helpful, not intrusive.
4. **Accessible**: Support keyboard navigation and screen readers (WCAG 2.1 AA target).

## Information Architecture

### Navigation Structure
- **Sidebar (Desktop) / Bottom Nav (Mobile)**:
    - **Dashboard**: Overview of metrics.
    - **Pipeline**: Kanban board for deals.
    - **Contacts**: List of contacts and companies.
    - **Activities**: Task and calendar view.
    - **Inbox**: AI-curated priorities.
    - **Settings**: User and organization config.

### Key Flows
- **Deal Management**: Create Deal -> Move through Stages -> Close (Won/Lost).
- **Contact Management**: Import/Create Contact -> Log Activity -> Schedule Next Step.
- **AI Assistance**: Ask question -> Receive Insight -> Action Item.

## Visual Design & Design System

### Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (using CSS variables and `@theme`)
- **Icons**: Lucide React
- **Components**: Radix UI primitives (likely shadcn/ui base)

### Color Palette (OKLCH)
The system uses the OKLCH color space for better perceptual uniformity.

| Color | Variable | Description |
|-------|----------|-------------|
| **Primary** | `--color-primary-*` | Brand Blue (#0ea5e9 range) |
| **Surface** | `--color-surface` | Card backgrounds |
| **Background** | `--color-bg` | App background |
| **Success** | `--color-success` | Green (Deal Won) |
| **Warning** | `--color-warning` | Yellow (Stalled Deal) |
| **Error** | `--color-error` | Red (Deal Lost/Error) |
| **Dark Mode** | `.dark` | Deep Slate background |

### Typography
- **Sans (Body/UI)**: Inter (`--font-sans`)
- **Display (Headings)**: Space Grotesk (`--font-display`)
- **Serif (Accents)**: Cinzel (`--font-serif`)

### Layout & Spacing
- **Sidebar**: Collapsible, responsive.
- **Grid**: 12-column grid system implicit in Tailwind.
- **Safe Areas**: Handles mobile notches via `--app-safe-area-*`.

## Components

### Core Components (`components/ui`)
- **Buttons**: Primary, Secondary, Ghost, Destructive.
- **Inputs**: Text, Select, DatePicker, Combobox.
- **Feedback**: Toasts, Modals (`ConfirmModal`, `OnboardingModal`).
- **Data Display**: Tables (likely `tanstack/react-table`), Cards (`cv-card` optimized).

### AI Components (`components/ai`)
- **Chat Interface**: Floating or sidebar panel.
- **Suggestion Cards**: In-context insights.

## Accessibility Requirements
- **Focus States**: High visibility rings (`.focus-visible-ring`).
- **Screen Readers**: `sr-only` utilities used.
- **Contrast**: Compliant color pairs defined in CSS variables.
- **Keyboard**: Full navigation support via Radix UI primitives.

## Responsiveness
- **Mobile First**: Design targets generic mobile (`xs`, `sm`) up to desktop (`2xl`).
- **Breakpoints**: 
    - `sm`: 640px
    - `md`: 768px
    - `lg`: 1024px
    - `xl`: 1280px
    - `2xl`: 1536px

## Performance Considerations
- **CSS**: Tailwind v4 for zero-runtime CSS.
- **Rendering**: `content-visibility: auto` (`.cv-auto`) used for long lists/tables.
- **Fonts**: Variable fonts to reduce requests.

## References
- Design Tokens: `app/globals.css`
- Component Library: `components/`
- Layout Logic: `components/Layout.tsx`
