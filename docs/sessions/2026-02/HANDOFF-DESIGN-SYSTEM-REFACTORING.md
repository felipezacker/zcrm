# 🤝 Handoff: Design System Refactoring (5 Semanas)

**Data:** 2026-02-07
**De:** Uma (UX-Design-Expert)
**Para:** Equipe Frontend
**Projeto:** ZCRM - Design System Refactoring (Desktop + Mobile)
**Duração:** 5 semanas | **Budget:** $15,000 | **ROI:** 5.2x

---

## 📋 Índice

1. [Contexto & Objetivos](#contexto--objetivos)
2. [Arquivos & Recursos](#arquivos--recursos)
3. [Week 1: Setup](#week-1-setup)
4. [Week 2: Refactoring](#week-2-refactoring)
5. [Week 3: Storybook](#week-3-storybook)
6. [Week 4: Mobile Testing](#week-4-mobile-testing)
7. [Week 5: QA & Launch](#week-5-qa--launch)
8. [Padrões & Conventions](#padrões--conventions)
9. [Checklist Daily](#checklist-daily)
10. [Escalation & Support](#escalation--support)

---

## 🎯 Contexto & Objetivos

### O que é?
Refatoração completa do design system com foco em:
- **Design Tokens:** Consolidar 91 cores → 25 tokens, 24 spacing → 7 valores
- **Mobile-First:** Suportar 320px-1440px (era quebrado em <768px)
- **Documentation:** 100+ Storybook stories
- **Dark Mode:** Testado 100% em todos breakpoints
- **Accessibility:** WCAG AA compliance

### Por que?
```
PROBLEMA ATUAL:
├─ Colors hardcoded (91 cores, 4.04x redundância)
├─ Mobile quebrado (<768px layouts colapsam)
├─ Sem documentação de componentes (15min discovery)
├─ Dark mode untestado (visual inconsistencies)
└─ Onboarding novo dev = 10 horas

SOLUÇÃO:
├─ Design tokens (99% reusos)
├─ Mobile-first responsive (100% breakpoints)
├─ Storybook (3min discovery)
├─ Dark mode full coverage
└─ Onboarding = 5 horas
```

### Resultados esperados
- ✅ 73% redução cores (91 → 25)
- ✅ 71% redução spacing (24 → 7)
- ✅ 80% melhoria discovery (15min → 3min)
- ✅ 50% redução onboarding (10h → 5h)
- ✅ Mobile layouts 100% funcionando
- ✅ ROI 5.2x em year 1

---

## 📦 Arquivos & Recursos

### Tokens (Prontos para usar)
```
squads/design-system/
├── tokens.yaml                 ← Source of truth (3-layer architecture)
├── tokens.json                 ← Importação JS/TS
├── tokens.css                  ← CSS custom properties + dark mode
└── tokens.tailwind.js          ← Tailwind v4 config
```

**Localização:** `/Users/felipezacker/Desktop/code/zcrm/squads/design-system/`

### Documentação Técnica
```
docs/design-system/
├── COMPONENT-LIBRARY.md               ← Inventário 43 componentes
├── AUDIT-REPORT-2026-02-07.md        ← Análise detalhada + ROI
├── TOKENIZATION-COMPLETE.md           ← Guia implementação tokens
├── REFACTORING-PLAN.md                ← Plano desktop (4 semanas)
├── MOBILE-OPTIMIZATION-PLAN.md        ← Análise mobile + roadmap
└── INTEGRATED-REFACTORING-PLAN.md     ← PLANO FINAL (5 semanas) ⭐
```

**Localização:** `/Users/felipezacker/Desktop/code/zcrm/docs/design-system/`

### Ferramentas necessárias
```bash
# Verificar instalações
node --version          # 18+
npm --version          # 9+
npm list tailwindcss   # v3 ou v4
npm list storybook     # v8+ (instalar Week 3)
```

---

## 📅 Week 1: Setup (Foundation)

### Objetivo
Integrar design tokens no projeto e adicionar mobile breakpoints.

### Dia 1-2: Integração de Tokens

#### Task 1.1: Copiar tokens.css para public/
```bash
cp squads/design-system/tokens.css public/design-tokens.css
```

#### Task 1.2: Importar tokens.css em app/layout.tsx
```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Importar design tokens */}
        <link rel="stylesheet" href="/design-tokens.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Verificação:**
```bash
# No DevTools, verificar se CSS variables estão disponíveis
# Console: getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
# Resultado esperado: "#0ea5e9" (light mode) ou "#06b6d4" (dark mode)
```

#### Task 1.3: Configurar Tailwind para tokens
```javascript
// tailwind.config.js
import tokens from './squads/design-system/tokens.tailwind.js';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      ...tokens,
      // Adicionar mobile breakpoints
      screens: {
        'xs': '320px',   // iPhone SE
        'sm': '375px',   // iPhone 12
        'md': '640px',   // Large phones
        'lg': '1024px',  // Tablets
        'xl': '1280px',  // Laptops
        '2xl': '1536px', // Desktops
      },
    },
  },
  plugins: [],
};
```

**Verificação:**
```bash
npm run build
# Erro zero em compilação
npm run dev
# Abrir http://localhost:3000
# DevTools → Inspect → ver classes Tailwind (bg-primary, px-md, etc)
```

---

### Dia 3: Testar Light/Dark Mode

#### Task 1.4: Configurar dark mode toggle (provisório)
```tsx
// components/ThemeToggle.tsx
'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    applyTheme(prefersDark);
  }, []);

  function applyTheme(dark: boolean) {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    setIsDark(dark);
  }

  return (
    <button
      onClick={() => applyTheme(!isDark)}
      className="px-3 py-2 rounded-md bg-primary text-white"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

#### Task 1.5: Testar em 3 breakpoints
```bash
# Chrome DevTools: F12 → Ctrl+Shift+M (mobile emulation)
# Testar em cada breakpoint:

□ 320px (xs)   - iPhone SE
  ├─ Button visível ✓
  ├─ Input acessível ✓
  ├─ Text legível ✓
  └─ Dark mode OK ✓

□ 768px (md)   - iPad
  ├─ Layouts 2-coluna ✓
  ├─ Spacing adequado ✓
  └─ Dark mode OK ✓

□ 1440px (xl)  - Desktop
  ├─ Layouts 4-coluna ✓
  ├─ Spacing generoso ✓
  └─ Dark mode OK ✓
```

**Checklist Week 1:**
- [ ] tokens.css copiado para public/
- [ ] tokens.css importado em app/layout.tsx
- [ ] Tailwind config atualizado com tokens + mobile breakpoints
- [ ] npm run build → 0 errors
- [ ] Theme toggle funciona
- [ ] Light mode: colors corretas (dark mode inativo)
- [ ] Dark mode: colors corretas (data-theme="dark")
- [ ] Teste 320px: sem overflow, texto legível
- [ ] Teste 768px: layouts corretos
- [ ] Teste 1440px: spacing adequado

**⏱️ Tempo:** 2 dev-days

---

## 🎨 Week 2: Refactoring (10 Componentes)

### Objetivo
Refatorar 10 componentes atoms substituindo hardcoded colors por design tokens.

### Componentes a refatorar (Prioridade)

| # | Componente | Arquivo | Dependências |
|---|-----------|---------|--------------|
| 1 | Button | `components/ui/Button.tsx` | - |
| 2 | Input | `components/ui/Input.tsx` | - |
| 3 | FormField | `components/ui/FormField.tsx` | Input |
| 4 | Card | `components/ui/Card.tsx` | - |
| 5 | Badge | `components/ui/Badge.tsx` | - |
| 6 | Avatar | `components/ui/Avatar.tsx` | - |
| 7 | Alert | `components/ui/Alert.tsx` | - |
| 8 | Modal | `components/ui/Modal.tsx` | Button |
| 9 | Popover | `components/ui/Popover.tsx` | - |
| 10 | Tooltip | `components/ui/Tooltip.tsx` | - |

### Padrão de Refactoring

**ANTES (hardcoded):**
```tsx
const baseStyles = cn(
  'bg-slate-50 dark:bg-black/20',
  'border border-slate-200 dark:border-slate-700',
  'text-slate-900 dark:text-white',
  'px-4 py-2',
  'rounded-md'
);
```

**DEPOIS (token-based):**
```tsx
const baseStyles = cn(
  'bg-background dark:bg-background',     // Usa CSS var
  'border border-divider dark:border-divider',
  'text-foreground dark:text-foreground',
  'px-md py-sm',                          // Usa token spacing
  'rounded-md'
);

// OU com Tailwind config atualizado:
const baseStyles = cn(
  'bg-background',
  'border border-divider',
  'text-foreground',
  'px-md py-sm',
  'rounded-md'
);
```

### Dia 1: Button, Input, FormField

#### Task 2.1: Refatorar Button.tsx
```tsx
// components/ui/Button.tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const Button = ({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    default: 'h-10 px-4 py-2 text-base sm:h-11 md:px-6',
    lg: 'h-11 px-8 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
```

**Acceptance Criteria:**
- ✅ Sem hardcoded colors (exceto fallbacks em comentários)
- ✅ Usa tokens de design (CSS vars ou Tailwind)
- ✅ Light mode ✓ Dark mode ✓
- ✅ Responsivo: sm/default/lg sizes
- ✅ Touch targets ≥44px (h-10 = 40px, com padding = 44px+ total)
- ✅ Tests passando

---

#### Task 2.2: Refatorar Input.tsx
```tsx
// components/ui/Input.tsx
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className, type, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
};

export { Input };
```

**Acceptance Criteria:**
- ✅ Height: 40px desktop, 36px mobile (responsivo)
- ✅ Padding: 8px-12px (mobile-friendly para teclado)
- ✅ Border color: usa token divider
- ✅ Focus state: ring-primary
- ✅ Dark mode contrast OK

---

#### Task 2.3: Refatorar FormField.tsx
```tsx
// components/ui/FormField.tsx
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField = ({
  label,
  error,
  required,
  children,
}: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-sm">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  );
};
```

**Acceptance Criteria:**
- ✅ Label spacing (gap-sm = 8px)
- ✅ Error text color: destructive token
- ✅ Required indicator: visible
- ✅ Responsive font sizes

---

### Dia 2: Card, Badge, Avatar

#### Task 2.4: Refatorar Card.tsx
```tsx
// components/ui/Card.tsx
import { cn } from "@/lib/utils";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-lg border border-divider bg-card p-lg shadow-sm',
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-sm', className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)} {...props} />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pt-0', className)} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center pt-lg', className)} {...props} />
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

---

#### Task 2.5: Refatorar Badge.tsx
```tsx
// components/ui/Badge.tsx
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
    outline: 'text-foreground',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
```

---

#### Task 2.6: Refatorar Avatar.tsx
```tsx
// components/ui/Avatar.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    className={cn(
      'h-10 w-10 rounded-full border-2 border-divider bg-background object-cover',
      className
    )}
    {...props}
  />
);

const AvatarFallback = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex h-10 w-10 items-center justify-center rounded-full border-2 border-divider bg-muted text-sm font-medium text-muted-foreground',
      className
    )}
    {...props}
  />
);

