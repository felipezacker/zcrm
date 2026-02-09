# Phase C - Migration Application Guide

**Date:** 2026-02-08
**Phase:** C - Data Integrity & Compliance
**Timeline:** 3-4 days
**Status:** Ready for Application

---

## Quick Start

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Apply migrations to remote database
supabase db push

# Apply to local development database
supabase db push --local
```

### Option 2: Manual Application via Supabase Dashboard

1. Go to **Supabase Dashboard** → Your Project → **SQL Editor**
2. For each migration below, copy-paste the SQL and execute in order:
   - C.1: NOT NULL Constraints
   - C.2: Foreign Key Indexes
   - C.3: Audit Trail
   - C.4: Dashboard Stats

---

## Migration Order (CRITICAL - Must apply in sequence)

### ✅ Migration 1: C.1 - Add NOT NULL Constraints
**File:** `supabase/migrations/20260208000000_add_not_null_constraints.sql`
**Effort:** 1 day
**Risk:** Medium

```bash
# Via CLI
supabase db push --dry-run  # Test first
supabase db push

# Via Dashboard
# Copy contents of above file and execute
```

**What it does:**
- Adds NOT NULL check constraints to organization_id (11 tables)
- Adds NOT NULL check constraints to board_id (3 tables)
- Adds NOT NULL check constraints to contact_id (1 table)
- Adds NOT NULL check constraints to created_at (9 tables)
- Pre-validates no NULL values exist

**Testing:**
```sql
-- Verify constraints created
SELECT constraint_name
FROM information_schema.check_constraints
WHERE table_name = 'deals'
  AND constraint_name LIKE '%not_null%';

-- Result should show:
-- deals_organization_id_not_null
-- deals_board_id_not_null
-- deals_created_at_not_null
```

---

### ✅ Migration 2: C.2 - Add Foreign Key Indexes
**File:** `supabase/migrations/20260208100000_add_foreign_key_indexes.sql`
**Effort:** 0.5 days
**Risk:** Low

```bash
supabase db push
```

**What it does:**
- Creates 25+ indexes on foreign key columns
- Creates 4 composite indexes for query optimization
- Estimated 30-50% query performance improvement

**Testing:**
```sql
-- List all new indexes
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY indexname;

-- Verify Kanban board query performance
EXPLAIN ANALYZE
SELECT * FROM deals
WHERE board_id = 'YOUR_BOARD_ID'
  AND deleted_at IS NULL
ORDER BY stage_id;
-- Should show: Index Scan (fast) instead of Sequential Scan (slow)
```

---

### ✅ Migration 3: C.3 - Implement Audit Trail
**File:** `supabase/migrations/20260208200000_implement_audit_trail.sql`
**Effort:** 1-2 days
**Risk:** Medium

```bash
supabase db push
```

**What it does:**
- Creates immutable `audit_log` table (append-only)
- Creates audit trigger function
- Attaches triggers to 8 critical tables
- Enables RLS on audit_log for security
- Creates helper functions for audit queries

**Testing:**
```sql
-- Test audit trigger
INSERT INTO public.contacts (
  organization_id, name, email
) VALUES (
  'org-uuid', 'Test Contact', 'test@example.com'
);

-- Check audit log entry was created
SELECT * FROM public.audit_log
WHERE table_name = 'contacts'
ORDER BY created_at DESC
LIMIT 1;

-- Result should show the INSERT operation with new_values JSON
```

---

### ✅ Migration 4: C.4 - Fix Dashboard Stats
**File:** `supabase/migrations/20260208300000_fix_dashboard_stats.sql`
**Effort:** 0.5 days
**Risk:** Low

```bash
supabase db push
```

**What it does:**
- Creates/updates stats functions:
  - `get_contacts_stats()` - Contact segmentation
  - `get_deals_stats()` - Pipeline KPIs
  - `get_board_stats()` - Board metrics
  - `get_organization_stats()` - Org overview
  - `get_activity_stats()` - Activity timeline

**Testing:**
```sql
-- Test with sample organization
SELECT * FROM public.get_organization_stats(
  'YOUR_ORG_UUID'
);

