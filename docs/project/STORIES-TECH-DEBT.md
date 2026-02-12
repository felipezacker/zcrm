# User Stories - Tech Debt Remediation

## Sprint 1: Fundação & Segurança

### [DEBT-001] Implementar CI para Migrações de Banco
**Como** Desenvolvedor Backend
**Quero** validar minhas migrações SQL em um banco temporário no GitHub Actions
**Para** garantir que não quebrei a produção com sintaxe inválida.
- **Critérios de Aceite**:
  - Script bash que sobe Supabase local via Docker.
  - Pipeline verifica se `supabase db reset` roda sem erros.
  - Pipeline falha se houver erro de SQL.
- **Estimativa**: 8pts (24h)

### [DEBT-002] Adicionar Índices Parciais para Soft Delete
**Como** Data Engineer
**Quero** adicionar índices `WHERE deleted_at IS NULL` nas tabelas principais
**Para** otimizar queries e evitar scan em registros "deletados".
- **Critérios de Aceite**:
  - Índices criados em `deals`, `contacts`, `activities`.
  - `EXPLAIN ANALYZE` mostra uso do índice em query de listagem.
- **Estimativa**: 2pts (4h)

### [DEBT-003] Remover Função `get_singleton_organization_id`
**Como** Arquiteto de Segurança
**Quero** remover a função que retorna um ID global de organização
**Para** obrigar o código a sempre passar o contexto da organização atual (Multi-tenant).
- **Critérios de Aceite**:
  - Função deletada do banco.
  - Middlewares atualizados para resolver `organization_id` via subdomínio ou sessão.
  - Teste de regressão validando login em 2 orgs diferentes.
- **Estimativa**: 5pts (16h)

---

## Sprint 2: Experiência Mobile & DX

### [DEBT-004] Refatorar Kanban Board para Mobile
**Como** Vendedor Externo
**Quero** visualizar meu funil de vendas no celular
**Para** mover cards e ver detalhes sem precisar de um computador.
- **Critérios de Aceite**:
  - Em telas < 640px, o Board mostra apenas 1 coluna por vez.
  - Navegação entre colunas via Tabs ou Swipe.
  - Drag and drop desabilitado ou otimizado para touch (long press).
- **Estimativa**: 8pts (20h)

### [DEBT-005] Automatizar Geração de Tipos TypeScript
**Como** Desenvolvedor Frontend
**Quero** que os tipos do banco sejam gerados automaticamente
**Para** não ter que manter interfaces manuais propensas a erro.
- **Critérios de Aceite**:
  - Script `npm run update-types` configurado.
  - CI checa se tipos estão atualizados.
  - `database.types.ts` atualizado com o schema real.
- **Estimativa**: 3pts (8h)

### [DEBT-006] Padronizar Dark Mode com Tokens
**Como** Designer UX
**Quero** que todos os componentes usem variáveis CSS OKLCH
**Para** que o modo escuro seja consistente e não tenha partes ilegíveis.
- **Critérios de Aceite**:
  - Nenhuma cor HEX hardcoded em componentes UI.
  - Auditoria visual em todas as telas principais no modo Dark.
- **Estimativa**: 5pts (16h)

---

## Sprint 3: Segurança & Observabilidade (Phase A-B)

### [SEC-001] Criptografia de API Keys & Rotação
**Como** Arquiteto de Segurança
**Quero** que as chaves de API sejam criptografadas e rotacionadas
**Para** mitigar o risco de vazamento em caso de breach.
- **Critérios de Aceite**:
  - Chaves (OpenAI, Anthropic, Google) criptografadas via `pgcrypto`.
  - Rate limiting Implementado na validação de chaves.
  - Job agendado (pg_cron) para rotação mensal.
- **Estimativa**: 5pts (16h)

### [OPS-001] Implementar Logging Estruturado
**Como** Desenvolvedor Backend
**Quero** logs estruturados (JSON) com correlation IDs
**Para** conseguir rastrear requisições e diagnosticar erros em produção com eficiência.
- **Critérios de Aceite**:
  - Middleware de logging (pino/winston) implementado.
  - Logs sensíveis (senhas/tokens) anonimizados.
  - Correlation ID propagado entre serviços.
- **Estimativa**: 3pts (8h)

### [OPS-002] Setup de Sentry & APM
**Como** DevOps Engineer
**Quero** rastreamento de erros e monitoramento de performance
**Para** ser alertado proativamente sobre falhas e lentidão.
- **Critérios de Aceite**:
  - SDK do Sentry configurado (Front + Back).
  - Source maps gerados no build para debug.
  - Alertas configurados para erros críticos (> 5%).
- **Estimativa**: 3pts (8h)