export { Avatar, AvatarFallback };
```

---

### Dia 3: Alert, Modal, Popover

#### Task 2.7: Refatorar Alert.tsx
```tsx
// components/ui/Alert.tsx
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
}

const Alert = ({ className, variant = 'default', ...props }: AlertProps) => {
  const variants = {
    default: 'bg-background border-divider text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
    success: 'border-success/50 text-success dark:border-success [&>svg]:text-success',
    warning: 'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
    info: 'border-info/50 text-info dark:border-info [&>svg]:text-info',
  };

  return (
    <div
      className={cn('relative w-full rounded-lg border p-lg [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground', variants[variant], className)}
      role="alert"
      {...props}
    />
  );
};

const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className={cn('mb-1 font-medium leading-tight', className)} {...props} />
);

const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
```

---

#### Task 2.8: Refatorar Modal.tsx
```tsx
// components/ui/Modal.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

const Dialog = ({ open = false, onOpenChange }: { open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(open);

  const value = {
    open: isOpen,
    setOpen: onOpenChange ? onOpenChange : setIsOpen,
  };

  return <DialogContext.Provider value={value}>{/* children */}</DialogContext.Provider>;
};

const DialogTrigger = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn('px-4 py-2 rounded-md bg-primary text-white', className)} {...props} />
);

const DialogContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-divider bg-background p-lg shadow-lg rounded-lg sm:rounded-lg', className)} {...props} />
);

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-sm text-center sm:text-left', className)} {...props} />
);

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)} {...props} />
);

const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
```

---

#### Task 2.9: Refatorar Popover.tsx
```tsx
// components/ui/Popover.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Popover = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  return <div>{children}</div>;
};

const PopoverTrigger = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={cn('px-3 py-2 rounded-md hover:bg-accent', className)} {...props} />
);

const PopoverContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('absolute z-50 w-72 rounded-md border border-divider bg-background p-4 text-foreground shadow-md outline-none', className)} {...props} />
);

export { Popover, PopoverTrigger, PopoverContent };
```

---

### Dia 4: Tooltip + Testes

#### Task 2.10: Refatorar Tooltip.tsx
```tsx
// components/ui/Tooltip.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
}

export const Tooltip = ({ content, side = 'top', children }: TooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: '-top-8 left-1/2 -translate-x-1/2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={cn('absolute z-50 rounded-md bg-foreground text-background text-xs px-2 py-1 whitespace-nowrap', positions[side])}>
          {content}
        </div>
      )}
    </div>
  );
};
```

---

#### Task 2.11: Light/Dark Mode Testing
```bash
# Para cada componente refatorado:

