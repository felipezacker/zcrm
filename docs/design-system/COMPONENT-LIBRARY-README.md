# 🎨 ZCRM Design System - Component Library

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** 2026-02-09

---

## 📚 Overview

The ZCRM Component Library is a comprehensive collection of reusable, accessible, and responsive UI components built with **React**, **TypeScript**, **Tailwind CSS**, and **Radix UI primitives**.

**Design Philosophy:**
- 🎯 **Mobile-First** - Start small, scale up across breakpoints
- 🎨 **Design Tokens** - Centralized color/spacing/typography management
- ♿ **Accessible** - WCAG AA minimum, built-in accessibility
- 🌙 **Dark Mode** - First-class dark mode support
- 📱 **Responsive** - 6 breakpoints: xs, sm, md, lg, xl, 2xl

---

## 🏗️ Component Hierarchy (Atomic Design)

### **Atoms** (Base Components)
- `Button` - Primary interactive element (6 variants)
- `Badge` - Status/label indicator (4 variants)
- `Avatar` - User profile image/fallback
- `Alert` - Information/warning/error messages (2 variants)
- `Card` - Container for grouped content
- `Tooltip` - Contextual information on hover
- `Popover` - Floating content panel

### **Molecules** (Simple Combinations)
- `FormField` - Complete form field with label + input + error/hint
- `InputField` - Input + validation states
- `TextareaField` - Textarea + responsive sizing
- `SelectField` - Dropdown select + options
- `CheckboxField` - Checkbox + label
- `SubmitButton` - Form submission button
- `Sheet` - Side panel/drawer
- `ActionSheet` - Bottom sheet for mobile
- `Tabs` - Tabbed navigation

### **Organisms** (Complex Components)
- `Modal` - Dialog with header/body/footer
- `FullscreenSheet` - Full-screen bottom sheet
- `AudioPlayer` - Audio playback control
- `ContactSearchCombobox` - Search + autocomplete
- `LossReasonModal` - Feature-specific modal

---

## 🎨 Design Tokens

All components use centralized design tokens for:

**Colors:** 25 core colors (neutral, primary, semantic, status)
```css
--color-primary: #0ea5e9
--color-primary-hover: #0284c7
--color-primary-active: #0369a1
--color-error: #ef4444
--color-success: #10b981
--color-warning: #f59e0b
--color-info: #3b82f6
```

**Spacing:** 7-step scale (4px to 64px)
```css
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
--space-3xl: 64px
```

**Typography:** Unified font system
```css
--font-sans: Inter, system-ui
--font-display: Space Grotesk
--font-serif: Cinzel
```

---

## 📱 Responsive Breakpoints

All components are mobile-first and responsive:

| Breakpoint | Width | Device |
|-----------|-------|--------|
| `xs` | 320px | iPhone SE |
| `sm` | 375px | Small phones |
| `md` | 640px | Large phones |
| `lg` | 1024px | Tablets |
| `xl` | 1280px | Laptops |
| `2xl` | 1536px | Desktops |

**Example:** Button sizing
```tsx
// Mobile-first approach (starts small, scales up)
<Button>
  h-9 px-3 text-sm          // Mobile (320px)
  xs:h-10 xs:px-4           // xs (375px)
  sm:h-10 sm:px-4           // sm (640px)
  md:h-11 md:px-8 md:text-base  // md+ (1024px+)
</Button>
```

---

## 🌙 Dark Mode

**Activation:** Add `data-theme="dark"` to parent element or use global `dark` class

**All Components Support:**
- Automatic color inversion via CSS variables
- Tested dark mode rendering
- Readable contrast (≥4.5:1 WCAG AA)

**Example:**
```tsx
<div data-theme="dark">
  <Card>
    <CardTitle>Dark Mode Card</CardTitle>
  </Card>
</div>
```

---

## ♿ Accessibility (WCAG AA)

**Built-In Features:**
- ✅ Semantic HTML structure
- ✅ ARIA labels and descriptions
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus indicators (visible ring)
- ✅ Color contrast ≥4.5:1 (WCAG AA)
- ✅ Touch targets ≥44px minimum
- ✅ Screen reader support
- ✅ Axe DevTools audited

**Testing:** Run accessibility audit
```bash
# Storybook a11y addon
npm run storybook
# Then use "Accessibility" tab in Storybook
```

