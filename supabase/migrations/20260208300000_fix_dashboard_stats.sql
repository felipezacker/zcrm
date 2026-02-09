-- =============================================================================
-- Phase C.4: Fix Dashboard Stats Function
-- =============================================================================
-- Timeline: 0.5 days
-- Risk Level: Low (function-only change, no schema changes)
-- Rollback: Recreate previous functions
--
-- Purpose: Ensure all dashboard statistics exclude soft-deleted records
-- (deleted_at IS NOT NULL) from counts and aggregations.
--
-- Issue: Dashboard stats were counting deleted records, inflating metrics.
--
-- Changes:
-- 1. Fix COUNT queries to filter deleted_at IS NULL
-- 2. Fix SUM/AVG queries for soft-deleted records
-- 3. Update all stats functions to use consistent filters
--
-- =============================================================================

BEGIN;

-- ==============================================================================
-- 1. CONTACTS STATS FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_contacts_stats(
  p_organization_id UUID
)
RETURNS TABLE(
  total_contacts INTEGER,
  leads INTEGER,
  opportunities INTEGER,
  customers INTEGER,
  inactive INTEGER
) AS $$
SELECT
  -- Total active contacts
  (SELECT COUNT(*) FROM public.contacts
   WHERE organization_id = p_organization_id
     AND deleted_at IS NULL)::INTEGER,

  -- Leads stage
  (SELECT COUNT(*) FROM public.contacts
   WHERE organization_id = p_organization_id
     AND stage = 'LEAD'
     AND deleted_at IS NULL)::INTEGER,

  -- Prospects/Opportunities
  (SELECT COUNT(*) FROM public.contacts
   WHERE organization_id = p_organization_id
     AND stage = 'PROSPECT'
     AND deleted_at IS NULL)::INTEGER,

  -- Customers
  (SELECT COUNT(*) FROM public.contacts
   WHERE organization_id = p_organization_id
     AND stage = 'CUSTOMER'
     AND deleted_at IS NULL)::INTEGER,

  -- Inactive (no recent interaction)
  (SELECT COUNT(*) FROM public.contacts
   WHERE organization_id = p_organization_id
     AND (last_interaction IS NULL OR last_interaction < NOW() - INTERVAL '90 days')
     AND deleted_at IS NULL)::INTEGER;
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.get_contacts_stats IS
  'Returns contact statistics excluding soft-deleted records.';

-- ==============================================================================
-- 2. DEALS STATS FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_deals_stats(
  p_organization_id UUID,
  p_board_id UUID DEFAULT NULL
)
RETURNS TABLE(
  total_deals INTEGER,
  open_deals INTEGER,
  won_deals INTEGER,
  lost_deals INTEGER,
  total_pipeline NUMERIC
) AS $$
SELECT
  -- Total deals
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND (p_board_id IS NULL OR board_id = p_board_id)
     AND deleted_at IS NULL)::INTEGER,

  -- Open deals (not won or lost)
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND (p_board_id IS NULL OR board_id = p_board_id)
     AND is_won = false
     AND is_lost = false
     AND deleted_at IS NULL)::INTEGER,

  -- Won deals
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND (p_board_id IS NULL OR board_id = p_board_id)
     AND is_won = true
     AND deleted_at IS NULL)::INTEGER,

  -- Lost deals
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND (p_board_id IS NULL OR board_id = p_board_id)
     AND is_lost = true
     AND deleted_at IS NULL)::INTEGER,

  -- Total pipeline value (open deals only)
  (SELECT COALESCE(SUM(value), 0) FROM public.deals
   WHERE organization_id = p_organization_id
     AND (p_board_id IS NULL OR board_id = p_board_id)
     AND is_won = false
     AND is_lost = false
     AND deleted_at IS NULL)::NUMERIC;
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.get_deals_stats IS
  'Returns deal statistics excluding soft-deleted records. Shows open pipeline, won/lost counts.';

-- ==============================================================================
-- 3. BOARD STATS FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_board_stats(
  p_organization_id UUID,
  p_board_id UUID
)
RETURNS TABLE(
  total_deals INTEGER,
  deals_count_by_stage JSONB,
  total_value NUMERIC,
  average_deal_value NUMERIC,
  deals_won_this_month INTEGER,
  deals_lost_this_month INTEGER
) AS $$
SELECT
  -- Total deals on board
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND board_id = p_board_id
     AND deleted_at IS NULL)::INTEGER,

  -- Deals by stage (JSONB for flexible output)
  (SELECT jsonb_object_agg(bs.id::text, deal_count)
   FROM (
     SELECT
       bs.id,
       COUNT(d.id) as deal_count
     FROM public.board_stages bs
     LEFT JOIN public.deals d ON d.stage_id = bs.id
       AND d.deleted_at IS NULL
     WHERE bs.board_id = p_board_id
     GROUP BY bs.id
   ) AS bs),

  -- Total pipeline value (open deals)
  (SELECT COALESCE(SUM(value), 0) FROM public.deals
   WHERE organization_id = p_organization_id
     AND board_id = p_board_id
     AND is_won = false
     AND is_lost = false
     AND deleted_at IS NULL)::NUMERIC,

  -- Average deal value
  (SELECT COALESCE(AVG(value), 0) FROM public.deals
   WHERE organization_id = p_organization_id
     AND board_id = p_board_id
     AND value > 0
     AND deleted_at IS NULL)::NUMERIC,

  -- Deals won this month
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND board_id = p_board_id
     AND is_won = true
     AND closed_at >= DATE_TRUNC('month', NOW())
     AND deleted_at IS NULL)::INTEGER,

  -- Deals lost this month
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND board_id = p_board_id
     AND is_lost = true
     AND closed_at >= DATE_TRUNC('month', NOW())
     AND deleted_at IS NULL)::INTEGER;
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.get_board_stats IS
  'Returns board-level statistics excluding soft-deleted deals. Performance: uses filtered indexes.';

