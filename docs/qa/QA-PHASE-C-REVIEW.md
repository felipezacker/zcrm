# QA Review: Phase C - Data Integrity & Compliance
**Reviewer:** Quinn (@qa)
**Date:** 2026-02-08
**Gate Decision:** FAIL - 7 CRITICAL issues, 5 HIGH issues
**Iterations Required:** Fix all CRITICAL/HIGH before re-review

---

## Executive Summary

Phase C migrations contain **7 CRITICAL issues** that will cause SQL execution failures at runtime. Multiple migrations reference **columns and tables that do not exist** in the current schema. The migrations were generated based on SCHEMA.md documentation which diverges from the actual SQL schema definition.

**Root Cause:** Migrations were authored against the documentation (SCHEMA.md) rather than validated against the actual `schema_init.sql` DDL.

---

## CRITICAL Issues (Will FAIL at execution)

### C1. deal_items does NOT have `board_id` column
**Migration:** C.1 (line 82-84)
**Impact:** Migration FAILS - `deal_items_board_id_not_null CHECK (board_id IS NOT NULL)`
**Evidence:** `schema_init.sql` lines 320-331 - deal_items has: id, deal_id, product_id, name, quantity, price, created_at, organization_id. **No board_id.**
**Fix:** Remove this constraint entirely.

### C2. deal_items does NOT have `deleted_at` column
**Migration:** C.2 (lines 55-57, 89-91, 113-115)
**Impact:** 3 indexes FAIL - all use `WHERE deleted_at IS NULL` on deal_items
**Evidence:** `schema_init.sql` lines 320-331 - no deleted_at column.
**Fix:** Remove `WHERE deleted_at IS NULL` filter from deal_items indexes, or remove indexes entirely.

### C3. deal_items does NOT have `contact_id` column
**Migration:** C.2 (lines 113-115)
**Impact:** Index `idx_deal_items_contact_id` FAILS
**Evidence:** `schema_init.sql` lines 320-331 - no contact_id column.
**Fix:** Remove this index.

### C4. board_stages does NOT have `deleted_at` column
**Migration:** C.2 (lines 44-46, 93-96)
**Impact:** 2 indexes FAIL - `idx_board_stages_organization_id` and `idx_board_stages_board_id`
**Evidence:** `schema_init.sql` lines 215-226 - no deleted_at column.
**Fix:** Remove `WHERE deleted_at IS NULL` filter from board_stages indexes.

### C5. profiles does NOT have `deleted_at` column
**Migration:** C.2 (lines 25-27)
**Impact:** Index `idx_profiles_organization_id` FAILS
**Evidence:** `schema_init.sql` lines 73-87 - no deleted_at column.
**Fix:** Remove `WHERE deleted_at IS NULL` filter from profiles index.

### C6. deal_notes does NOT have `deleted_at` column
**Migration:** C.2 (lines 59-62)
**Impact:** Index `idx_deal_notes_organization_id` FAILS
**Evidence:** `schema_init.sql` lines 1096-1103 - no deleted_at column (organization_id was added by Phase A RLS migration but deleted_at was not).
**Fix:** Remove `WHERE deleted_at IS NULL` filter from deal_notes index.

### C7. custom_field_values table does NOT EXIST
**Migration:** C.1 (lines 69-71), C.2 (lines 74-76, 169-176)
**Impact:** C.1 constraints silently skip (ALTER TABLE IF EXISTS), C.2 indexes FAIL
**Evidence:** No `CREATE TABLE custom_field_values` found in schema_init.sql.
**Fix:** Remove all references to custom_field_values, or create the table first.

---

## HIGH Issues (Logic/correctness errors)

### H1. C.1 Inconsistent idempotency - migration will FAIL on re-run
**Migration:** C.1 (lines 30-36, 78-79, 104-134)
**Impact:** Running migration twice causes constraint-already-exists errors
**Detail:** Some tables use `DROP CONSTRAINT IF EXISTS` + `ADD CONSTRAINT` (profiles, boards, activities, deal_items, deal_notes, board_stages, custom_field_*) but others use only `ADD CONSTRAINT` without DROP:
- contacts_organization_id_not_null (line 32)
- deals_organization_id_not_null (line 36)
- deals_board_id_not_null (line 79)
- All contacts/deals/boards/board_stages created_at constraints (lines 106-118)
**Fix:** Add `DROP CONSTRAINT IF EXISTS` before every `ADD CONSTRAINT`.

### H2. C.3 Audit trigger does NOT record old_values on UPDATE
**Migration:** C.3 (lines 143-144)
**Impact:** Audit trail is incomplete - cannot determine what changed during UPDATEs
**Detail:** Current logic:
```sql
CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,  -- old_values
CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END, -- new_values
```
For UPDATE: old_values = NULL, new_values = {new}. **You lose the "before" state.**
**Fix:** Change to:
```sql
CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN row_to_json(OLD) ELSE NULL END,
CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN row_to_json(NEW) ELSE NULL END,
```

