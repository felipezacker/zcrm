# Story TECH-007: Habilitar TypeScript Strict Mode

**Story ID:** TECH-007
**Epic:** TECH-DEBT-001
**Status:** ✅ Done
**Priority:** P1 - Crítico
**Estimated:** 12h
**Agent:** @dev (Dex) + @architect

---

## Story

Como **desenvolvedor**, preciso que o **TypeScript opere em strict mode** para que erros de tipo sejam capturados em tempo de compilação e não em produção.

## Acceptance Criteria

- [ ] `tsconfig.json` com `strict: true`
- [ ] Zero erros em `npm run typecheck`
- [ ] Migração feita por módulo (não big bang)
- [ ] Tipos `any` explícitos documentados com `// TODO: type properly`
- [ ] `npm run build` passa sem erros
- [ ] Nenhum cast inseguro (`as any`) adicionado sem justificativa

## Dev Notes

### Origens

- Brownfield Discovery: SYS-001
- Docs: `docs/prd/technical-debt-assessment.md`

### Estratégia de Migração

1. **Fase 1:** Habilitar flags incrementalmente
   - `strictNullChecks: true` (maior impacto)
   - `strictFunctionTypes: true`
   - `strictBindCallApply: true`
   - `strictPropertyInitialization: true`
   - `noImplicitAny: true`

2. **Fase 2:** Corrigir erros por módulo
   - `lib/` — utilitários e helpers
   - `components/ui/` — componentes base
   - `features/` — módulos de negócio
   - `app/` — routes e layouts

3. **Fase 3:** Habilitar `strict: true` (engloba tudo)

### Padrões Aceitos Temporariamente

```typescript
// Aceitável durante migração (com TODO):
const value = data as unknown as SpecificType; // TODO: type properly

// NÃO aceitável:
const value = data as any; // sem justificativa
```

## Tasks

- [x] 1. Auditar `tsconfig.json` atual e listar flags faltantes
- [x] 2. Habilitar `strictNullChecks` e corrigir erros
- [x] 3. Habilitar `strictFunctionTypes` e corrigir erros
- [x] 4. Habilitar `noImplicitAny` e corrigir erros
- [x] 5. Habilitar `strict: true` (flag guarda-chuva)
- [x] 6. Run `npm run typecheck` — zero erros
- [x] 7. Run `npm run build` — sem erros
- [x] 8. Documentar `any` residuais com TODO

## Testing

- [ ] `npm run typecheck` passa com strict: true
- [ ] `npm run build` passa sem erros
- [ ] Nenhuma regressão funcional

## Dev Agent Record

### Checkboxes
- [x] All tasks complete
### Debug Log
- strictNullChecks already enabled, only 7 errors for full strict:true
- Errors: FunnelChart formatter type, ContactsStageTabs index signature, FocusContextPanel onAddActivity type mismatch, supabase.ts implicit any, queryKeys contravariance
### Completion Notes
- Enabled `strict: true` in tsconfig.json (was `false`)
- Fixed 7 type errors across 6 files
- Zero `as any` casts — used proper type narrowing and Partial types
- One `as Omit<>` cast in 2 call sites (DealCockpitFocusClient, InboxFocusView) due to existing design mismatch between FocusContextPanel prop interface and ActivitiesContext
### Change Log
- 2026-02-10: Enabled strict:true, fixed 7 type errors, build+typecheck pass
### File List
- tsconfig.json (modified: strict: true)
- components/charts/FunnelChart.tsx (fixed: formatter param type)
- features/contacts/components/ContactsStageTabs.tsx (fixed: index signature)
- features/inbox/components/FocusContextPanel.tsx (fixed: onAddActivity prop type)
- features/deals/cockpit/DealCockpitFocusClient.tsx (fixed: addActivity wrapper)
- features/inbox/components/InboxFocusView.tsx (fixed: addActivity wrapper)
- lib/installer/supabase.ts (fixed: implicit any param)
- lib/query/createQueryKeys.ts (fixed: generic constraint for strict function types)

---

— Story criada pelo Brownfield Discovery Workflow