---

## 📖 Storybook

Interactive component documentation with **104+ stories**

```bash
# Start Storybook development server
npm run storybook

# Build static Storybook site
npm run build-storybook
```

**Features:**
- 🎨 Dark mode toggle (global)
- 📱 Mobile viewport previews
- ♿ Accessibility checker (a11y addon)
- 🔄 Interactive component testing
- 🎥 Visual regression ready (Chromatic)

**Story Organization:**
```
Storybook/
├── UI/Button/
│   ├── Default
│   ├── Destructive
│   ├── Mobile
│   ├── Dark Mode
│   └── ...20 stories
├── UI/FormField/
│   ├── Input
│   ├── Textarea
│   ├── Select
│   ├── Checkbox
│   └── ...8 stories
├── UI/Card/
├── UI/Modal/
└── ... (104 total stories)
```

---

## 🎯 Component Usage Examples

### Button
```tsx
import { Button } from '@/components/ui/button';

// Variant + Size
<Button variant="default" size="lg">
  Click me
</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Ghost
<Button variant="ghost">Subtle</Button>
```

### FormField
```tsx
import { InputField, FormField } from '@/components/ui/FormField';
import { useForm } from 'react-hook-form';

const { register, formState: { errors } } = useForm();

<InputField
  label="Email"
  type="email"
  placeholder="your@email.com"
  registration={register('email', { required: 'Email required' })}
  error={errors.email}
  hint="We'll never share your email"
/>
```

### Modal
```tsx
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure?</p>
</Modal>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

---

## 🚀 Integration in Projects

**Setup (One-time):**
1. Tokens already integrated: `import '@/public/design-tokens.css'`
2. Tailwind config already includes breakpoints
3. All components in `/components/ui`

**Usage:**
```tsx
// Import component
import { Button } from '@/components/ui/button';

// Use in your component
export function MyComponent() {
  return <Button variant="primary">Submit</Button>;
}
```

---

## 🎨 Customization

### Override Token Values
```css
:root {
  --color-primary: #custom-color;
  --space-md: 20px; /* instead of 16px */
}
```

### Extend Components
```tsx
import { Button, buttonVariants } from '@/components/ui/button';

// Add new variant
const myButtonStyles = buttonVariants({
  variant: 'custom',
  size: 'lg'
});
```

---

## 📊 Design System Statistics

```
Components:         16+ UI elements
Stories:            104+ interactive examples
Responsive Sizes:   6 breakpoints (320px → 1536px)
Color Palette:      25 design tokens
Spacing Scale:      7 values (4px → 64px)
Dark Mode:          100% coverage
Accessibility:      WCAG AA (tested)
Mobile-First:       Fully responsive
Touch Targets:      44px+ minimum
```

---

## ✅ Quality Checklist

- ✅ All components tested in Storybook
- ✅ Light + dark mode rendering
- ✅ Mobile, tablet, desktop viewports
- ✅ Accessibility audit (WCAG AA)
- ✅ TypeScript strict mode
- ✅ ESLint passed
- ✅ Mobile-first responsive design
- ✅ Touch target sizes (44px+)
- ✅ Contrast ratios (≥4.5:1)
- ✅ Keyboard navigation

---

## 🔗 Resources

- **Storybook:** `npm run storybook` (localhost:6006)
- **Design Tokens:** `squads/design-system/tokens.yaml`
- **Tailwind Config:** `tailwind.config.js`
- **Radix UI Docs:** https://www.radix-ui.com
- **WCAG 2.1 AA:** https://www.w3.org/WAI/WCAG21/quickref/

---

## 📝 Contributing

When adding new components:

1. **Follow Atomic Design** - Place in atoms/molecules/organisms
2. **Include Stories** - Create `.stories.tsx` with light + dark + mobile
3. **Test Accessibility** - Use a11y addon in Storybook
4. **Use Design Tokens** - Reference CSS variables for colors/spacing
5. **Make Mobile-First** - Start with xs breakpoint, scale up
6. **Document** - Add JSDoc comments and Storybook descriptions

---

## 📄 License

ZCRM Design System - Proprietary

---

**Last Updated:** 2026-02-09  
**Maintained by:** Uma (UX-Design-Expert)  
**Status:** Production Ready ✅

