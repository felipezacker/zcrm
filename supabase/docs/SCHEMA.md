# Database Schema - ZCRM

**Project:** crmia-next
**Database:** Supabase PostgreSQL (dfpfybtcnxcjjzpazaap)
**Generated:** 2026-02-07
**Type:** Single-Tenant Consolidated Schema

---

## 1. Schema Overview

### Table Count: 29 Tables
- **Core CRM:** 10 tables (organizations, profiles, contacts, deals, etc.)
- **Cockpit Features:** 4 tables (deal_notes, deal_files, quick_scripts, board stages)
- **AI Systems:** 4 tables (conversations, decisions, audio_notes, interactions)
- **Integration:** 8 tables (webhooks, API keys, audit logs)
- **System:** 3 tables (lifecycle_stages, tags, notifications)

### Total Rows (Estimated)
- **Production ready:** Single-tenant, no data isolation issues
- **Development:** Empty or minimal seed data

---

## 2. Core Tables

### 2.1 ORGANIZATIONS
```sql
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Single tenant container (one org per installation)
**RLS:** Enabled (authenticated access)
**Indexes:** Primary key only
**Soft Delete:** Yes (deleted_at)
**Relationships:**
- Referenced by: profiles, boards, deals, contacts, products, etc.

---

### 2.2 ORGANIZATION_SETTINGS
```sql
CREATE TABLE public.organization_settings (
    organization_id uuid PRIMARY KEY REFERENCES organizations(id),
    ai_provider text DEFAULT 'google',
    ai_model text DEFAULT 'gemini-2.5-flash',
    ai_google_key text,
    ai_openai_key text,
    ai_anthropic_key text,
    ai_enabled boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
```

**Purpose:** Global AI config per organization
**RLS:** Enabled (admin-only)
**Key Features:**
- Multi-provider support (Google, OpenAI, Anthropic)
- Organization-wide AI enable/disable toggle

---

### 2.3 PROFILES
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    nickname TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** User profiles (extends auth.users)
**RLS:** Enabled (user isolation)
**Roles:** admin, user (extensible)
**Relationships:** Referenced by activities, deals, etc.

---

### 2.4 CONTACTS
```sql
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT,
    company_name TEXT,
    client_company_id UUID REFERENCES crm_companies(id),
    avatar TEXT,
    notes TEXT,
    status TEXT DEFAULT 'ACTIVE',
    stage TEXT DEFAULT 'LEAD',
    source TEXT,
    birth_date DATE,
    last_interaction TIMESTAMPTZ,
    last_purchase_date DATE,
    total_value NUMERIC DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID REFERENCES profiles(id),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** CRM contacts/leads
**RLS:** Enabled (authenticated access)
**Indexes:**
- `idx_contacts_stage` - Filter by lifecycle stage
- `idx_contacts_status` - Filter by status (ACTIVE, etc.)
- `idx_contacts_created_at` - Pagination by date

**Soft Delete:** Yes
**Fields:** Lifecycle tracking (stage, source, purchase history)

---

### 2.5 CRM_COMPANIES
```sql
CREATE TABLE public.crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID REFERENCES profiles(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Companies (clients)
**RLS:** Enabled
**Soft Delete:** Yes
**Indexes:** `idx_crm_companies_created_at` - Pagination

---

### 2.6 DEALS
```sql
CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    value NUMERIC DEFAULT 0,
    probability INTEGER DEFAULT 0,
    status TEXT,
    priority TEXT DEFAULT 'medium',
    board_id UUID NOT NULL REFERENCES boards(id),
    stage_id UUID NOT NULL REFERENCES board_stages(id),
    contact_id UUID REFERENCES contacts(id),
    client_company_id UUID REFERENCES crm_companies(id),
    ai_summary TEXT,
    loss_reason TEXT,
    tags TEXT[] DEFAULT '{}',
    last_stage_change_date TIMESTAMPTZ,
    custom_fields JSONB DEFAULT '{}',
    is_won BOOLEAN NOT NULL DEFAULT FALSE,
    is_lost BOOLEAN NOT NULL DEFAULT FALSE,
    closed_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID REFERENCES profiles(id),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Sales opportunities/deals
**RLS:** Enabled
**Indexes:**
- `idx_deals_board_id` - Filter by pipeline (⭐ CRITICAL)
- `idx_deals_stage_id` - Filter by kanban column
- `idx_deals_contact_id` - Join with contacts
- `idx_deals_client_company_id` - Join with companies
- `idx_deals_board_stage_created` - Composite: board + stage + date
- `idx_deals_open` - Open deals (not won/lost)

**Soft Delete:** Yes
**Triggers:**
- `check_deal_duplicate_trigger` - Prevent duplicate contact+stage combos
- `trg_notify_deal_stage_changed` - Webhook notifications

---

### 2.7 BOARDS (Kanban Pipelines)
```sql
CREATE TABLE public.boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'SALES',
    is_default BOOLEAN DEFAULT false,
    template TEXT,
    linked_lifecycle_stage TEXT,
    next_board_id UUID REFERENCES boards(id),
    goal_description TEXT,
    goal_kpi TEXT,
    goal_target_value TEXT,
    goal_type TEXT,
    agent_name TEXT,
    agent_role TEXT,
    agent_behavior TEXT,
    entry_trigger TEXT,
    automation_suggestions TEXT[],
    position INTEGER DEFAULT 0,
    default_product_id UUID REFERENCES products(id),
    won_stage_id UUID REFERENCES board_stages(id),
    lost_stage_id UUID REFERENCES board_stages(id),
    won_stay_in_stage BOOLEAN DEFAULT FALSE,
    lost_stay_in_stage BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID REFERENCES profiles(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Sales pipelines (Kanban boards)
**RLS:** Enabled
**Unique Index:** `idx_boards_org_key_unique` - Slug per organization
**Features:** AI agents, automations, goal tracking, win/loss archiving

---

### 2.8 BOARD_STAGES (Kanban Columns)
```sql
CREATE TABLE public.board_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    label TEXT,
    color TEXT,
    "order" INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT false,
    linked_lifecycle_stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Columns within Kanban boards
**RLS:** Enabled
**Indexes:** `idx_board_stages_board_id` - Lookup by board

---

### 2.9 ACTIVITIES
```sql
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    completed BOOLEAN DEFAULT false,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    client_company_id UUID REFERENCES crm_companies(id),
    participant_contact_ids UUID[],
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID REFERENCES profiles(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Activity log (tasks, calls, meetings)
**RLS:** Enabled
**Indexes:**
- `idx_activities_date` - Timeline ordering
- `idx_activities_deal_id` - Filter by deal
- `idx_activities_contact_id` - Filter by contact
- `idx_activities_client_company_id` - Filter by company
- `idx_activities_participant_contact_ids` - GIN array search

---

### 2.10 PRODUCTS
```sql
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    sku TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    owner_id UUID REFERENCES profiles(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Product/service catalog
**RLS:** Enabled

---

### 2.11 DEAL_ITEMS
```sql
CREATE TABLE public.deal_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Line items within deals
**RLS:** Enabled
**Indexes:** `idx_deal_items_deal_id` - Embedded select

---

## 3. Cockpit Features Tables

### 3.1 DEAL_NOTES
```sql
CREATE TABLE public.deal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);
```

**Purpose:** Notes attached to deals
**RLS:** Enabled (all authenticated users)
**Indexes:** `idx_deal_notes_deal`, `idx_deal_notes_created`

---

### 3.2 DEAL_FILES
```sql
CREATE TABLE public.deal_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);
```

**Purpose:** Files attached to deals
**Storage:** `deal-files` bucket (10MB limit per file)
**RLS:** Enabled

---

### 3.3 QUICK_SCRIPTS
```sql
CREATE TABLE public.quick_scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('followup', 'objection', 'closing', 'intro', 'rescue', 'other')),
    template TEXT NOT NULL,
    icon TEXT DEFAULT 'MessageSquare',
    is_system BOOLEAN DEFAULT false,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Sales call script templates
