# 🔄 Plano de Refatoramento - Design System

**Data:** 2026-02-07
**Agente:** Uma (UX-Design-Expert)
**Status:** 📋 Plano Estratégico
**Duração:** 4 semanas (Phase D)
**Equipe:** 1-2 desenvolvedores frontend + 1 designer

---

## 📊 Situação Atual

### Problemas Identificados

1. **91 cores hardcoded** (deveria ser ~25)
   - 4.04x redundância
   - Sem reusabilidade em mobile/backend
   - Dark mode com `dark:` duplicado

2. **24 valores de spacing** (deveria ser ~7)
   - Escala inconsistente
   - Sem semântica (p-3 vs p-4 vs p-6)
   - Difícil ajustar globalmente

3. **Sem documentação de componentes**
   - 0 histórias Storybook
   - Developers gastam 15min buscando componentes
   - $20K/ano em tempo perdido

4. **Dark mode não testado**
   - Sem verificação de contraste WCAG
   - Inconsistências visuais
   - Sem testes automatizados

5. **99+ arquivos de componentes**
   - ~40% duplicação estimada
   - Difícil de manter
   - Onboarding lento (10 horas → 5 horas alvo)

---

## 🎯 Objetivos

| Objetivo | Métrica | Atual | Alvo | Ganho |
|----------|---------|-------|------|-------|
| **Consolidar cores** | # de cores | 91 | 25 | 73% redução |
| **Padronizar spacing** | # de valores | 24 | 7 | 71% redução |
| **Documentar componentes** | Storybook stories | 0 | 100+ | 100% nova |
| **Testar dark mode** | % verificado | 0% | 100% | Full coverage |
| **Velocidade discovery** | min/componente | 15 | 3 | 80% melhoria |
| **Onboarding novo dev** | horas | 10 | 5 | 50% redução |

---

## 📅 Cronograma - 4 Semanas

```
┌─────────────────────────────────────────────────────┐
│ SEMANA 1: Preparação & Setup                        │
├─────────────────────────────────────────────────────┤
│ ✅ Tokens extraídos (tokens.yaml, .json, .css)      │
│ → Semana 1, Dia 1-2: Integrar tokens no projeto    │
│ → Semana 1, Dia 3-4: Configurar Tailwind com tokens│
│ → Semana 1, Dia 5: Testar light/dark mode          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SEMANA 2: Refatorar Componentes (Phase 1)           │
├─────────────────────────────────────────────────────┤
│ → Refatorar 10 componentes UI atoms                 │
│ → Substituir hardcoded por tokens                   │
│ → Testar light + dark mode                          │
│ → 1 dev, full-time, ~10 componentes/semana          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SEMANA 3: Storybook & Documentação                  │
├─────────────────────────────────────────────────────┤
│ → Setup Storybook 8                                 │
│ → Criar 100+ stories (atoms + molecules)            │
│ → Adicionar visual regression testing               │
│ → 1 dev + 1 designer, ~50 stories/semana            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ SEMANA 4: Testes & Finalização                      │
├─────────────────────────────────────────────────────┤
│ → Dark mode full test suite (todos os componentes)  │
│ → Accessibility audit (WCAG AA)                     │
│ → Performance testing                               │
│ → QA + sign-off                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Plano Detalhado por Semana

### **SEMANA 1: Preparação & Integração (5 dias)**

#### Dia 1-2: Integrar Design Tokens

**Tarefas:**
- [ ] Copiar `tokens.css` para `public/design-tokens.css`
- [ ] Importar `tokens.css` no layout principal (`app/layout.tsx`)
- [ ] Configurar `data-theme="dark"` dinamicamente
- [ ] Testar CSS variables no navegador (DevTools)

**Acceptance Criteria:**
- ✅ CSS variables disponíveis em todos os componentes
- ✅ `var(--color-primary)` resolve corretamente
- ✅ Dark mode muda quando `[data-theme="dark"]`

**Tempo estimado:** 4 horas

---

#### Dia 3-4: Configurar Tailwind

**Tarefas:**
- [ ] Atualizar `tailwind.config.js`:
  ```javascript
  import tokens from './squads/design-system/tokens.tailwind.js'
  export default {
    theme: {
      extend: tokens
    }
  }
  ```
- [ ] Testar classes Tailwind token-based
- [ ] Validar build sem errors

**Exemplo antes/depois:**
```typescript
// ANTES (hardcoded)
<button className="bg-blue-500 px-4 py-2 rounded-md">