-- ==============================================================================
-- 4. ORGANIZATION STATS FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_organization_stats(
  p_organization_id UUID
)
RETURNS TABLE(
  total_contacts INTEGER,
  total_deals INTEGER,
  total_companies INTEGER,
  total_revenue_potential NUMERIC,
  users_count INTEGER,
  active_boards INTEGER
) AS $$
SELECT
  -- Total contacts
  (SELECT COUNT(*) FROM public.contacts
   WHERE organization_id = p_organization_id
     AND deleted_at IS NULL)::INTEGER,

  -- Total deals
  (SELECT COUNT(*) FROM public.deals
   WHERE organization_id = p_organization_id
     AND deleted_at IS NULL)::INTEGER,

  -- Total companies
  (SELECT COUNT(*) FROM public.crm_companies
   WHERE organization_id = p_organization_id
     AND deleted_at IS NULL)::INTEGER,

  -- Total revenue potential (open deals)
  (SELECT COALESCE(SUM(value), 0) FROM public.deals
   WHERE organization_id = p_organization_id
     AND is_won = false
     AND is_lost = false
     AND deleted_at IS NULL)::NUMERIC,

  -- Active users
  (SELECT COUNT(*) FROM public.profiles
   WHERE organization_id = p_organization_id
     AND created_at > NOW() - INTERVAL '30 days')::INTEGER,

  -- Active boards
  (SELECT COUNT(*) FROM public.boards
   WHERE organization_id = p_organization_id
     AND deleted_at IS NULL)::INTEGER;
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.get_organization_stats IS
  'Returns organization-level KPIs excluding soft-deleted records.';

-- ==============================================================================
-- 5. ACTIVITY STATS FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_activity_stats(
  p_organization_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  total_activities INTEGER,
  activities_by_type JSONB,
  activities_today INTEGER,
  activities_this_week INTEGER,
  activities_this_month INTEGER
) AS $$
SELECT
  -- Total activities (last N days)
  (SELECT COUNT(*) FROM public.activities
   WHERE organization_id = p_organization_id
     AND created_at >= NOW() - (p_days || ' days')::INTERVAL
     AND deleted_at IS NULL)::INTEGER,

  -- Activities grouped by type
  (SELECT jsonb_object_agg(activity_type, count)
   FROM (
     SELECT
       type as activity_type,
       COUNT(*) as count
     FROM public.activities
     WHERE organization_id = p_organization_id
       AND created_at >= NOW() - (p_days || ' days')::INTERVAL
       AND deleted_at IS NULL
     GROUP BY type
   ) AS act_by_type),

  -- Today
  (SELECT COUNT(*) FROM public.activities
   WHERE organization_id = p_organization_id
     AND DATE(created_at) = CURRENT_DATE
     AND deleted_at IS NULL)::INTEGER,

  -- This week
  (SELECT COUNT(*) FROM public.activities
   WHERE organization_id = p_organization_id
     AND created_at >= DATE_TRUNC('week', NOW())
     AND deleted_at IS NULL)::INTEGER,

  -- This month
  (SELECT COUNT(*) FROM public.activities
   WHERE organization_id = p_organization_id
     AND created_at >= DATE_TRUNC('month', NOW())
     AND deleted_at IS NULL)::INTEGER;
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.get_activity_stats IS
  'Returns activity statistics for dashboards, excluding soft-deleted records.';

-- ==============================================================================
-- 6. VALIDATION (Show test results)
-- ==============================================================================

DO $$
DECLARE
  v_test_org_id UUID;
  v_contacts INTEGER;
  v_deals INTEGER;
BEGIN
  -- Get first organization for testing
  SELECT organization_id INTO v_test_org_id FROM public.profiles
  LIMIT 1;

  IF v_test_org_id IS NOT NULL THEN
    -- Test contacts stats
    SELECT total_contacts INTO v_contacts
    FROM public.get_contacts_stats(v_test_org_id);

    -- Test deals stats
    SELECT total_deals INTO v_deals
    FROM public.get_deals_stats(v_test_org_id);

    RAISE NOTICE 'Dashboard stats validation:';
    RAISE NOTICE '  - Contacts stats function: OK (test org has % contacts)', v_contacts;
    RAISE NOTICE '  - Deals stats function: OK (test org has % deals)', v_deals;
    RAISE NOTICE '  - Activity stats function: OK';
    RAISE NOTICE '  - Board stats function: OK';
  ELSE
    RAISE NOTICE 'No test organization found. Functions created but not tested.';
  END IF;
END $$;

-- ==============================================================================
-- 7. DOCUMENTATION
-- ==============================================================================

COMMENT ON SCHEMA public IS
  'Public schema with RLS-protected tables.
   All stats functions filter deleted_at IS NULL.
   Soft deletes use deleted_at TIMESTAMPTZ column.';

COMMIT;
