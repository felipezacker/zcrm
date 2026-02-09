# Story TECH-004: Padronizar Naming de Componentes

**Story ID:** TECH-004  
**Epic:** TECH-DEBT-001  
**Status:** Ready for Dev  
**Priority:** P3 - Médio  
**Estimated:** 3h  
**Agent:** @dev (Dex)

---

## Story

Como **desenvolvedor**, preciso que **todos os arquivos de componentes sigam PascalCase** para ter consistência no codebase e facilitar imports.

## Acceptance Criteria

- [ ] Todos componentes em `components/ui/` usam PascalCase
- [ ] Imports atualizados em todos os arquivos que referenciam os renomeados
- [ ] `npm run build` passa sem erros
- [ ] `npm run typecheck` passa sem erros

## Dev Notes

### Origens

- Brownfield Discovery: UX-004
- Docs: `docs/reviews/ux-specialist-review.md`

### Arquivos para Renomear

| De | Para |
|----|------|
| `alert.tsx` | `Alert.tsx` |
| `avatar.tsx` | `Avatar.tsx` |
| `badge.tsx` | `Badge.tsx` |
| `button.tsx` | `Button.tsx` |
| `card.tsx` | `Card.tsx` |
| `popover.tsx` | `Popover.tsx` |
| `tabs.tsx` | `Tabs.tsx` |
| `tooltip.tsx` | `Tooltip.tsx` |
| `modalStyles.ts` | `ModalStyles.ts` |

### ⚠️ Cuidados

- Git em macOS é case-insensitive por default - usar `git mv` para renomear
- Atualizar TODOS os imports que referenciam esses arquivos
- Usar busca global para encontrar imports

## Tasks

- [ ] 1. Listar todos os imports dos componentes a renomear
- [ ] 2. Renomear arquivos com `git mv` (um por um)
- [ ] 3. Atualizar imports em todos os arquivos referenciados
- [ ] 4. Run `npm run typecheck`
- [ ] 5. Run `npm run build`

## Testing

- [ ] Build sem erros
- [ ] Typecheck sem erros
- [ ] Todos imports resolvem corretamente

## Dev Agent Record

### Checkboxes
### Debug Log
### Completion Notes
### Change Log
### File List

---

— Story criada pelo Brownfield Discovery Workflow
