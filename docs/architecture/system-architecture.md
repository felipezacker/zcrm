# System Architecture - NossoCRM (zcrm-v1)

**Documento:** FASE 1 - Brownfield Discovery  
**Gerado por:** @architect (Aria)  
**Data:** 2026-02-09  
**Versão:** 1.0

---

## 1. Visão Geral do Sistema

### 1.1 Descrição
NossoCRM é um CRM inteligente com assistente de IA integrado para gestão de pipeline de vendas, contatos e atividades.

### 1.2 Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Framework** | Next.js | 16.0.10 |
| **Runtime** | React | 19.2.1 |
| **Linguagem** | TypeScript | 5.x |
| **Banco de Dados** | Supabase (PostgreSQL) | SSR 0.8.0 |
| **UI Components** | Radix UI | 1.x - 2.x |
| **Estilização** | Tailwind CSS | 4.x |
| **State Management** | Zustand + React Query | 5.x |
| **AI SDK** | Vercel AI SDK | 6.0.72 |
| **Testing** | Vitest + Testing Library | 4.0.0 |

### 1.3 Integrações de IA

| Provider | Package |
|----------|---------|
| Anthropic | @ai-sdk/anthropic 3.0.37 |
| Google | @ai-sdk/google 3.0.21 |
| OpenAI | @ai-sdk/openai 3.0.25 |

---

## 2. Estrutura de Pastas

```
zcrm-v1/
├── app/                    # Next.js App Router (101 arquivos)
│   ├── (protected)/        # Rotas autenticadas
│   ├── api/                # API Routes
│   ├── auth/callback/      # OAuth callback
│   └── install/            # Wizard de instalação
│
├── features/               # Feature Modules (11 módulos)
│   ├── activities/         # Atividades e tarefas
│   ├── ai-hub/             # Central de IA
│   ├── boards/             # Kanban boards
│   ├── contacts/           # Gestão de contatos
│   ├── dashboard/          # Dashboard analytics
│   ├── deals/              # Oportunidades
│   ├── decisions/          # Decisões de vendas
│   ├── inbox/              # Inbox inteligente
│   ├── profile/            # Perfil do usuário
│   ├── reports/            # Relatórios
│   └── settings/           # Configurações
│
├── components/             # Componentes Compartilhados (43 arquivos)
│   ├── ui/                 # Primitivos (19 componentes)
│   ├── ai/                 # Componentes de IA
│   └── ...
│
├── lib/                    # Bibliotecas (105 arquivos)
│   ├── supabase/           # Cliente Supabase
│   ├── ai/                 # Lógica de IA
│   ├── query/              # React Query hooks
│   └── ...
│
├── context/                # React Contexts (12 arquivos)
├── hooks/                  # Custom Hooks (8 arquivos)
├── types/                  # TypeScript types (4 arquivos)
└── supabase/               # Configuração Supabase (2 migrations)
```

---

## 3. Métricas do Codebase

| Métrica | Valor |
|---------|-------|
| Arquivos TypeScript/TSX | ~10.252 |
| Features modules | 11 |
| Componentes UI | 43 |
| Contexts | 12 |
| Custom Hooks | 8 |
| Migrations | 2 |

---

## 4. Débitos Técnicos Identificados (Nível Sistema)

### 4.1 🔴 CRÍTICO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| SYS-001 | **TypeScript strict: false** | Bugs silenciosos, type safety comprometido | 8-16h |
| SYS-002 | **Dependências em versões muy recentes** | Potenciais incompatibilidades | 2-4h |

### 4.2 🟠 ALTO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| SYS-003 | **Estrutura mista app/ e features/** | Confusão sobre onde colocar código | 4-8h |
| SYS-004 | **Baixa cobertura de testes** | 16 arquivos de teste para ~10K arquivos | 40-80h |
| SYS-005 | **Context overload** | 12 contexts pode causar re-renders | 8-16h |

### 4.3 🟡 MÉDIO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| SYS-006 | **Documentação fragmentada** | Apenas 3 docs técnicos | 8-16h |
| SYS-007 | **Falta de barrel exports** | Imports inconsistentes | 4-8h |
| SYS-008 | **Design system não documentado** | Inconsistência visual potencial | 16-24h |

### 4.4 🟢 BAIXO

| ID | Débito | Impacto | Esforço Est. |
|----|--------|---------|--------------|
| SYS-009 | **Arquivos .DS_Store** | Sujeira no git | 0.5h |
| SYS-010 | **Múltiplas configs de agentes** | 5 dirs de configuração | 2-4h |

---

## 5. Configurações

### 5.1 TypeScript (tsconfig.json)
- `strict: false` ⚠️ DÉBITO
- `strictNullChecks: true` ✅
- Path alias: `@/*`

### 5.2 Scripts NPM
- `precheck`: lint + typecheck + test + build ✅
- Quality gates configurados

---

## 6. Integrações Externas

| Serviço | Status |
|---------|--------|
| **Supabase** | ✅ Configurado |
| **Vercel** | ✅ Configurado |
| **AI Providers** | ✅ Multi-provider |
| **Webhooks** | ✅ Documentado |

---

**Status:** FASE 1 COMPLETA ✅
