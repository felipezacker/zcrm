# Database Audit - NossoCRM

**Documento:** FASE 2 - Brownfield Discovery  
**Gerado por:** @data-engineer (Dara)  
**Data:** 2026-02-09  
**Versão:** 1.0

---

## 1. Sumário de Segurança

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| **Row Level Security** | ✅ Habilitado | Todas as tabelas |
| **Extensions** | ✅ OK | uuid-ossp, pgcrypto, unaccent, pg_net |
| **Audit Logs** | ✅ Implementado | Tabela + função helper |
| **LGPD Compliance** | ✅ Estrutura | user_consents table |
| **Rate Limiting** | ✅ Implementado | rate_limits table |

---

## 2. Débitos Técnicos Identificados (Database)

### 2.1 🔴 CRÍTICO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| DB-001 | **RLS policies muito permissivas** | Algumas policies usam `USING (true)` - acesso irrestrito | 4-8h |
| DB-002 | **Falta de índices em colunas de busca** | Queries podem ficar lentas com volume | 2-4h |

### 2.2 🟠 ALTO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| DB-003 | **Soft delete sem cleanup** | Dados deletados acumulam indefinidamente | 4-8h |
| DB-004 | **Falta de índices em foreign keys** | JOINs lentos em escala | 2-4h |
| DB-005 | **Schema único consolidado (80KB)** | Difícil manutenção, migration única | 8-16h |

### 2.3 🟡 MÉDIO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| DB-006 | **Campos JSONB sem validação** | custom_fields, messages sem schema | 4-8h |
| DB-007 | **Falta de constraints CHECK** | Validações dependem do app | 2-4h |
| DB-008 | **Triggers sem log de erro** | Falhas silenciosas | 2-4h |

### 2.4 🟢 BAIXO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| DB-009 | **Inconsistência em naming** | some_table vs someTable | 1-2h |
| DB-010 | **Comentários faltando em tabelas** | Documentação inline ausente | 2-4h |

---

## 3. Análise de RLS Policies

### 3.1 Policies Muito Permissivas ⚠️

```sql
-- deal_notes: USANDO true - qualquer authenticated pode tudo
CREATE POLICY "deal_notes_access" ON public.deal_notes
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Similar em: deal_files, algumas outras
```

**Recomendação:** Implementar verificação de organização:
```sql
USING (
  deal_id IN (
    SELECT d.id FROM deals d
    JOIN boards b ON d.board_id = b.id
    WHERE b.organization_id = (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  )
)
```

### 3.2 Policies Adequadas ✅

- `profiles`: Acesso próprio para update
- `user_settings`: Isolamento por user_id
- `quick_scripts`: Sistema + próprios
- `ai_prompt_templates`: Admin manage, member view

---

## 4. Índices Recomendados

### 4.1 Alta Prioridade

```sql
-- Busca de deals por board (muito usado)
CREATE INDEX idx_deals_board_id ON deals(board_id) WHERE deleted_at IS NULL;

-- Busca de contacts por organization
CREATE INDEX idx_contacts_org ON contacts(organization_id) WHERE deleted_at IS NULL;

-- Activities por data (dashboard)
CREATE INDEX idx_activities_date ON activities(date) WHERE deleted_at IS NULL;

-- Deals por status (pipeline)
CREATE INDEX idx_deals_status ON deals(is_won, is_lost) WHERE deleted_at IS NULL;
```

### 4.2 Média Prioridade

```sql
-- Busca por email (login, convites)
CREATE INDEX idx_profiles_email ON profiles(email);

-- Foreign keys sem índice
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_activities_contact_id ON activities(contact_id);
```

---

## 5. Backup e Recovery

| Aspecto | Status |
|---------|--------|
| Backup automático | ✅ Supabase default |
| Point-in-time recovery | ✅ Supabase Pro |
| Soft delete | ✅ Implementado (deleted_at) |
| Cascade delete | ✅ Triggers implementados |

---

## 6. Performance Observations

| Query/Operação | Status | Nota |
|----------------|--------|------|
| Dashboard stats | ✅ Function | get_dashboard_stats() |
| Deal listing | ⚠️ | Pode melhorar com índices |
| Contact search | ⚠️ | Full table scan sem índice |
| AI conversations | ✅ | Índice em user_id |

---

## 7. Recomendações Prioritárias

1. **[CRÍTICO]** Revisar RLS policies com `USING (true)`
2. **[ALTO]** Adicionar índices em FKs e colunas de busca
3. **[ALTO]** Implementar job de cleanup para soft deletes
4. **[MÉDIO]** Adicionar constraints CHECK para validação
5. **[MÉDIO]** Documentar schema com COMMENT ON

---

**Status:** FASE 2 - AUDIT COMPLETO ✅