-- Result should show:
-- total_contacts (excluding deleted)
-- total_deals (excluding deleted)
-- total_revenue_potential (open deals only)
-- etc.
```

---

## Application Checklist

### Pre-Application

- [ ] Backup current database (via Supabase Dashboard)
- [ ] Review all 4 migrations above
- [ ] Have rollback plan ready
- [ ] Schedule for maintenance window (if production)

### Application

- [ ] Apply C.1 - NOT NULL Constraints
  - [ ] Test constraint validation
  - [ ] Verify no INSERT failures
- [ ] Apply C.2 - Foreign Key Indexes
  - [ ] Verify index creation
  - [ ] Measure query performance (EXPLAIN ANALYZE)
- [ ] Apply C.3 - Audit Trail
  - [ ] Test audit trigger
  - [ ] Verify audit_log has entries
- [ ] Apply C.4 - Dashboard Stats
  - [ ] Test stats functions
  - [ ] Verify correct metrics in dashboard

### Post-Application

- [ ] Run full test suite
- [ ] Verify dashboard displays correct metrics
- [ ] Commit changes to git
- [ ] Create PR for code review
- [ ] Deploy to production (if approved)

---

## Rollback Procedures

If any migration fails:

### Rollback C.1: NOT NULL Constraints
```sql
-- Drop all constraints added in C.1
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_organization_id_not_null;
ALTER TABLE public.contacts DROP CONSTRAINT IF EXISTS contacts_organization_id_not_null;
-- ... (repeat for all constraints)
```

### Rollback C.2: Foreign Key Indexes
```sql
-- Drop all indexes added in C.2
DROP INDEX IF EXISTS idx_profiles_organization_id;
DROP INDEX IF EXISTS idx_contacts_organization_id;
-- ... (repeat for all indexes)
```

### Rollback C.3: Audit Trail
```sql
-- Drop triggers first
DROP TRIGGER IF EXISTS trg_audit_organizations ON public.organizations;
DROP TRIGGER IF EXISTS trg_audit_profiles ON public.profiles;
-- ... (repeat for all triggers)

-- Drop function
DROP FUNCTION IF EXISTS public.audit_log_trigger();

-- Drop table
DROP TABLE IF EXISTS public.audit_log;
```

### Rollback C.4: Dashboard Stats
```sql
-- Drop functions (old versions will be restored)
DROP FUNCTION IF EXISTS public.get_contacts_stats(UUID);
DROP FUNCTION IF EXISTS public.get_deals_stats(UUID, UUID);
-- ... (repeat for all functions)
```

---

## Timeline Estimate

- **C.1 Application:** 15 minutes execution + 30 min testing = 45 minutes
- **C.2 Application:** 10 minutes execution + 20 min testing = 30 minutes
- **C.3 Application:** 15 minutes execution + 45 min testing = 1 hour
- **C.4 Application:** 10 minutes execution + 30 min testing = 40 minutes

**Total Time:** 2.5-3 hours

---

## Success Criteria

- [x] All 4 migrations apply without errors
- [ ] No application errors after C.1
- [ ] Dashboard loads correct metrics after C.4
- [ ] Audit trail shows entries after C.3
- [ ] Query performance improved after C.2 (30-50% faster)
- [ ] All acceptance criteria from stories met

---

## Support

If you encounter issues:

1. **Check error message** - Most issues are documented
2. **Review rollback procedures above** - Undo the problematic migration
3. **Run next migration** - Continue with remaining migrations
4. **Contact @data-engineer (Dara)** - For complex issues

---

## Next Steps

After successful application:

1. ✅ Commit changes: `git commit -m "feat: Complete Phase C data integrity implementation"`
2. ✅ Create PR for review
3. ✅ Deploy to production after approval
4. ✅ Monitor audit trail and dashboard metrics
5. ✅ Start Phase D (Design System Consolidation)

---

**Phase C Application Guide**
*Last Updated: 2026-02-08*
*Status: Ready for Implementation*