npm run dev

# Abrir DevTools → Toggle theme
□ Light mode: colors corretas
□ Dark mode: colors corretas
□ Sem artifacts visuais
□ Contraste WCAG AA (4.5:1 minimum)

# Testar tamanhos touch
□ Button sm (h-9 = 36px) ✓
□ Button default (h-10 = 40px) + padding = 44px+ ✓
□ Button lg (h-11 = 44px) ✓
□ Input (h-10 = 40px) + padding = 44px+ ✓
```

---

### Dia 5: Buffer + Fixes + QA

#### Task 2.12: QA Completo
```bash
# Rodar testes
npm test

# Rodar linter
npm run lint

# Rodar type checking
npm run typecheck

# Manual testing checklist
□ Todos 10 componentes refatorados
□ Sem hardcoded colors
□ Light mode OK
□ Dark mode OK
□ Responsive (320px, 768px, 1440px)
□ Accessibility (WCAG AA)
□ Touch targets (≥44px)
```

**Checklist Week 2:**
- [ ] Button refactored + tested
- [ ] Input refactored + tested
- [ ] FormField refactored + tested
- [ ] Card refactored + tested
- [ ] Badge refactored + tested
- [ ] Avatar refactored + tested
- [ ] Alert refactored + tested
- [ ] Modal refactored + tested
- [ ] Popover refactored + tested
- [ ] Tooltip refactored + tested
- [ ] npm test → all passing
- [ ] npm run lint → 0 errors
- [ ] npm run typecheck → 0 errors
- [ ] Light mode ✓ Dark mode ✓
- [ ] Mobile 320px ✓ Desktop 1440px ✓

**⏱️ Tempo:** 2 dev-days

---

## 📚 Week 3: Storybook & Pages

### Objetivo
Setup Storybook com 100+ stories e refatorar 5 páginas principais.

### Dia 1: Setup Storybook

```bash
# Instalar Storybook
npx storybook@latest init

# Configurar para React + TypeScript
# (Storybook detecta automaticamente)

# Instalar addons
npm install --save-dev @storybook/addon-essentials @storybook/addon-interactions @chromatic-com/storybook
```

**Criar .storybook/main.ts:**
```typescript
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.ts?(x)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: '@storybook/nextjs',
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