**RLS:** Enabled (system + user's own)
**Seed Data:** 9 system scripts included
**Categories:** followup, objection, closing, intro, rescue, other

---

## 4. AI Systems Tables

### 4.1 AI_CONVERSATIONS
```sql
CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    conversation_key TEXT NOT NULL,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, conversation_key)
);
```

**Purpose:** AI chat history
**RLS:** Enabled (user isolation)

---

### 4.2 AI_DECISIONS
```sql
CREATE TABLE public.ai_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    decision_type TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT,
    suggested_action JSONB,
    status TEXT DEFAULT 'pending',
    snoozed_until TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    ai_reasoning TEXT,
    confidence_score NUMERIC(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** AI-suggested actions queue
**RLS:** Enabled

---

### 4.3 AI_AUDIO_NOTES
```sql
CREATE TABLE public.ai_audio_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    audio_url TEXT,
    duration_seconds INTEGER,
    transcription TEXT NOT NULL,
    sentiment TEXT,
    next_action JSONB,
    activity_created_id UUID REFERENCES activities(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Voice memo transcriptions
**RLS:** Enabled
**Storage:** `audio-notes` bucket

---

### 4.4 AI_SUGGESTION_INTERACTIONS
```sql
CREATE TABLE public.ai_suggestion_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('UPSELL', 'STALLED', 'BIRTHDAY', 'RESCUE')),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('deal', 'contact')),
    entity_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('ACCEPTED', 'DISMISSED', 'SNOOZED')),
    snoozed_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, suggestion_type, entity_id)
);
```

**Purpose:** Track user interactions with AI suggestions
**RLS:** Enabled
**Indexes:** `idx_ai_suggestion_user`, `idx_ai_suggestion_entity`

---

## 5. Configuration Tables

### 5.1 USER_SETTINGS
```sql
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    ai_provider TEXT DEFAULT 'google',
    ai_api_key TEXT,
    ai_model TEXT DEFAULT 'gemini-2.5-flash',
    ai_google_key TEXT,
    ai_openai_key TEXT,
    ai_anthropic_key TEXT,
    ai_thinking BOOLEAN DEFAULT true,
    ai_search BOOLEAN DEFAULT true,
    ai_anthropic_caching BOOLEAN DEFAULT false,
    dark_mode BOOLEAN DEFAULT true,
    default_route TEXT DEFAULT '/boards',
    active_board_id UUID REFERENCES boards(id),
    inbox_view_mode TEXT DEFAULT 'list',
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Per-user preferences & API keys
**RLS:** Enabled (user isolation)

---

### 5.2 AI_PROMPT_TEMPLATES
```sql
CREATE TABLE public.ai_prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Organization-wide prompt overrides
**RLS:** Enabled (admin-only)
**Unique Indexes:**
- `ai_prompt_templates_org_key_version_unique`
- `ai_prompt_templates_org_key_active_unique` (only 1 active per key)

---

### 5.3 AI_FEATURE_FLAGS
```sql
CREATE TABLE public.ai_feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Enable/disable AI features per organization
**RLS:** Enabled (admin-only)
**Unique Index:** `ai_feature_flags_org_key_unique`

---

## 6. Integration Tables

### 6.1 API_KEYS
```sql
CREATE TABLE public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    revoked_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Public API authentication
**RLS:** Enabled (admin-only)
**Security:** Tokens hashed (never stored in plain text)
**Format:** `ncrm_<random>` prefix

---

### 6.2 WEBHOOK_EVENTS_IN / OUT
```sql
CREATE TABLE public.webhook_events_in (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES integration_inbound_sources(id),
    provider TEXT NOT NULL DEFAULT 'generic',
    external_event_id TEXT,
    payload JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'received',
    error TEXT,
    created_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    created_deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.webhook_events_out (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    from_stage_id UUID REFERENCES board_stages(id) ON DELETE SET NULL,
    to_stage_id UUID REFERENCES board_stages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Purpose:** Webhook audit trail
**RLS:** Enabled (admin-only)
**Deduplication:** `webhook_events_in_dedupe` on source_id + external_event_id

---

### 6.3 WEBHOOK_DELIVERIES
```sql
CREATE TABLE public.webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    endpoint_id UUID NOT NULL REFERENCES integration_outbound_endpoints(id),
    event_id UUID NOT NULL REFERENCES webhook_events_out(id),
    request_id BIGINT,
    status TEXT NOT NULL DEFAULT 'queued',
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    response_status INT,
    error TEXT
);
```

**Purpose:** Track webhook delivery attempts
**RLS:** Enabled (admin-only)

---

## 7. System Tables

### 7.1 LIFECYCLE_STAGES
```sql
CREATE TABLE public.lifecycle_stages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Global CRM lifecycle stages
**Seed Data:** LEAD, MQL, PROSPECT, CUSTOMER, OTHER
**RLS:** Enabled

---

### 7.2 TAGS
```sql
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color TEXT DEFAULT 'bg-gray-500',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(name, organization_id)
);
```

**Purpose:** Free-form tagging system
**RLS:** Enabled

---

### 7.3 LEADS
```sql
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    company_name TEXT,
    role TEXT,
    source TEXT,
    status TEXT DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    converted_to_contact_id UUID REFERENCES contacts(id),
    owner_id UUID REFERENCES profiles(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE
);
```

**Purpose:** Lead import & conversion staging
**RLS:** Enabled

---

### 7.4 CUSTOM_FIELD_DEFINITIONS
```sql
CREATE TABLE public.custom_field_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    options TEXT[],
    entity_type TEXT NOT NULL DEFAULT 'deal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(key, organization_id)
);
```

**Purpose:** Define custom fields per entity type
**RLS:** Enabled

---

### 7.5 SYSTEM_NOTIFICATIONS
```sql
CREATE TABLE public.system_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('high', 'medium', 'low')),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** In-app notifications
**RLS:** Enabled

---

### 7.6 AUDIT_LOGS
```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity TEXT NOT NULL DEFAULT 'info',
    CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical'))
);
```

**Purpose:** Security & compliance audit trail
**RLS:** Enabled

---

### 7.7 USER_CONSENTS (LGPD Compliance)
```sql
CREATE TABLE public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    version TEXT NOT NULL,
    consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    revoked_at TIMESTAMPTZ,
    CHECK (consent_type IN ('terms', 'privacy', 'marketing', 'analytics', 'data_processing', 'AI_CONSENT'))
);
```

**Purpose:** LGPD consent tracking
**RLS:** Enabled

---

### 7.8 SECURITY_ALERTS
```sql
CREATE TABLE security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'warning',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    details JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Security incident tracking
**RLS:** Enabled

