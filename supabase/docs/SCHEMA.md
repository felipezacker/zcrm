# Database Schema - NossoCRM

**Documento:** FASE 2 - Brownfield Discovery  
**Gerado por:** @data-engineer (Dara)  
**Data:** 2026-02-09  
**Versão:** 1.0

---

## 1. Resumo do Schema

| Métrica | Valor |
|---------|-------|
| Total de Tabelas | 30+ |
| Migrations | 2 |
| Schema Size | ~80KB |
| RLS Habilitado | ✅ Todas |
| Extensions | 4 (uuid-ossp, pgcrypto, unaccent, pg_net) |

---

## 2. Tabelas Principais (Core CRM)

### 2.1 Entidades de Negócio

| Tabela | Propósito | RLS |
|--------|-----------|-----|
| `organizations` | Organizações/Tenants | ✅ |
| `organization_settings` | Config global (IA, etc.) | ✅ |
| `profiles` | Usuários (extends auth.users) | ✅ |
| `contacts` | Contatos do CRM | ✅ |
| `crm_companies` | Empresas dos clientes | ✅ |
| `deals` | Oportunidades/Negócios | ✅ |
| `deal_items` | Produtos vinculados a deals | ✅ |
| `products` | Catálogo de produtos | ✅ |
| `boards` | Quadros Kanban | ✅ |
| `board_stages` | Colunas dos quadros | ✅ |
| `activities` | Tarefas/Reuniões/Chamadas | ✅ |
| `leads` | Leads para importação | ✅ |

### 2.2 Sistema de IA

| Tabela | Propósito | RLS |
|--------|-----------|-----|
| `ai_conversations` | Histórico de chat com IA | ✅ |
| `ai_decisions` | Fila de decisões da IA | ✅ |
| `ai_audio_notes` | Notas de áudio transcritas | ✅ |
| `ai_suggestion_interactions` | Tracking de sugestões | ✅ |
| `ai_prompt_templates` | Templates de prompts | ✅ |
| `ai_feature_flags` | Feature flags de IA | ✅ |

### 2.3 Cockpit Features

| Tabela | Propósito | RLS |
|--------|-----------|-----|
| `deal_notes` | Notas por deal | ✅ |
| `deal_files` | Arquivos por deal | ✅ |
| `quick_scripts` | Templates de scripts de vendas | ✅ |

### 2.4 Sistema de Segurança

| Tabela | Propósito | RLS |
|--------|-----------|-----|
| `rate_limits` | Rate limiting | ✅ |
| `user_consents` | LGPD Compliance | ✅ |
| `audit_logs` | Logs de auditoria | ✅ |
| `security_alerts` | Alertas de segurança | ✅ |

### 2.5 Outros

| Tabela | Propósito | RLS |
|--------|-----------|-----|
| `lifecycle_stages` | Estágios do funil (global) | ✅ |
| `tags` | Sistema de tags | ✅ |
| `custom_field_definitions` | Campos personalizados | ✅ |
| `user_settings` | Configurações do usuário | ✅ |
| `organization_invites` | Convites para usuários | ✅ |
| `system_notifications` | Notificações do sistema | ✅ |

---

## 3. Relacionamentos Principais

```
organizations (1) ─────┬───── (*) profiles
                       ├───── (*) contacts
                       ├───── (*) crm_companies
                       ├───── (*) boards ──────── (*) board_stages
                       ├───── (*) deals ──────────┬── (*) deal_items
                       │                          ├── (*) deal_notes
                       │                          ├── (*) deal_files
                       │                          └── (*) activities
                       └───── (*) products

contacts ─────── deals (N:1)
contacts ─────── activities (1:N)
boards ─────── deals (1:N)
board_stages ─────── deals (1:N)
```

---

## 4. Storage Buckets

| Bucket | Público | Limite |
|--------|---------|--------|
| `avatars` | ✅ Sim | - |
| `audio-notes` | ❌ Não | - |
| `deal-files` | ❌ Não | 10MB |

---

## 5. Functions PostgreSQL

| Function | Propósito |
|----------|-----------|
| `is_instance_initialized()` | Verifica se há organização |
| `get_singleton_organization_id()` | Retorna org única |
| `get_dashboard_stats()` | Estatísticas do dashboard |
| `mark_deal_won(deal_id)` | Marca deal como ganho |
| `mark_deal_lost(deal_id, reason)` | Marca deal como perdido |
| `reopen_deal(deal_id)` | Reabre deal fechado |
| `get_contact_stage_counts()` | Contagem por estágio |
| `log_audit_event(...)` | Cria log de auditoria |
| `cleanup_rate_limits(mins)` | Limpa rate limits antigos |

---

## 6. Triggers

| Trigger | Tabela | Ação |
|---------|--------|------|
| `on_auth_user_created` | auth.users | Cria profile + user_settings |
| `on_org_created` | organizations | Cria organization_settings |
| `cascade_board_delete` | boards | Soft delete deals do board |
| `cascade_contact_delete` | contacts | Soft delete activities |
| `check_deal_duplicate_trigger` | deals | Previne deal duplicado |

---

## 7. Índices Performance

**Migration adicional:** `20260205000000_add_performance_indexes.sql`

---

**Status:** FASE 2 - SCHEMA DOCUMENTADO ✅