**Criar .storybook/preview.ts:**
```typescript
import type { Preview } from '@storybook/react';
import '../public/design-tokens.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

---

### Dias 2-4: Criar 100+ Stories

**Exemplo: Button.stories.tsx**
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'default', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Light mode stories
export const Primary: Story = {
  args: { variant: 'default', children: 'Button' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
};

// Dark mode stories
export const DarkMode: Story = {
  args: { variant: 'default', children: 'Button' },
  decorators: [(story) => <div data-theme="dark" className="p-4">{story()}</div>],
};

// Mobile preview
export const MobileSmall: Story = {
  args: { size: 'sm', children: 'Mobile' },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
};
```

**Estrutura de stories:**
```
components/ui/
├── Button.tsx
├── Button.stories.tsx       ← 8 stories (variants + dark mode + mobile)
├── Input.tsx
├── Input.stories.tsx        ← 7 stories
├── FormField.tsx
├── FormField.stories.tsx    ← 6 stories
├── Card.tsx
├── Card.stories.tsx         ← 5 stories
├── Badge.tsx
├── Badge.stories.tsx        ← 5 stories
├── Avatar.tsx
├── Avatar.stories.tsx       ← 4 stories
├── Alert.tsx
├── Alert.stories.tsx        ← 6 stories
├── Modal.tsx
├── Modal.stories.tsx        ← 8 stories
├── Popover.tsx
├── Popover.stories.tsx      ← 6 stories
├── Tooltip.tsx
└── Tooltip.stories.tsx      ← 6 stories
```

**Total: ~61 stories para 10 componentes atoms**

---

### Dia 5: Refatorar 5 Pages

**Pages principais a refatorar:**
1. Dashboard
2. Kanban/Board
3. Settings
4. Users/List
5. Reports

**Exemplo: Dashboard com responsive grid**

```tsx
// app/dashboard/page.tsx
'use client';

export default function Dashboard() {
  return (
    <div className="p-md sm:p-lg md:p-xl">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-lg">Dashboard</h1>

      {/* Responsive grid: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 gap-md
                      sm:grid-cols-2 sm:gap-lg
                      md:grid-cols-3 md:gap-xl
                      lg:grid-cols-4 lg:gap-xl">
        {[1, 2, 3, 4].map((card) => (
          <Card key={card}>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Card {card}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm">Content here</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**Checklist Week 3:**
- [ ] Storybook instalado
- [ ] .storybook config criado
- [ ] 10+ stories para Button
- [ ] 7+ stories para Input
- [ ] ... (6+ stories para cada componente)
- [ ] ~61 stories total criadas
- [ ] Visual regression baseline criado
- [ ] 5 páginas refatoradas (responsive grids)
- [ ] npm run storybook → acessa localhost:6006
- [ ] Todas stories renderizam OK

**⏱️ Tempo:** 2 dev-days

---

## 📱 Week 4: Mobile Testing + Dark Mode

### Objetivo
Testar em real devices, dark mode full coverage, performance audit.

### Dia 1-2: Device Testing

**Physical devices:**
```
□ iPhone SE (375px) - iOS 18+
□ iPhone 14 Pro Max (430px) - iOS 18+
□ Samsung Galaxy S21 (360px) - Android 13+
□ iPad (768px) - iOS 18+
□ MacBook (1440px) - macOS 15+
```

**Test checklist por device:**
```
320px / 375px (Mobile):
├─ No horizontal scroll
├─ Text readable (14px+)
├─ Buttons clickable with thumb (44px+)
├─ Modal width 100% - padding
├─ BottomNav visível
└─ Forms usável

640px (Large Mobile):
├─ 2-coluna layout functional
├─ Spacing adequate
└─ Navigation transição

768px (Tablet):
├─ 3-coluna layout
├─ Side navigation visível
└─ All features accessible

1440px (Desktop):
├─ 4-coluna layout
├─ Full spacing
└─ Side rail navigation
```

---

### Dia 2-3: Dark Mode Test Suite

```bash
# Criar test/dark-mode.test.tsx
npm test -- dark-mode.test.tsx

# Testes:
□ Button colors corretas dark mode
□ Input colors corretas dark mode
□ Card shadows visíveis dark mode
□ Text contrast ≥4.5:1
□ Todos 43 componentes renderizam
□ Sem console errors
□ Sem artifacts visuais
```

---

### Dia 4: Performance Audit

```bash
# Lighthouse mobile audit
npm install --save-dev lighthouse