### H3. C.3 Partial indexes with NOW() are STATIC, not rolling
**Migration:** C.3 (lines 51-74)
**Impact:** Indexes will become useless over time
**Detail:** `WHERE changed_at > NOW() - INTERVAL '7 years'` is evaluated **once** at index creation time (2026-02-08). After 7 years, the index includes ALL rows. This is NOT a rolling window.
**Fix:** Remove the WHERE clause from indexes (use full indexes), or implement a partitioning strategy with pg_partman.

### H4. C.2 Duplicate indexes with Phase A RLS migration
**Migration:** C.2 vs 20260207000000_rls_organization_isolation.sql (lines 580-590)
**Impact:** Wasted storage, potential query planner confusion
**Detail:** Phase A already created these organization_id indexes:
- idx_profiles_org, idx_boards_org, idx_board_stages_org, idx_contacts_org, idx_deals_org, idx_deal_items_org, idx_activities_org, idx_tags_org, idx_custom_field_definitions_org
C.2 creates NEW indexes on the SAME columns with different names (idx_*_organization_id) and WHERE filters.
**Fix:** Either DROP the old indexes first, or don't create duplicates. For tables WITH deleted_at, the filtered index is better. For tables WITHOUT deleted_at, this is pure duplication.

### H5. custom_field_definitions does NOT have `deleted_at` column
**Migration:** C.2 (lines 69-72)
**Impact:** Index `idx_custom_field_definitions_organization_id WHERE deleted_at IS NULL` FAILS
**Evidence:** `schema_init.sql` lines 380-392 - no deleted_at column.
**Fix:** Remove `WHERE deleted_at IS NULL` filter.

---

## MEDIUM Issues (Design/logic concerns)

### M1. C.3 Audit immutability NOT enforced
**Detail:** audit_log is described as "immutable, append-only" but only has a SELECT RLS policy. No policies prevent UPDATE or DELETE. Service role bypasses RLS entirely.
**Fix:** Add explicit DENY policies for UPDATE/DELETE, or use a trigger to prevent modifications.

### M2. C.4 get_organization_stats.users_count is misleading
**Detail:** Field called "users_count" with comment "Active users" but actually counts users created in last 30 days (`created_at > NOW() - INTERVAL '30 days'`). Should count all non-deleted users or use last_sign_in_at.
**Fix:** Remove the 30-day filter or rename to `new_users_last_30_days`.

### M3. C.3 View vw_record_audit_history lacks RLS protection
**Detail:** Views don't always inherit underlying table RLS. Direct SELECT on the view may bypass audit_log RLS depending on Supabase/PostgREST configuration.
**Fix:** Add RLS policy on the view or use a SECURITY DEFINER function instead.

### M4. C.1 Validation block only checks 3 tables
**Detail:** The DO block validates NULL counts for profiles, contacts, deals only. Should also validate boards, activities, deal_notes, board_stages, custom_field_definitions.
**Fix:** Extend validation to all constrained tables.

---

## LOW Issues (Style/optimization)

### L1. C.4 SECURITY DEFINER on all stats functions
**Detail:** All 5 stats functions use SECURITY DEFINER which bypasses RLS. This is acceptable for admin-level dashboard functions but should be documented as a security design decision.

### L2. C.2 Index naming inconsistency
**Detail:** Phase A uses `idx_deals_board_id` (no filter). C.2 redefines same name with filter. PostgreSQL will skip the CREATE (IF NOT EXISTS) so the unfiltered index remains.

---

## Summary Table

| Severity | Count | Must Fix Before Deploy |
|----------|-------|----------------------|
| CRITICAL | 7 | YES - Will cause SQL failures |
| HIGH | 5 | YES - Logic/correctness errors |
| MEDIUM | 4 | Recommended |
| LOW | 2 | Optional |
| **TOTAL** | **18** | **12 must-fix** |

---

## Tables Without `deleted_at` (Reference)

The following tables do NOT have a `deleted_at` column. Any index using `WHERE deleted_at IS NULL` on these tables will FAIL:

| Table | Has deleted_at? |
|-------|----------------|
| profiles | NO |
| board_stages | NO |
| deal_items | NO |
| deal_notes | NO |
| custom_field_definitions | NO |
| custom_field_values | TABLE DOES NOT EXIST |
| products | NO |
| tags | NO |
| leads | NO |
| organizations | YES |
| contacts | YES |
| deals | YES |
| boards | YES |
| crm_companies | YES |
| activities | YES |

---

## Recommended Action

1. **Fix all 7 CRITICAL issues** - Remove references to non-existent columns/tables
2. **Fix all 5 HIGH issues** - Correct idempotency, audit logic, index duplication
3. **Re-run migrations on local database** to validate
4. **Re-submit for QA review**

---

## Gate Decision

**FAIL** - Cannot deploy. 7 CRITICAL issues will cause migration failures.

Estimated fix time: **2-3 hours** (SQL corrections only, no new features needed).

---

**Reviewer:** Quinn (@qa)
**Confidence:** A (95/100) - Issues verified against actual schema DDL
**Next Review:** After CRITICAL/HIGH fixes applied

— Quinn, guardiao da qualidade
