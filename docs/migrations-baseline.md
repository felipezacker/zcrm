# Baseline de Migrações (Single Migration) — Guia e Auditoria

## Objetivo

Facilitar o onboarding (especialmente do aluno) mantendo **apenas 1 migration** em `supabase/migrations/`, contendo o schema completo do CRM.

- **Migration canônica (única)**: `supabase/migrations/20251201000000_schema_init.sql`
- Esse arquivo deve ser considerado a **fonte da verdade** do banco para *fresh install* (`supabase db reset`).

## Auditoria das migrations existentes (Dez/2025)

O projeto tinha 10 migrations. A maior parte já estava consolidada em `20251201000000_schema_init.sql`, mas alguns recursos foram adicionados depois via migrations incrementais.

### Resultado da auditoria (o que foi consolidado no baseline)

- **`20251201000000_schema_init.sql`** (**mantida**):
  - Base do schema (CRM single-tenant com `organizations`, `profiles`, boards/estágios/deals/contacts/products/activities).
  - Cockpit (notas/arquivos/scripts).
  - Segurança (rate limit, consents, audit logs, security alerts).
  - RLS/policies + realtime + grants.
  - Board archive features (`won_stage_id`, `lost_stage_id`, flags).
  - **Atualizada** para incluir também:
    - **IA (org-wide)**: `organization_settings.ai_enabled`
    - **IA (prompts)**: `ai_prompt_templates` (versionamento simples + 1 ativo por `key`)
    - **IA (flags)**: `ai_feature_flags` (por organização)
    - **Boards**: `boards.default_product_id`
    - **Activities**: `client_company_id` e `participant_contact_ids` + índices
    - **Integrações/Webhooks**: `pg_net`, tabelas `integration_*`, `webhook_*`, trigger `notify_deal_stage_changed()`

- **`20251222000000_add_cockpit_preferences_to_org_settings.sql`** (era **NOOP**):
  - Migração descontinuada; não alterava schema.

- **`20251225000000_ai_prompts.sql`**:
  - Conteúdo consolidado no baseline (tabela `ai_prompt_templates` + índices/policies).

- **`20251225000001_ai_enabled_user_settings.sql`** e **`20251225000003_drop_user_ai_enabled.sql`**:
  - Tentativa de toggle por usuário foi revertida.
  - **Padrão final**: toggle **org-wide** em `organization_settings.ai_enabled` (consolidado no baseline).

- **`20251225000002_org_ai_enabled.sql`**:
  - Consolidado no baseline via coluna `organization_settings.ai_enabled`.

- **`20251225000004_ai_feature_flags.sql`**:
  - Consolidado no baseline (tabela `ai_feature_flags` + índices/policies).

- **`20251225170000_add_default_product_to_boards.sql`**:
  - Consolidado no baseline (`boards.default_product_id` + índice).

- **`20251226000000_add_activity_company_context.sql`**:
  - Consolidado no baseline (colunas/índices).
  - Observação: o **backfill** fazia sentido para bancos já existentes; para *fresh install* do aluno ele não é necessário.

- **`20251226010000_integrations_webhooks_product.sql`**:
  - Consolidado no baseline (`pg_net`, tabelas e trigger).

## Padrão para o futuro (para não “squashar” toda hora)

O motivo de você precisar “squashar” sempre é misturar dois objetivos:

- **Produto em produção**: precisa de migrations incrementais para atualizar bancos existentes.
- **Curso/aluno**: precisa de um baseline simples para instalar do zero.

### Opção A (curso / aluno) — recomendada aqui

Manter **sempre 1 migration** e **editar o baseline** quando o schema mudar.

Regras:
- **Não criar** novos arquivos em `supabase/migrations/`.
- Toda alteração no banco deve virar um bloco novo no final do `schema_init` com comentário de data/objetivo.
- Sempre que mexer no banco, atualizar `docs/changelog.md`.
- Validar com `supabase db reset` (fresh install) antes de entregar ao aluno.

Trade-off:
- Isso é excelente para instalação do zero, mas **não é o fluxo ideal para atualizar um banco já existente** (produção).

### Opção B (produto / produção) — quando você precisar evoluir sem perder histórico

Quando houver produção de verdade:
- Manter migrations incrementais no branch principal (histórico e upgrade path).
- Criar um “release”/tag/branch do curso com o baseline único (snapshot) para alunos.

## Checklist rápido (antes de entregar pro aluno)

- `supabase db reset` aplica o baseline do zero sem erros
- App sobe e consegue:
  - criar deals/boards/activities
  - usar prompts/flags de IA
  - criar/editar webhooks e disparar `deal.stage_changed`