lighthouse http://localhost:3000 --view --emulated-form-factor=mobile

# Targets:
Performance:     > 90
Accessibility:   > 95
Best Practices:  > 95
SEO:             > 95
```

---

### Dia 5: Navigation Mobile

```tsx
// components/Layout.tsx
export function Layout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Desktop: Side navigation (hidden on mobile) */}
      <nav className="hidden lg:block w-64 border-r border-divider bg-background">
        <NavigationRail />
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile: Bottom navigation (hidden on desktop) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-divider bg-background">
        <BottomNav />
      </nav>
    </div>
  );
}
```

**Checklist Week 4:**
- [ ] Testado em iPhone SE
- [ ] Testado em iPhone 14 Pro Max
- [ ] Testado em Samsung Galaxy
- [ ] Testado em iPad
- [ ] Testado em MacBook
- [ ] No horizontal scroll em mobile
- [ ] Touch targets ≥44px
- [ ] Dark mode test suite passing
- [ ] WCAG AA color contrast verificado
- [ ] Lighthouse > 90 (mobile)
- [ ] Navigation mobile integrada

**⏱️ Tempo:** 2 dev-days

---

## ✅ Week 5: QA Final + Launch

### Dia 1: Accessibility Audit

```bash
# WCAG AA Audit
npm install --save-dev @axe-core/react

# Rodar audit
npm run test:a11y

# Checklist:
□ Color contrast > 4.5:1 (text < 18px)
□ Color contrast > 3:1 (text ≥ 18px)
□ Todos buttons com accessible names
□ Todos inputs com labels
□ Heading hierarchy correto (h1 > h2 > h3)
□ Focus indicators visíveis
□ No color-only information
```

---

### Dia 2: Performance Baseline

```bash
# Desktop performance
lighthouse http://localhost:3000 --view --emulated-form-factor=desktop

# Mobile performance
lighthouse http://localhost:3000 --view --emulated-form-factor=mobile

# Salvar resultados para comparison
cp lighthouse-report.json docs/baseline-lighthouse-desktop.json
cp lighthouse-report.json docs/baseline-lighthouse-mobile.json
```

---

### Dia 3-4: User Testing

**Test com 5 usuários mobile:**
```
1. Abrir app em telefone pessoal
2. Navegar 5 páginas principais
3. Completar 1 tarefa comum (ex: criar item)
4. Feedback coletado:
   ├─ Usabilidade
   ├─ Performance
   ├─ Visual
   └─ Acessibilidade
```

---

### Dia 5: Production Deployment

```bash
# 1. Final validation
npm run build
npm run test
npm run lint
npm run typecheck

# 2. Deploy
git add -A
git commit -m "feat: design system refactoring complete (week 5 qa)"
git push origin main

# 3. Deploy to production
# (your deployment script)

# 4. Monitor for 24 hours
# - Check error logs
# - Monitor performance metrics
# - Check dark mode toggle
# - Check mobile layouts

# 5. Team training (30 min)
# - Show Storybook
# - Explain design tokens
# - Demo dark mode toggle
# - Q&A
```

**Checklist Week 5:**
- [ ] WCAG AA audit passed
- [ ] Lighthouse desktop > 90
- [ ] Lighthouse mobile > 90
- [ ] User testing completed (5 users)
- [ ] All feedback addressed
- [ ] npm build succeeds
- [ ] npm test all passing
- [ ] npm lint 0 errors
- [ ] npm typecheck 0 errors
- [ ] Production deployed
- [ ] 24h monitoring OK
- [ ] Team training completed

**⏱️ Tempo:** 2 dev-days

---

## 🎨 Padrões & Conventions

### Design Token Usage

**CSS Variables:**
```tsx
// ✅ Use CSS vars
<div className="bg-[var(--color-primary)]">