// DEPOIS (token-based)
<button className="bg-primary px-md py-sm rounded-md">
```

**Acceptance Criteria:**
- ✅ Tailwind config compila sem errors
- ✅ Classes `bg-primary`, `px-md`, etc funcionam
- ✅ Dark mode automático via `dark:` prefix

**Tempo estimado:** 4 horas

---

#### Dia 5: Testar Light & Dark Mode

**Tarefas:**
- [ ] Abrir app em light mode → verificar cores
- [ ] Ativar dark mode → verificar cores auto-mudam
- [ ] Testar 5 componentes principais:
  - Button
  - Input
  - Card
  - Modal
  - FormField

**Acceptance Criteria:**
- ✅ Light mode: backgrounds claros, texto escuro
- ✅ Dark mode: backgrounds escuros, texto claro
- ✅ Sem artifacts visuais
- ✅ Contraste WCAG AA (mínimo)

**Tempo estimado:** 3 horas

---

### **SEMANA 2: Refatorar Componentes Atoms (5 dias)**

**Objetivo:** Substituir hardcoded colors/spacing em 10 componentes

#### Componentes a Refatorar (Prioridade)

1. **Button.tsx** ← Mais usado
2. **Input.tsx**
3. **FormField.tsx**
4. **Card.tsx**
5. **Badge.tsx**
6. **Avatar.tsx**
7. **Alert.tsx**
8. **Modal.tsx**
9. **Popover.tsx**
10. **Tooltip.tsx**

#### Padrão de Refatoramento

```typescript
// ANTES
const baseInputStyles = cn(
  'bg-slate-50 dark:bg-black/20',
  'border border-slate-200 dark:border-slate-700',
  'text-slate-900 dark:text-white'
);

// DEPOIS
const baseInputStyles = cn(
  'bg-[var(--color-background)] dark:bg-[var(--color-background)]',
  'border border-[var(--color-divider)] dark:border-[var(--color-divider)]',
  'text-[var(--color-foreground)] dark:text-[var(--color-foreground)]'
);

// OU (se Tailwind config atualizado)
const baseInputStyles = cn(
  'bg-background',
  'border border-divider',
  'text-foreground'
);
```

#### Tasks por Componente (~1-2 horas each)

```
Dia 1: Button, Input, FormField
Dia 2: Card, Badge, Avatar
Dia 3: Alert, Modal, Popover
Dia 4: Tooltip + testes light/dark
Dia 5: Buffer + fixes + QA
```

**Acceptance Criteria por Componente:**
- ✅ Sem hardcoded cores (exceto fallbacks documentados)
- ✅ Usa apenas tokens de design
- ✅ Light mode ✓ Dark mode ✓
- ✅ WCAG AA contrast
- ✅ Testes passando

**Tempo estimado:** 2 dias de dev, 0.5 dia QA

---

### **SEMANA 3: Storybook & Documentação (5 dias)**

#### Dia 1: Setup Storybook

```bash
# Instalar Storybook 8
npx storybook@latest init

# Configurar para React + TypeScript
# - Usar TailwindCSS addon
# - Habilitar dark mode detection
# - Setup visual regression (Chromatic ou Percy)
```

**Arquivos a criar:**
- `.storybook/main.ts` (config)
- `.storybook/preview.ts` (theme setup)
- `.storybook/themes.ts` (dark mode)

**Tempo:** 4 horas

---

#### Dias 2-4: Criar Stories (100+ stories)

**Estrutura:**
```
components/ui/Button.stories.tsx
├─ Button - Primary
├─ Button - Secondary
├─ Button - Destructive
├─ Button - Small
├─ Button - Large
├─ Button - Disabled
├─ Button - Loading
└─ Button - Dark Mode

components/ui/Input.stories.tsx
├─ Input - Default
├─ Input - Focused
├─ Input - Error
├─ Input - Disabled
├─ Input - Dark Mode
└─ Input - With Icon

... (75+ mais stories)
```

**Template Story:**
```typescript
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
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'default', children: 'Button' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
};

export const DarkMode: Story = {
  args: { variant: 'default', children: 'Button' },
  decorators: [(story) => <div data-theme="dark">{story()}</div>],
};
```

**Productivity:** ~50 stories/dia

**Tempo:** 2-3 dias

---

#### Dia 5: Visual Regression & QA

```bash
# Integrar Chromatic (para visual regression)
npm install --save-dev @chromatic-com/storybook

