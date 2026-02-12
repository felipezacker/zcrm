# Database Schema Documentation

**Source**: `supabase/migrations/20251201000000_schema_init.sql` (and subsequent migrations)
**Date**: 2026-02-11

## Overview

The database uses a multi-tenant-like structure where most entities belong to an `organization_id`. It leverages Supabase Auth and RLS for security.

### Extensions
- `uuid-ossp`: UUID generation.
- `pgcrypto`: Cryptographic functions.
- `unaccent`: Text search normalization.
- `pg_net`: Async HTTP requests (Webhooks).

## Core Tables

### Organization & Users
- **organizations**: Root entity.
- **organization_settings**: Global AI and feature settings per org.
- **profiles**: User profiles extending `auth.users`. Linked to `organizations`.
- **organization_invites**: Pending invites for new users.
- **user_settings**: Per-user preferences (AI, UI theme, etc.).

### CRM Core
- **contacts**: People/Leads.
- **crm_companies**: Companies associated with contacts/deals.
- **leads**: Raw import staging for contacts.
- **products**: Catalog of items/services.

### Pipeline & Deals
- **boards**: Kanban boards (Sales, etc.).
- **board_stages**: Columns in the boards.
- **deals**: Opportunities/Deals.
- **deal_items**: Products attached to a deal.
- **activities**: Tasks, meetings, calls linked to deals/contacts.
- **lifecycle_stages**: Global funnel stages (Lead -> Customer).

### Configuration & Meta
- **tags**: Tagging system.
- **custom_field_definitions**: Extensibility for entities (default: deal).

## AI Features
- **ai_conversations**: Chat history with AI assistant.
- **ai_decisions**: AI-driven suggestions/decisions queue.
- **ai_audio_notes**: Transcriptions and sentiment analysis of audio.
- **ai_suggestion_interactions**: Tracking user acceptance of AI suggestions.
- **ai_prompt_templates**: Customizable prompts per organization.
- **ai_feature_flags**: AI feature toggles per organization.

## Security & Compliance
- **rate_limits**: Rate limiting for Edge Functions.
- **user_consents**: LGPD/GDPR consent tracking.
- **audit_logs**: Security monitoring log.
- **security_alerts**: internal alerts system.

## Row Level Security (RLS)
- Enabled on ALL major tables.
- Pattern: Checks `organization_id` matches user's organization.

## Functions & Triggers
- `is_instance_initialized()`: Check system state.
- `get_singleton_organization_id()`: For single-tenant logic.
- `get_dashboard_stats()`: JSON summary for dashboard.