---

### 7.9 RATE_LIMITS
```sql
CREATE TABLE public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Purpose:** Rate limiting for Edge Functions
**Indexes:** `idx_rate_limits_lookup` on (identifier, endpoint, created_at)

---

## 8. Storage Buckets

| Bucket | Public | Max Size | Purpose |
|--------|--------|----------|---------|
| `avatars` | Yes | Unlimited | User profile pictures |
| `audio-notes` | No | Unlimited | Voice memo recordings |
| `deal-files` | No | 10 MB/file | Deal attachments |

---

## 9. Extensions

| Extension | Purpose |
|-----------|---------|
| `uuid-ossp` | UUID generation |
| `pgcrypto` | Encryption (digest, etc.) |
| `unaccent` | Accent-insensitive slug generation |
| `pg_net` | HTTP async (webhook delivery) |

---

## 10. Triggers & Functions

### 10.1 Lifecycle Triggers

| Trigger | Table | Event | Function | Purpose |
|---------|-------|-------|----------|---------|
| `on_auth_user_created` | auth.users | INSERT | `handle_new_user()` | Create profile + settings |
| `on_org_created` | organizations | INSERT | `handle_new_organization()` | Create org settings |
| `on_auth_user_email_updated` | auth.users | UPDATE email | `handle_user_email_update()` | Sync email to profiles |

### 10.2 Data Integrity Triggers

| Trigger | Table | Event | Function | Purpose |
|---------|-------|-------|----------|---------|
| `cascade_board_delete` | boards | UPDATE deleted_at | `cascade_soft_delete_deals()` | Soft delete deals when board deleted |
| `cascade_contact_delete` | contacts | UPDATE deleted_at | `cascade_soft_delete_activities_by_contact()` | Soft delete activities when contact deleted |
| `check_deal_duplicate_trigger` | deals | INSERT/UPDATE | `check_deal_duplicate()` | Prevent duplicate open deals per contact+stage |
| `update_deal_notes_updated_at` | deal_notes | UPDATE | `update_updated_at_column()` | Auto-update timestamp |
| `update_quick_scripts_updated_at` | quick_scripts | UPDATE | `update_updated_at_column()` | Auto-update timestamp |

### 10.3 Integration Triggers

| Trigger | Table | Event | Function | Purpose |
|---------|-------|-------|----------|---------|
| `trg_notify_deal_stage_changed` | deals | UPDATE stage_id | `notify_deal_stage_changed()` | Send webhooks on stage change |

---

## 11. Row Level Security (RLS) Policies

### Overall RLS Status
- ✅ Enabled on all 29 tables
- ✅ Comprehensive policies in place
- ⚠️ Some tables allow "all authenticated users" access (single-tenant assumption)

### Policy Summary

| Table | Policy | Scope |
|-------|--------|-------|
| organizations | authenticated_access | All authenticated users |
| profiles | profiles_select / profiles_update | Select all, update own |
| user_settings | user_settings_isolate | User isolation |
| boards, deals, contacts, etc. | Enable all access for authenticated users | Single-tenant (all users same org) |
| api_keys, org_settings | Admins only | Role-based (admin = admin) |
| quick_scripts | System + user-owned | User can see system scripts + own |

### Security Notes
- ⚠️ **Assumption:** Single-tenant deployment
- ⚠️ **Issue:** Most tables lack organization-level RLS (missing `organization_id` checks)
- ⚠️ **Risk:** If multi-tenant expansion is planned, RLS policies need hardening

---

## 12. Indexes Summary

### Indexes by Table

**DEALS** (6 indexes):
- `idx_deals_board_id` - Pipeline filter ⭐
- `idx_deals_stage_id` - Kanban column filter
- `idx_deals_contact_id` - Join with contacts
- `idx_deals_client_company_id` - Join with companies
- `idx_deals_board_stage_created` - Composite: board+stage+date
- `idx_deals_open` - Open deals (partial: WHERE is_won=false AND is_lost=false)

**CONTACTS** (3 indexes):
- `idx_contacts_stage` - Lifecycle stage filter
- `idx_contacts_status` - Status filter
- `idx_contacts_created_at` - Pagination

**ACTIVITIES** (3 indexes):
- `idx_activities_date` - Timeline ordering DESC
- `idx_activities_deal_id` - Filter by deal
- `idx_activities_contact_id` - Filter by contact

**BOARDS** (1 index):
- `idx_boards_org_key_unique` - Slug uniqueness per org

**BOARD_STAGES** (1 index):
- `idx_board_stages_board_id` - Lookup by board

**AI_SUGGESTION_INTERACTIONS** (2 indexes):
- `idx_ai_suggestion_user` - Filter by user
- `idx_ai_suggestion_entity` - Filter by entity

**API_KEYS** (2 indexes):
- `idx_api_keys_org` - All keys per org
- `idx_api_keys_org_active` - Active keys only

**RATE_LIMITS** (1 index):
- `idx_rate_limits_lookup` - (identifier, endpoint, created_at)

**Total:** 22 indexes (including primary keys)

---

## 13. Key Relationships

```
organizations
  ├── profiles (users)
  │   ├── activities (created_by)
  │   └── user_settings
  ├── boards
  │   ├── board_stages
  │   │   └── deals
  │   │       ├── deal_items
  │   │       ├── deal_notes
  │   │       ├── deal_files
  │   │       └── activities
  │   └── contacts
  │       ├── activities
  │       └── ai_audio_notes
  ├── contacts
  │   ├── crm_companies
  │   └── leads (conversion)
  ├── products (deal_items reference)
  ├── tags
  ├── lifecycle_stages (global)
  ├── custom_field_definitions
  ├── ai_conversations
  ├── ai_decisions
  ├── ai_prompt_templates
  ├── ai_feature_flags
  ├── api_keys
  ├── organization_settings
  ├── organization_invites
  └── webhook tables (events, deliveries)
