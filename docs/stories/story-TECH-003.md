# Story TECH-003: Criar Loading Skeletons

**Story ID:** TECH-003  
**Epic:** TECH-DEBT-001  
**Status:** Ready for Dev  
**Priority:** P2 - Alto  
**Estimated:** 6h  
**Agent:** @dev (Dex)

---

## Story

Como **usuário**, preciso ver **skeletons de loading ao invés de telas em branco** para que eu tenha feedback visual imediato de que o conteúdo está carregando.

## Acceptance Criteria

- [ ] Componente `Skeleton` base criado em `components/ui/`
- [ ] Variantes: `SkeletonCard`, `SkeletonList`, `SkeletonTable`
- [ ] Aplicado na listagem de deals (pipeline)
- [ ] Aplicado na listagem de contatos
- [ ] Aplicado no dashboard
- [ ] Animação pulse suave com Tailwind
- [ ] Dark mode compatível
- [ ] `npm run build` passa sem erros

## Dev Notes

### Origens

- Brownfield Discovery: UX-008
- Docs: `docs/reviews/ux-specialist-review.md`

### Implementação

```tsx
// components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-pulse rounded-md bg-dark-border/50",
      className
    )} />
  );
}

export function SkeletonCard() { /* card skeleton */ }
export function SkeletonList({ rows = 5 }) { /* list skeleton */ }
export function SkeletonTable({ rows = 5, cols = 4 }) { /* table skeleton */ }
```

## Tasks

- [ ] 1. Criar `components/ui/skeleton.tsx` com `Skeleton` base
- [ ] 2. Adicionar variantes: `SkeletonCard`, `SkeletonList`, `SkeletonTable`
- [ ] 3. Aplicar `SkeletonList` na listagem de deals/pipeline
- [ ] 4. Aplicar `SkeletonList` na listagem de contatos
- [ ] 5. Aplicar `SkeletonCard` nos cards do dashboard
- [ ] 6. Testar dark mode
- [ ] 7. Run `npm run build`

## Testing

- [ ] Skeleton renderiza com animação pulse
- [ ] Dark mode funciona
- [ ] Build passa sem erros

## Dev Agent Record

### Checkboxes
### Debug Log
### Completion Notes
### Change Log
### File List

---

— Story criada pelo Brownfield Discovery Workflow
