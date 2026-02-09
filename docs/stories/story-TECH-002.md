# Story TECH-002: Implementar Error Boundaries

**Story ID:** TECH-002  
**Epic:** TECH-DEBT-001  
**Status:** Ready for Dev  
**Priority:** P2 - Alto  
**Estimated:** 6h  
**Agent:** @dev (Dex)

---

## Story

Como **usuário**, preciso que **erros em componentes individuais não quebrem a aplicação inteira** para que eu possa continuar usando outras funcionalidades mesmo se uma parte falhar.

## Acceptance Criteria

- [ ] Error Boundary genérico criado em `components/`
- [ ] Error Boundary aplicado em cada feature module
- [ ] Fallback UI mostra mensagem amigável + botão de retry
- [ ] Erros são logados (console em dev, audit em prod)
- [ ] `npm run build` passa sem erros
- [ ] Testes unitários adicionados

## Dev Notes

### Origens

- Brownfield Discovery: UX-009
- Docs: `docs/reviews/ux-specialist-review.md`

### Implementação

1. **Criar `components/ErrorBoundary.tsx`:**
   - React Error Boundary class component (React 19 compatible)
   - Props: `fallback`, `onError`, `children`
   - Retry button que reseta o estado

2. **Criar `components/FeatureErrorBoundary.tsx`:**
   - Wrapper que usa ErrorBoundary com UI padrão
   - Ícone de erro + mensagem + botão "Tentar novamente"
   - Estilizado com Tailwind/dark mode

3. **Aplicar nos layouts protegidos:**
   - `app/(protected)/layout.tsx` - wrapping geral
   - Cada feature route pode ter seu próprio boundary

## Tasks

- [ ] 1. Criar `components/ErrorBoundary.tsx` (class component genérico)
- [ ] 2. Criar `components/FeatureErrorBoundary.tsx` (wrapper com UI)
- [ ] 3. Aplicar Error Boundary no layout protegido
- [ ] 4. Adicionar testes para ErrorBoundary
- [ ] 5. Run `npm run build` e `npm run typecheck`

## Testing

- [ ] Error Boundary captura erros de render
- [ ] Fallback UI renderiza corretamente
- [ ] Botão retry funciona
- [ ] Build passa sem erros

## Dev Agent Record

### Checkboxes
### Debug Log
### Completion Notes
### Change Log
### File List

---

— Story criada pelo Brownfield Discovery Workflow