// Ou Tailwind config (preferred)
<div className="bg-primary">
```

**Spacing Scale:**
```
--space-xs:  4px    → space-xs
--space-sm:  8px    → space-sm
--space-md:  12px   → space-md
--space-lg:  16px   → space-lg
--space-xl:  24px   → space-xl
--space-2xl: 32px   → space-2xl
```

**Typography:**
```
--font-size-xs:   12px   → text-xs
--font-size-sm:   14px   → text-sm
--font-size-base: 16px   → text-base
--font-size-lg:   18px   → text-lg
--font-size-xl:   20px   → text-xl
--font-size-2xl:  24px   → text-2xl
```

### Mobile-First Pattern

```tsx
// ✅ Mobile-first (base styles apply to mobile, override larger)
<div className="px-3 py-2 text-sm
              sm:px-4 sm:py-3 sm:text-base
              md:px-6 md:py-4 md:text-lg">

// ❌ Desktop-first (reverse order, harder to maintain)
<div className="px-6 py-4 text-lg
              md:px-4 md:py-3 md:text-base
              sm:px-3 sm:py-2 sm:text-sm">
```

### Dark Mode Pattern

```tsx
// ✅ Using CSS vars (automatic)
<div className="bg-background text-foreground">
  {/* Automatically changes with data-theme="dark" */}
</div>

// ✅ Or explicit dark: prefix
<div className="bg-slate-50 dark:bg-slate-900">
  {/* Explícito para casos especiais */}
</div>

// ❌ Hardcoded colors
<div className="bg-white text-black">
  {/* Quebra em dark mode */}
</div>
```

### Touch Target Pattern

```tsx
// ✅ Minimum 44px touch target
<button className="h-10 px-4 py-2">  {/* = 40px + 2px padding = 44px */}
  Click me
</button>

// ❌ Too small for mobile
<button className="h-6 px-2 py-1">  {/* = 24px, hard to tap */}
  Click me
</button>
```

---

## 📋 Checklist Daily

### Daily Standup
```markdown
## Daily Standup (15 min)

### Yesterday
- [ ] Task completed
- [ ] Blockers cleared

### Today
- [ ] Next task
- [ ] Estimated hours

### Blockers
- [ ] None / List them
```

### End of Day Checklist
```bash
# Before finishing work:
npm run lint
npm run typecheck
npm test

# Commit progress
git add -A
git commit -m "chore: end of day [week X day Y]"
```

---

## 🆘 Escalation & Support

### Issues & Blockers

**If stuck, check:**
1. INTEGRATED-REFACTORING-PLAN.md (full context)
2. COMPONENT-LIBRARY.md (component reference)
3. TOKENIZATION-COMPLETE.md (token usage)

**Common Issues:**

**Issue:** "Tailwind not picking up token classes"
```bash
# Solution: Restart dev server
npm run dev

# Or: Check tailwind.config.js updated correctly
# And tokens.tailwind.js imported
```

**Issue:** "Dark mode not toggling"
```bash
# Solution: Verify data-theme attribute
document.documentElement.setAttribute('data-theme', 'dark');

# Check CSS variables loaded
getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
```

**Issue:** "Mobile layout still broken at 320px"
```bash
# Solution: Check mobile-first pattern
// ❌ WRONG
<div className="md:grid-cols-2">

// ✅ RIGHT
<div className="grid-cols-1 md:grid-cols-2">
```

### Contact Points

| Role | When | How |
|------|------|-----|
| Designer | Visual feedback | Daily standup |
| Tech Lead | Architecture decisions | Thursday review |
| Product | Scope/priority questions | Weekly sync |
| QA | Test results | EOD daily |

---

## 📞 Questions?

- **Design System questions:** Refer to TOKENIZATION-COMPLETE.md
- **Component patterns:** Check COMPONENT-LIBRARY.md
- **Timeline questions:** See INTEGRATED-REFACTORING-PLAN.md
- **Technical blockers:** Ask tech lead in standup

---

**Document Version:** 1.0
**Created:** 2026-02-07
**Ready for handoff:** ✅ Yes
**Start date:** 2026-02-10 (Monday)

---

*🎨 Design System Refactoring - Full Handoff Package*
*Prepared for: Frontend Team*
*By: Uma (UX-Design-Expert)*
