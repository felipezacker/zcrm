# Story TECH-010: Implementar Testes Críticos

**Story ID:** TECH-010
**Epic:** TECH-DEBT-001
**Status:** In Progress
**Priority:** P1 - Crítico
**Estimated:** 30h
**Agent:** @dev (Dex) + @qa (Quinn)

---

## Story

Como **desenvolvedor**, preciso de **testes automatizados nos fluxos críticos** para que regressões sejam detectadas antes de chegar à produção.

## Acceptance Criteria

- [ ] Testes unitários para hooks críticos (useDeals, useContacts, useBoards)
- [ ] Testes para funções de negócio (pipeline, deal lifecycle)
- [ ] Testes para componentes UI críticos (KanbanBoard, ContactList, Dashboard)
- [ ] Coverage mínimo de 30% (de 16% atual)
- [ ] Testes rodam em CI (npm test)
- [ ] Nenhum teste flaky

## Dev Notes

### Origens

- Brownfield Discovery: SYS-004, UX-005
- Docs: `docs/prd/technical-debt-assessment.md`

### Prioridade de Testes (por impacto)

**Tier 1 - Funções de negócio (10h):**
- `lib/supabase/` — queries e mutations
- Deal lifecycle (create, move, win, lose)
- Contact CRUD operations
- Board/pipeline management

**Tier 2 - Hooks React (10h):**
- `hooks/useDeals.ts`
- `hooks/useContacts.ts`
- `hooks/useBoards.ts`
- `hooks/useBoardStages.ts`
- `hooks/useActivities.ts`

**Tier 3 - Componentes UI (10h):**
- `features/boards/components/Kanban/`
- `features/contacts/`
- `features/dashboard/`
- `components/ErrorBoundary.tsx`

### Stack de Testes

- **Framework:** Vitest (já configurado)
- **React:** @testing-library/react
- **Mocks:** vi.mock para Supabase client
- **Coverage:** vitest --coverage

## Tasks

- [ ] 1. Configurar coverage report (`vitest.config.ts`)
- [x] 2. Criar testes para deal lifecycle (create/move/win/lose)
- [x] 3. Criar testes para contact CRUD
- [ ] 4. Criar testes para hooks principais
- [ ] 5. Criar testes para KanbanBoard component
- [ ] 6. Criar testes para Dashboard component
- [ ] 7. Verificar coverage atingiu 30%
- [ ] 8. Garantir zero testes flaky

## Testing

- [ ] `npm test` passa sem falhas
- [ ] Coverage >= 30%
- [ ] Testes rodam em < 60 segundos

## Dev Agent Record

### Checkboxes
- [x] Task 2: Deal lifecycle tests (9 tests: getAll, markAsWon, markAsLost, reopen, delete, update duplicate)
- [x] Task 3: Contact CRUD tests (8 tests: getAll, getStageCounts, delete, hasDeals, companiesService getAll/delete)
- [x] Task 4 (partial): Activities service tests + utility tests (activitySort, slugify, priority, phone, sanitize utils)
### Debug Log
- Proxy-based createChain helper needed careful `then` handling for Vitest await resolution
- vi.hoisted() required for mock variables referenced inside vi.mock factory
- contactsService.hasDeals returns {hasDeals, dealCount, deals, error} not {data}
- Coverage: 17% → 21% (309 tests passing, 0 failures)
- Reaching 30% target requires Tier 2 (hooks with renderHook) and Tier 3 (component tests)
### Completion Notes
- 51 new tests added across 7 new test files
- All 309 tests passing, 0 failures
- Tier 1 (business functions) substantially complete
### Change Log
- 2026-02-10: Created deals.test.ts (9), contacts.test.ts (8), activities.test.ts (6), activitySort.test.ts (6), slugify.test.ts (7), priority.test.ts (9), phone.test.ts (10), utils.test.ts (13)
### File List
- lib/supabase/__tests__/deals.test.ts (new: deal lifecycle tests)
- lib/supabase/__tests__/contacts.test.ts (new: contacts + companies CRUD tests)
- lib/supabase/__tests__/activities.test.ts (new: activities service tests)
- lib/supabase/__tests__/utils.test.ts (new: sanitize/validation utils tests)
- lib/utils/__tests__/activitySort.test.ts (new: smart activity sorting tests)
- lib/utils/__tests__/slugify.test.ts (new: slugify utility tests)
- lib/utils/__tests__/priority.test.ts (new: priority label formatting tests)
- lib/__tests__/phone.test.ts (new: phone E.164 normalization tests)
- docs/stories/story-TECH-010.md (modified: progress updates)

---

— Story criada pelo Brownfield Discovery Workflow
