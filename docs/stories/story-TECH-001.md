# Story TECH-001: Adicionar Índices de Performance no Database

**Story ID:** TECH-001  
**Epic:** TECH-DEBT-001  
**Status:** ✅ Complete  
**Priority:** P1 - Crítico  
**Estimated:** 3h  
**Agent:** @dev (Dex)

---

## Story

Como **desenvolvedor**, preciso adicionar **índices de performance nas queries mais usadas** para que o sistema responda mais rápido em produção.

## Acceptance Criteria

- [x] Índices criados em migration separada
- [x] Nenhuma query de listagem faz full table scan
- [x] Migration é idempotente (IF NOT EXISTS)
- [x] `npm run build` passa sem erros

## Dev Notes

### Origens

- Brownfield Discovery: DB-002 + DB-004
- Docs: `supabase/docs/DB-AUDIT.md`

### Índices Necessários

```sql
-- Deals por board (listagem pipeline)
CREATE INDEX IF NOT EXISTS idx_deals_board_active ON deals(board_id) WHERE deleted_at IS NULL;

-- Deals por status (dashboard)
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(is_won, is_lost) WHERE deleted_at IS NULL;

-- Deals por contato (relação)
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals(contact_id);

-- Contacts por organização (listagem)
CREATE INDEX IF NOT EXISTS idx_contacts_org_active ON contacts(organization_id) WHERE deleted_at IS NULL;

-- Activities por data (dashboard, calendário)
CREATE INDEX IF NOT EXISTS idx_activities_date_active ON activities(date) WHERE deleted_at IS NULL;

-- Activities por contato
CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON activities(contact_id);

-- Profiles por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Deals por owner
CREATE INDEX IF NOT EXISTS idx_deals_owner_id ON deals(owner_id);

-- Contacts por owner
CREATE INDEX IF NOT EXISTS idx_contacts_owner_id ON contacts(owner_id);
```

### Migration File

Criar: `supabase/migrations/20260209000000_add_performance_indexes_v2.sql`

> ⚠️ Já existe `20260205000000_add_performance_indexes.sql` - verificar quais índices já existem antes de duplicar.

## Tasks

- [x] 1. Verificar índices existentes em `20260205000000_add_performance_indexes.sql`
- [x] 2. Criar migration `20260209000000_add_performance_indexes_v2.sql` com índices faltantes
- [x] 3. Verificar a migration é válida (usar IF NOT EXISTS)
- [x] 4. Run `npm run build` para garantir nada quebrou

## Testing

- [x] Migration SQL é sintaticamente válida
- [x] Usa IF NOT EXISTS para idempotência
- [x] Não duplica índices existentes

## Dev Agent Record

### Checkboxes
_(updated by @dev during implementation)_

### Debug Log
_(updated by @dev if issues arise)_

### Completion Notes
_(updated by @dev on completion)_

### Change Log
_(updated by @dev)_

### File List
_(updated by @dev)_

---

— Story criada pelo Brownfield Discovery Workflow
