# Technical Debt Assessment - DRAFT

**Date**: 2026-02-11
**Status**: Draft (Pending Specialist Review)

## Para Revisão dos Especialistas

### 1. Débitos de Sistema
Identificados na análise de arquitetura (`docs/architecture/system-architecture.md`):

1. **Migrações em SQL Puro**: O uso de arquivos SQL puros em `supabase/migrations/` sem uma camada de abstração (ORM) pode levar a erros manuais e discrepâncias de tipo no client.
2. **Ambiente de Testes**: A cobertura de testes (Vitest) precisa ser verificada e expandida, especialmente para integração.
3. **Estrutura "features/"**: A organização em `features/` vs `app/` precisa de regras claras de encapsulamento para evitar acoplamento.
4. **Dependências**: O projeto tem muitas dependências (`package.json`), o que pode impactar o tempo de build e a superfície de ataque.
5. **Typescript Strictness**: Verificar se `tsconfig.json` está com `strict: true` e se há muitos `any` no código.

### 2. Débitos de Database
Identificados na auditoria (`supabase/docs/DB-AUDIT.md`):

1. **Ausência de ORM**: Acesso direto via `supabase-js` requer manutenção manual de tipos (`database.types.ts`).
2. **Single vs Multi-tenant**: A estrutura permite multi-tenant, mas funções como `get_singleton_organization_id` sugerem uso híbrido ou transição incompleta.
3. **Índices de Soft Delete**: Necessário garantir que todas as queries filtrem `deleted_at IS NULL` e que existam índices parciais para isso.
4. **JSONB Performance**: Uso extensivo de JSONB (`custom_fields`, IA context) sem índices GIN claros pode degradar performance com volume de dados.

⚠️ **PENDENTE**: Revisão do @data-engineer sobre performance real das queries e integridade referencial.

### 3. Débitos de Frontend/UX
Identificados na especificação (`docs/frontend/frontend-spec.md`):

1. **Acessibilidade (a11y)**: Embora `sr-only` e `focus-visible` existam, a conformidade WCAG 2.1 AA precisa de auditoria manual (cores, navegação por teclado).
2. **Bundle Size**: `next.config.ts` usa `optimizePackageImports`, mas bibliotecas pesadas como `recharts` e `framer-motion` podem impactar o First Contentful Paint (FCP).
3. **Consistência Visual**: Garantir que todos os componentes usem os tokens OKLCH do `globals.css` e não cores hardcoded.
4. **Mobile Experience**: Verificar se o layout complexo (Kanban, Gráficos) se adapta bem a telas `xs` e `sm` sem quebra.

⚠️ **PENDENTE**: Revisão do @ux-design-expert sobre usabilidade mobile e acessibilidade.

### 4. Matriz Preliminar

| ID | Débito | Área | Impacto | Esforço | Prioridade |
|----|--------|------|---------|---------|------------|
| T-01 | Migrações SQL sem verificação CI | Backend | Alto (Quebra de prod) | Médio | Alta |
| T-02 | Cobertura de Testes Baixa | QA | Médio (Regressão) | Alto | Média |
| T-03 | Índices faltantes para Soft Delete | DB | Alto (Performance) | Baixo | Alta |
| T-04 | Acessibilidade Incompleta | Frontend | Médio (Compliance) | Médio | Média |
| T-05 | Ambiguidade Single/Multi-tenant | Arq | Alto (Segurança data leak) | Médio | Alta |

### 5. Perguntas para Especialistas

**Para @data-engineer:**
1. A função `get_singleton_organization_id` é um legado que deve ser removido para suporte total a multi-tenant?
2. Precisamos implementar particionamento para as tabelas `audit_logs` e `activities`?

**Para @ux-design-expert:**
1. Os componentes do Radix UI estão devidamente estilizados para Dark Mode com a paleta OKLCH?
2. Como lidar com a visualização do Kanban em mobile (scroll horizontal ou stack vertical)?