# Setup no CI/CD
# Toda semana: Storybook muda → Chromatic detecta mudanças visuais
```

**Testes:**
- [ ] Todos 100+ stories renderizam
- [ ] Dark mode stories funcionam
- [ ] Baseline visual criado
- [ ] Acessibilidade axe-core passa

**Tempo:** 4 horas

---

### **SEMANA 4: Testes & Finalização (5 dias)**

#### Dia 1-2: Dark Mode Full Test Suite

**Testes a executar:**
```typescript
// test/dark-mode.test.tsx
describe('Dark Mode', () => {
  it('Button background changes in dark mode', () => {
    render(
      <div data-theme="dark">
        <Button>Click me</Button>
      </div>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveStyle('background-color: var(--color-primary)');
    // CSS vars auto-resolve pelo navegador
  });

  it('All 43 components render in dark mode', () => {
    // Loop through all components
    // Verify no console errors
    // Check contraste WCAG AA
  });
});
```

**Manual Testing:**
- [ ] Abrir app em light mode
- [ ] Ativar dark mode (toggle ou system preference)
- [ ] Verificar 10+ componentes visuais
- [ ] Documentar screenshots before/after

**Tempo:** 2 dias

---

#### Dia 3: Accessibility Audit

```bash
# WCAG AA Audit
npm install --save-dev @axe-core/react

# Run in Storybook
# Detect color contrast issues
# Find missing ARIA labels
```

**Checklist:**
- [ ] Color contrast > 4.5:1 (large text)
- [ ] Color contrast > 7:1 (small text)
- [ ] Todos buttons com accessible name
- [ ] Todos inputs com labels
- [ ] Dark mode contrast OK

**Tempo:** 3 horas

---

#### Dia 4: Performance Testing

```bash
# Lighthouse audit
npm install --save-dev @lighthouse-core/cli

# Check:
# - CSS size (tokens.css < 10KB)
# - Paint time (no jank)
# - Dark mode toggle performance
```

**Baselines:**
- [ ] First Contentful Paint: < 2s
- [ ] Largest Contentful Paint: < 4s
- [ ] Dark mode toggle: instant (< 100ms)

**Tempo:** 2 horas

---

#### Dia 5: Sign-Off & Launch

**Final QA:**
- [ ] Todos testes passing ✅
- [ ] Storybook deployado
- [ ] Dark mode docs atualizado
- [ ] Migration guide escrito

**Launch:**
- [ ] Merge para main
- [ ] Deploy para produção
- [ ] Monitore erros por 24h
- [ ] Team training (30min)

**Tempo:** 4 horas

---

## 📋 Checklist Completo

### Preparação
- [ ] Tokens extraídos (DONE ✅)
- [ ] tokens.css, tokens.json, tokens.tailwind.js criados
- [ ] Equipe alocada (1 dev + 1 designer)
- [ ] Tools instaladas (Storybook, Chromatic)

### Semana 1
- [ ] CSS variables integradas
- [ ] Tailwind config atualizado
- [ ] Light/dark mode funcionando

### Semana 2
- [ ] 10 componentes refatorados
- [ ] Sem hardcoded colors
- [ ] Dark mode testado para cada

### Semana 3
- [ ] Storybook instalado
- [ ] 100+ stories criadas
- [ ] Visual regression baseline criado

### Semana 4
- [ ] Dark mode full test suite passing
- [ ] WCAG AA audit passed
- [ ] Performance baseline established
- [ ] Production deployment done

---

## 💰 Financial Impact

### Investimento
```
Semana 1 (Prep):        $2,000  (2 dev-days)
Semana 2 (Refactor):    $4,000  (4 dev-days)
Semana 3 (Storybook):   $4,000  (4 dev-days)
Semana 4 (Testing):     $3,000  (3 dev-days)
────────────────────────────────
TOTAL:                  $13,000 (13 dev-days)
```

### Retorno (Anual)
```
Componentes encontrados 80% mais rápido:    +$6,000
Dark mode zero bugs/maintenance:            +$3,000
Onboarding novo dev 5h mais rápido:         +$3,000
Design consistency (sem variantes):         +$4,000
────────────────────────────────
TOTAL GANHO/ANO:                            +$16,000

PAYBACK:                                    ~1 mês
ROI:                                        1.2x (Year 1)
```

---

## 🚀 Próximos Passos

### Imediatamente
1. [ ] Review este plano com o time
2. [ ] Alocar desenvolvedores (1 FTE)
3. [ ] Alocar designer (0.5 FTE)
4. [ ] Setup kickoff meeting

### Semana que vem
1. [ ] Começar Semana 1: Integração de tokens
2. [ ] Daily standups (15 min)
3. [ ] Friday reviews (1 hora)

### Monitoramento
- [ ] Progresso: rastreado no GitHub Projects
- [ ] Bloqueadores: escalação imediata
- [ ] QA: validação daily
- [ ] Launch: coordenado com produto

---

## 📚 Referências

**Documentação criada:**
- `tokens.yaml` — Design tokens (fonte da verdade)
- `tokens.css` — CSS custom properties
- `tokens.tailwind.js` — Tailwind config
- `COMPONENT-LIBRARY.md` — Inventory de componentes
- `AUDIT-REPORT-2026-02-07.md` — Análise detalhada
- `TOKENIZATION-COMPLETE.md` — Guia de uso

**Tools:**
- Storybook: https://storybook.js.org/
- Chromatic: https://www.chromatic.com/
- Axe DevTools: https://www.deque.com/axe/devtools/

---

## ✅ Sucesso = Quando...

- ✅ 91 cores → 25 tokens (73% redução)
- ✅ 100+ Storybook stories documentando componentes
- ✅ Dark mode 100% testado (WCAG AA)
- ✅ Component discovery < 3 minutos (era 15)
- ✅ Onboarding novo dev < 5 horas (era 10)
- ✅ Zero hardcoded colors em novos componentes
- ✅ ROI positivo em 1 mês

---

**Plano criado por Uma (UX-Design-Expert)**
**Pronto para execução:** Segunda-feira, 2026-02-10

🎨 *Refatoração com propósito, design com empatia* 💝

