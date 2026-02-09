# Database Specialist Review

**Documento:** FASE 5 - Brownfield Discovery  
**Revisor:** @data-engineer (Dara)  
**Data:** 2026-02-09

---

## Gate Status: ✅ VALIDATED

---

## Débitos Validados

| ID | Débito | Severidade | Horas | Prioridade | Notas |
|----|--------|------------|-------|------------|-------|
| DB-001 | RLS policies `USING(true)` | 🔴 Crítico | 6h | P1 | Intencional para single-tenant, mas risco se escalar |
| DB-002 | Falta índices de busca | 🔴 Crítico | 3h | P1 | Impacto já sentido em queries de deals |
| DB-003 | Soft delete sem cleanup | 🟠 Alto | 6h | P2 | Requer job cron no Supabase |
| DB-004 | FKs sem índice | 🟠 Alto | 3h | P2 | Crítico para JOINs em produção |
| DB-005 | Schema consolidado 80KB | 🟠 Alto | 12h | P3 | Quebrar em migrations separadas |
| DB-006 | JSONB sem validação | 🟡 Médio | 6h | P3 | Implementar com Zod no app layer |
| DB-007 | Falta constraints CHECK | 🟡 Médio | 3h | P3 | Adicionar para enums críticos |
| DB-008 | Triggers sem log | 🟡 Médio | 3h | P3 | Adicionar RAISE NOTICE |
| DB-009 | Naming inconsistente | 🟢 Baixo | 1.5h | P4 | Baixa prioridade |
| DB-010 | Comentários faltando | 🟢 Baixo | 3h | P4 | Documentação melhor no schema |

---

## Débitos Adicionados

| ID | Débito | Severidade | Horas | Prioridade |
|----|--------|------------|-------|------------|
| DB-011 | Falta de backups automatizados fora Supabase | 🟡 Médio | 4h | P3 |
| DB-012 | Sem testes de migrations | 🟡 Médio | 8h | P3 |

---

## Respostas ao Architect

**Q1:** As policies RLS com `USING (true)` são intencionais?
> **R:** Sim, para single-tenant. Porém, representa risco se o produto escalar para multi-tenant. Recomendo adicionar verificação de `organization_id` preventivamente.

**Q2:** Existe job de cleanup para soft deletes?
> **R:** Não detectei. Necessário implementar função `cleanup_soft_deleted()` + cron job via Supabase Edge Functions ou pg_cron.

**Q3:** O schema consolidado é problema?
> **R:** Sim. 80KB em uma única migration dificulta rollbacks parciais e code review. Recomendo quebrar em migrations por domínio.

---

## Recomendações

**Ordem de Resolução:**
1. DB-002: Índices de busca (impacto imediato em performance)
2. DB-001: Revisar RLS críticas (segurança)
3. DB-004: Índices em FKs (performance)
4. DB-003: Job de cleanup (manutenção)
5. Demais em sprints subsequentes

---

**Status:** FASE 5 - VALIDADO ✅
