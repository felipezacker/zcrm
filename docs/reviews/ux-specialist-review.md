# UX/Frontend Specialist Review

**Date**: 2026-02-11
**Reviewer**: UX Design Expert Agent (Orion)
**Status**: Completed

## 1. Débitos Validados

| ID | Débito | Severidade | Horas Est. | Prioridade | Impacto UX |
|----|--------|------------|------------|------------|------------|
| FE-01 | **Acessibilidade (a11y)** | Média | 24h | Média | Exclusão de usuários assistive tech. Falta auditoria de keyboard nav. `focus-visible` existe mas precisa ser validado em todos componentes interativos. |
| FE-02 | **Bundle Size** | Baixa | 8h | Baixa | `next.config.ts` mitiga, mas `framer-motion` em mobile pode causar jank. Recomendado: Code-split de animações pesadas. |
| FE-03 | **Dark Mode Consistency** | Média | 16h | Média | Cores hardcoded encontradas em `globals.css` legado? Precisa migrar tudo para variáveis CSS OKLCH para evitar flash-of-unstyled-colors no tema escuro. |
| FE-04 | **Layout Mobile (Kanban)** | Alta | 20h | Alta | Kanban tradicional é inutilizável em `xs`screens. Precisa converter para "List View" ou "Swipe Cards" em resoluções < 640px. |

## 2. Débitos Adicionados

- **FE-05: Loading States**: Falta padronização de skeletons. Usuário vê layout shift ao carregar dados do Supabase. (Esforço: 12h, Prioridade: Média).
- **FE-06: Form Validation Feedback**: `react-hook-form` está em uso, mas mensagens de erro precisam ser mais claras e acessíveis (`aria-invalid`). (Esforço: 8h, Prioridade: Baixa).

## 3. Respostas ao Architect

**Q1: Os componentes do Radix UI estão devidamente estilizados para Dark Mode com a paleta OKLCH?**
**R:** Parcialmente. A configuração de variáveis no `globals.css` suporta, mas componentes individuais precisam ser revisados para usar classes como `bg-surface dark:bg-surface` ou `bg-[var(--color-surface)]` consistentemente.

**Q2: Como lidar com a visualização do Kanban em mobile (scroll horizontal ou stack vertical)?**
**R:** NUNCA usar scroll horizontal duplo (tela + board). **Recomendação**: Em mobile, mostrar apenas 1 coluna por vez, com tabs ou swipe para navegar entre colunas. Ou transformar em lista accordion. A abordagem de Tabs é a mais segura para usabilidade.

## 4. Recomendações de Design

1. **Mobile First**: Refatorar o componente de Board para aceitar um modo de visualização "Column View" em telas pequenas.
2. **Design System**: Criar um arquivo `tokens.ts` centralizado que exporte as variáveis CSS para uso no Tailwind, garantindo que o TS saiba as cores disponíveis.
3. **Optimistic UI**: Implementar feedback imediato (Optimistic Updates) ao mover cards no Kanban, revertendo se a chamada Supabase falhar.
