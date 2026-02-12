# Database Specialist Review

**Date**: 2026-02-11
**Reviewer**: Data Engineer Agent (Orion)
**Status**: Completed

## 1. Débitos Validados

| ID | Débito | Severidade | Horas Est. | Prioridade | Notas |
|----|--------|------------|------------|------------|-------|
| DB-01 | **Ausência de ORM** | Média | 40h | Média | O acesso direto via `supabase-js` é flexível, mas a manutenção de types manuais (`database.types.ts`) é propensa a erros. Recomendado: automatizar geração de types com `supabase gen types`. |
| DB-02 | **Single vs Multi-tenant Híbrido** | Alta | 16h | Alta | A existência de `get_singleton_organization_id` é um code smell. Devemos migrar 100% para lógica multi-tenant (RLS já suporta). |
| DB-03 | **Índices de Soft Delete** | Média | 4h | Alta | Crítico para performance futura. Adicionar índices parciais `WHERE deleted_at IS NULL` em `deals`, `contacts`, `activities`. |
| DB-04 | **JSONB Performance** | Baixa | 8h | Baixa | Monitorar. Por enquanto volume de dados não justifica índices GIN complexos, mas devemos preparar queries para extrair campos se necessário. |
| DB-05 | **Migrações Raw SQL** | Alta | 24h | Alta | Risco de drift. Implementar pipeline de CI que roda migrações em banco efêmero de teste (Supabase CLI ou Docker). |

## 2. Débitos Adicionados

- **DB-06: Falta de Particionamento em `audit_logs`**: Tabela de logs crescerá indefinidamente. Recomendado: particionamento por mês (Range Partitioning). (Esforço: 8h, Prioridade: Baixa por enquanto).
- **DB-07: Backup Strategy**: Não identificado script de restore de teste automatizado. (Esforço: 4h, Prioridade: Média).

## 3. Respostas ao Architect

**Q1: A função `get_singleton_organization_id` é um legado que deve ser removido para suporte total a multi-tenant?**
**R:** Sim, absolutamente. Ela viola o princípio de isolamento. Devemos refatorar o código que a utiliza para exigir contexto de organização explícito (via subdomain ou user session).

**Q2: Precisamos implementar particionamento para as tabelas `audit_logs` e `activities`?**
**R:** `audit_logs`: Sim, recomendado planejar para quando passar de 1M linhas. `activities`: Não imediato, indexação correta (`organization_id`, `date`) deve segurar bem até 10M linhas.

## 4. Recomendações

1. **Imediato (Sprint Atual)**: Adicionar índices parciais de soft delete (`DB-03`).
2. **Curto Prazo (Próxima Sprint)**: Automatizar geração de tipos TypeScript (`DB-01`) e sanear migrações em CI (`DB-05`).
3. **Médio Prazo**: Remover `get_singleton_organization_id` (`DB-02`).