```

---

## 14. Data Constraints

| Constraint | Table | Details |
|-----------|-------|---------|
| UNIQUE | tags | name + organization_id |
| UNIQUE | custom_field_definitions | key + organization_id |
| UNIQUE | user_settings | user_id |
| UNIQUE | ai_conversations | user_id + conversation_key |
| UNIQUE | api_keys (active) | key_hash + revoked_at IS NULL |
| UNIQUE | boards (key) | organization_id + key + deleted_at IS NULL |
| CHECK | ai_suggestion_interactions | suggestion_type IN ('UPSELL', ...) |
| CHECK | quick_scripts | category IN ('followup', ...) |
| CHECK | user_consents | consent_type IN ('terms', ...) |
| CHECK | system_notifications | severity IN ('high', 'medium', 'low') |

---

## 15. Database Statistics

| Metric | Value |
|--------|-------|
| Total Tables | 29 |
| Total Columns | ~250 |
| Total Indexes | 22 |
| Total Triggers | 10 |
| Total Functions | 15+ |
| Storage Buckets | 3 |
| Extensions | 4 |
| Primary Keys | All tables have UUID PK |
| Foreign Keys | 40+ (referential integrity) |

---

## 16. Migration History

| Migration | Date | Purpose |
|-----------|------|---------|
| `20251201000000_schema_init.sql` | 2025-12-01 | Complete schema consolidation |
| `20260205000000_add_performance_indexes.sql` | 2026-02-05 | Add missing indexes for deals, contacts, activities |

---

## 17. Realtime Configuration

**Enabled for:** deals, activities, contacts, crm_companies, board_stages, boards
**Supabase Realtime:** Subscriptions available on these tables via `supabase_realtime` publication

---

## 18. Known Issues & Debt

### Critical Issues
- ⚠️ **RLS Not Enforcing Organization Isolation:** Most tables allow all authenticated users to access all rows. Multi-tenant migration would require major RLS overhaul.
- ⚠️ **API Key Security:** Keys transmitted once during creation; no recovery mechanism.

### Data Quality Issues
- 📋 Missing NOT NULL on important fields (e.g., `contacts.status` should be NOT NULL)
- 📋 `custom_fields JSONB` on deals lacks schema validation
- 📋 No constraints on `tags TEXT[]` in deals
- 📋 `probability INTEGER` on deals has no CHECK constraint (0-100)

### Index Issues
- ✅ Good coverage for common queries
- 📋 No partial index on soft-deleted records (deleted_at IS NULL) except for open deals
- 📋 Could benefit from expression indexes on `ai_provider` lookups

### Query Performance
- ✅ Core queries optimized (board filter, kanban view, contact timeline)
- 📋 Activity timeline queries could use materialized views for large datasets
- 📋 Webhook event audit tables not partitioned (could grow large)

### Compliance
- ✅ LGPD consent tracking (user_consents table)
- ✅ Audit logging (audit_logs table)
- 📋 Data retention policies not documented
- 📋 No automated cleanup of old rate_limits or audit logs

---

## 19. Recommendations

### Immediate (Security)
1. **Harden RLS:** Add organization_id checks to all sensitive tables
2. **Validate Inputs:** Add CHECK constraints on enums and numeric ranges
3. **Secure Storage:** Encrypt API keys and sensitive fields (ai_google_key, etc.)

### Short-term (Quality)
1. **Add NOT NULL:** Mark required fields explicitly
2. **Create Indexes:** Add partial indexes for soft-deletes
3. **Document Schema:** Add COMMENT ON statements

### Medium-term (Scaling)
1. **Partition Audit Tables:** webhook_events_in/out by date
2. **Materialized Views:** Cache dashboard statistics
3. **Archival Strategy:** Move old completed deals to archive table

---

**Document Status:** ✅ Complete
**Last Updated:** 2026-02-07
**Next Review:** Post-RLS security audit
