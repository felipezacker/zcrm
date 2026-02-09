# Frontend Specification - NossoCRM

**Documento:** FASE 3 - Brownfield Discovery  
**Gerado por:** @ux-design-expert (Uma)  
**Data:** 2026-02-09  
**Versão:** 1.0

---

## 1. Stack Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 16.0.10 | App Router, SSR |
| **React** | 19.2.1 | UI Runtime |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Estilização |
| **Radix UI** | 1.x-2.x | Primitivos acessíveis |
| **Framer Motion** | 12.x | Animações |
| **Zustand** | 5.x | State management |
| **React Query** | 5.x | Data fetching |
| **Recharts** | 3.x | Gráficos |
| **Lucide React** | 0.560.0 | Ícones |

---

## 2. Componentes UI (19 componentes)

### 2.1 Primitivos Base (Radix-based)

| Componente | Arquivo | Tamanho |
|------------|---------|---------|
| `Button` | button.tsx | 2KB |
| `Card` | card.tsx | 2KB |
| `Badge` | badge.tsx | 1.4KB |
| `Avatar` | avatar.tsx | 1.5KB |
| `Tabs` | tabs.tsx | 2KB |
| `Popover` | popover.tsx | 1.4KB |
| `Tooltip` | tooltip.tsx | 1.2KB |
| `Alert` | alert.tsx | 1.7KB |

### 2.2 Componentes Compostos

| Componente | Arquivo | Tamanho |
|------------|---------|---------|
| `Modal` | Modal.tsx | 4.7KB |
| `Sheet` | Sheet.tsx | 2.6KB |
| `ActionSheet` | ActionSheet.tsx | 4.3KB |
| `FullscreenSheet` | FullscreenSheet.tsx | 1.7KB |
| `FormField` | FormField.tsx | 13.7KB |
| `ContactSearchCombobox` | ContactSearchCombobox.tsx | 8.5KB |
| `AudioPlayer` | AudioPlayer.tsx | 7.1KB |
| `LossReasonModal` | LossReasonModal.tsx | 8.2KB |

### 2.3 Componentes com Testes ✅

- `Modal.test.tsx` ✅
- `FormField.test.tsx` ✅
- `ConfirmModal.test.tsx` ✅

---

## 3. Design System

### 3.1 Cores (Tailwind Config)

```javascript
colors: {
  primary: {
    50: '#f0f9ff',   // Lightest
    500: '#0ea5e9',  // Main
    900: '#0c4a6e',  // Darkest
  },
  dark: {
    bg: '#020617',     // Background
    card: '#0f172a',   // Cards
    border: '#1e293b', // Borders
    hover: '#334155',  // Hover states
  }
}
```

### 3.2 Tipografia

| Uso | Fonte |
|-----|-------|
| Body | Inter (var) |
| Display | Space Grotesk |
| Serif/Accent | Cinzel |

### 3.3 Dark Mode

- **Status:** ✅ Habilitado
- **Implementação:** `class` strategy
- **ThemeContext:** Gerenciamento de tema

---

## 4. Features Modules (11)

| Módulo | Propósito | Componentes |
|--------|-----------|-------------|
| `activities` | Tarefas/Reuniões | 10 arquivos |
| `ai-hub` | Central de IA | 3 arquivos |
| `boards` | Kanban | 23 arquivos |
| `contacts` | Gestão de contatos | 14 arquivos |
| `dashboard` | Analytics | 5 arquivos |
| `deals` | Oportunidades | 2 arquivos |
| `decisions` | Decisões IA | 8 arquivos |
| `inbox` | Inbox inteligente | 21 arquivos |
| `profile` | Perfil | 1 arquivo |
| `reports` | Relatórios | 2 arquivos |
| `settings` | Configurações | 17 arquivos |

---

## 5. Débitos Técnicos (Frontend/UX)

### 5.1 🔴 CRÍTICO

| ID | Débito | Impacto UX | Esforço |
|----|--------|------------|---------|
| UX-001 | **Design system não documentado** | Inconsistência visual, onboarding lento | 16-24h |
| UX-002 | **Componentes sem Storybook** | Difícil testar variações | 8-16h |

### 5.2 🟠 ALTO

| ID | Débito | Impacto UX | Esforço |
|----|--------|------------|---------|
| UX-003 | **FormField muito grande (13KB)** | Difícil manutenção, muitas responsabilidades | 8-16h |
| UX-004 | **Inconsistência de naming** | button.tsx vs Button.tsx vs ActionSheet.tsx | 2-4h |
| UX-005 | **Poucos testes de componentes** | Apenas 3 de 19 testados (16%) | 16-24h |
| UX-006 | **Contexts overload** | 12 contexts no diretório context/ | 8-16h |

### 5.3 🟡 MÉDIO

| ID | Débito | Impacto UX | Esforço |
|----|--------|------------|---------|
| UX-007 | **modalStyles.ts separado** | Estilos mistos (CSS-in-JS + Tailwind) | 2-4h |
| UX-008 | **Falta de Loading Skeletons** | UX de loading pode melhorar | 4-8h |
| UX-009 | **Ausência de Error Boundaries** | Erros podem quebrar a UI inteira | 4-8h |

### 5.4 🟢 BAIXO

| ID | Débito | Impacto UX | Esforço |
|----|--------|------------|---------|
| UX-010 | **Ícones hardcoded como strings** | `icon: 'MessageSquare'` em quick_scripts | 1-2h |

---

## 6. Acessibilidade (a11y)

| Aspecto | Status |
|---------|--------|
| Lib dedicada | ✅ `lib/a11y/` (14 arquivos) |
| Radix UI | ✅ Primitivos acessíveis |
| Focus Trap | ✅ focus-trap-react instalado |
| ARIA labels | ⚠️ Verificar cobertura |
| Keyboard nav | ⚠️ Verificar cobertura |

---

## 7. Performance Frontend

| Aspecto | Status |
|---------|--------|
| SSR/SSG | ✅ Next.js App Router |
| Code splitting | ✅ Automático |
| Image optimization | ✅ next/image |
| Bundle analysis | ⚠️ Não detectado |
| Lazy loading | ⚠️ Verificar uso |

---

## 8. Responsividade

| Aspecto | Status |
|---------|--------|
| Mobile first | ⚠️ Verificar |
| Breakpoints | ✅ Tailwind defaults |
| PWA | ✅ `components/pwa/` (3 arquivos) |

---

## 9. Recomendações Prioritárias

1. **[CRÍTICO]** Documentar design system (colors, tokens, components)
2. **[ALTO]** Implementar Storybook para componentes
3. **[ALTO]** Refatorar FormField em componentes menores
4. **[ALTO]** Aumentar cobertura de testes de componentes
5. **[MÉDIO]** Adicionar Loading Skeletons e Error Boundaries
6. **[MÉDIO]** Padronizar naming (PascalCase para todos)

---

**Status:** FASE 3 - FRONTEND SPEC COMPLETA ✅
