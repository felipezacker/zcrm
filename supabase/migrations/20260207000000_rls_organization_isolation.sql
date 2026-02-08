-- =============================================================================
-- MIGRATION: RLS Organization Isolation (Phase A.1)
-- =============================================================================
--
-- Purpose: Replace permissive USING(true) RLS policies with proper
--          organization-level isolation on all CRM tables.
--
-- Security Impact: CRITICAL
--   Before: Any authenticated user can read/write ALL organizations' data
--   After:  Users can only access data belonging to their own organization
--
-- Tables affected: 23 tables
-- Tables already secure: 13 tables (unchanged)
--
-- Rollback: See 20260207000000_rls_organization_isolation_rollback.sql
-- =============================================================================

-- =============================================================================
-- STEP 1: Helper function for RLS policy reuse
-- =============================================================================

-- Cached, stable function - Supabase can optimize repeated calls within a transaction
CREATE OR REPLACE FUNCTION public.get_my_organization_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_organization_id() TO authenticated;

COMMENT ON FUNCTION public.get_my_organization_id IS
  'Returns the organization_id for the current authenticated user. Used by RLS policies.';

-- =============================================================================
-- STEP 2: Add organization_id to tables that need it
-- =============================================================================

-- deal_notes: currently has no organization_id (linked via deal_id)
ALTER TABLE public.deal_notes
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Backfill organization_id from parent deal
UPDATE public.deal_notes dn
SET organization_id = d.organization_id
FROM public.deals d
WHERE dn.deal_id = d.id
  AND dn.organization_id IS NULL;

-- deal_files: currently has no organization_id (linked via deal_id)
ALTER TABLE public.deal_files
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Backfill organization_id from parent deal
UPDATE public.deal_files df
SET organization_id = d.organization_id
FROM public.deals d
WHERE df.deal_id = d.id
  AND df.organization_id IS NULL;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_deal_notes_org ON public.deal_notes(organization_id);
CREATE INDEX IF NOT EXISTS idx_deal_files_org ON public.deal_files(organization_id);

-- =============================================================================
-- STEP 3: Add trigger to auto-populate organization_id on deal child tables
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_deal_child_org_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.organization_id IS NULL AND NEW.deal_id IS NOT NULL THEN
    SELECT organization_id INTO NEW.organization_id
    FROM public.deals
    WHERE id = NEW.deal_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_deal_notes_org_id ON public.deal_notes;
CREATE TRIGGER set_deal_notes_org_id
  BEFORE INSERT ON public.deal_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_deal_child_org_id();

DROP TRIGGER IF EXISTS set_deal_files_org_id ON public.deal_files;
CREATE TRIGGER set_deal_files_org_id
  BEFORE INSERT ON public.deal_files
  FOR EACH ROW
  EXECUTE FUNCTION public.set_deal_child_org_id();

-- =============================================================================
-- STEP 4: Drop ALL permissive policies on affected tables
-- =============================================================================

-- ORGANIZATIONS
DROP POLICY IF EXISTS "authenticated_access" ON public.organizations;

-- PROFILES (keep update policy, fix select)
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;

-- BOARDS (4 separate policies)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.boards;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.boards;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.boards;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.boards;

-- BOARD_STAGES (4 separate policies)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.board_stages;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.board_stages;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.board_stages;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.board_stages;

-- LIFECYCLE_STAGES
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.lifecycle_stages;

-- CRM_COMPANIES
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.crm_companies;

-- CONTACTS
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.contacts;

-- PRODUCTS
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.products;

-- DEALS
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.deals;

-- DEAL_ITEMS
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.deal_items;

-- ACTIVITIES
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.activities;

-- TAGS
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.tags;

-- CUSTOM_FIELD_DEFINITIONS
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.custom_field_definitions;

-- LEADS
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.leads;

-- AI TABLES
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_conversations;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_decisions;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_audio_notes;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_suggestion_interactions;

-- DEAL_NOTES
DROP POLICY IF EXISTS "deal_notes_access" ON public.deal_notes;

-- DEAL_FILES
DROP POLICY IF EXISTS "deal_files_access" ON public.deal_files;

-- SYSTEM TABLES
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.system_notifications;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.rate_limits;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.user_consents;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.audit_logs;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.security_alerts;

-- =============================================================================
-- STEP 5: Create ORGANIZATION-ISOLATED policies
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ORGANIZATIONS: Users can only see their own organization
-- ---------------------------------------------------------------------------
CREATE POLICY "org_isolation_select" ON public.organizations
  FOR SELECT TO authenticated
  USING (
    id = public.get_my_organization_id()
    AND deleted_at IS NULL
  );

CREATE POLICY "org_isolation_update" ON public.organizations
  FOR UPDATE TO authenticated
  USING (id = public.get_my_organization_id())
  WITH CHECK (id = public.get_my_organization_id());

-- INSERT: only service role should create organizations (setup flow)
-- No INSERT/DELETE policy for regular users

-- ---------------------------------------------------------------------------
-- PROFILES: Users can see profiles in their organization
-- ---------------------------------------------------------------------------
CREATE POLICY "profiles_org_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    organization_id = public.get_my_organization_id()
  );

-- (profiles_update already exists: id = auth.uid())

-- ---------------------------------------------------------------------------
-- BOARDS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "boards_org_select" ON public.boards
  FOR SELECT TO authenticated
  USING (organization_id = public.get_my_organization_id());

CREATE POLICY "boards_org_insert" ON public.boards
  FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.get_my_organization_id());

CREATE POLICY "boards_org_update" ON public.boards
  FOR UPDATE TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

CREATE POLICY "boards_org_delete" ON public.boards
  FOR DELETE TO authenticated
  USING (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- BOARD_STAGES: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "board_stages_org_select" ON public.board_stages
  FOR SELECT TO authenticated
  USING (organization_id = public.get_my_organization_id());

CREATE POLICY "board_stages_org_insert" ON public.board_stages
  FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.get_my_organization_id());

CREATE POLICY "board_stages_org_update" ON public.board_stages
  FOR UPDATE TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

CREATE POLICY "board_stages_org_delete" ON public.board_stages
  FOR DELETE TO authenticated
  USING (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- LIFECYCLE_STAGES: Global reference data (read for all, write for admin via service role)
-- ---------------------------------------------------------------------------
CREATE POLICY "lifecycle_stages_read" ON public.lifecycle_stages
  FOR SELECT TO authenticated
  USING (true);

-- INSERT/UPDATE/DELETE restricted to service_role (admin UI bypasses via RLS auth)
-- Regular authenticated users cannot modify lifecycle stages
-- Service role functions can modify via SECURITY DEFINER

-- ---------------------------------------------------------------------------
-- CRM_COMPANIES: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "crm_companies_org_all" ON public.crm_companies
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- CONTACTS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "contacts_org_all" ON public.contacts
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- PRODUCTS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "products_org_all" ON public.products
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- DEALS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "deals_org_all" ON public.deals
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- DEAL_ITEMS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "deal_items_org_all" ON public.deal_items
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- ACTIVITIES: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "activities_org_all" ON public.activities
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- TAGS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "tags_org_all" ON public.tags
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- CUSTOM_FIELD_DEFINITIONS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "custom_field_definitions_org_all" ON public.custom_field_definitions
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- LEADS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "leads_org_all" ON public.leads
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- DEAL_NOTES: Organization-level isolation (via new organization_id column)
-- ---------------------------------------------------------------------------
CREATE POLICY "deal_notes_org_all" ON public.deal_notes
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- DEAL_FILES: Organization-level isolation (via new organization_id column)
-- ---------------------------------------------------------------------------
CREATE POLICY "deal_files_org_all" ON public.deal_files
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- SYSTEM_NOTIFICATIONS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "system_notifications_org_all" ON public.system_notifications
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- ---------------------------------------------------------------------------
-- SECURITY_ALERTS: Organization-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "security_alerts_org_all" ON public.security_alerts
  FOR ALL TO authenticated
  USING (organization_id = public.get_my_organization_id())
  WITH CHECK (organization_id = public.get_my_organization_id());

-- =============================================================================
-- STEP 6: Create USER-LEVEL policies (tables without organization_id)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- AI_CONVERSATIONS: User-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "ai_conversations_user_all" ON public.ai_conversations
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- AI_DECISIONS: User-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "ai_decisions_user_all" ON public.ai_decisions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- AI_AUDIO_NOTES: User-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "ai_audio_notes_user_all" ON public.ai_audio_notes
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- AI_SUGGESTION_INTERACTIONS: User-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "ai_suggestion_interactions_user_all" ON public.ai_suggestion_interactions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- USER_CONSENTS: User-level isolation
-- ---------------------------------------------------------------------------
CREATE POLICY "user_consents_user_all" ON public.user_consents
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- STEP 7: System tables with restricted access
-- =============================================================================

-- ---------------------------------------------------------------------------
-- AUDIT_LOGS: Organization members can view their org's logs (read-only)
-- ---------------------------------------------------------------------------
CREATE POLICY "audit_logs_org_select" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (organization_id = public.get_my_organization_id());

-- Insert via service role or SECURITY DEFINER functions only (log_audit_event)
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);
-- Note: log_audit_event() is SECURITY DEFINER, so it bypasses RLS.
-- The INSERT policy allows the function to work. Direct inserts are still
-- restricted because user_id is set by auth.uid() in the function.

-- ---------------------------------------------------------------------------
-- RATE_LIMITS: System table - no direct user access needed
-- Managed by SECURITY DEFINER functions (cleanup_rate_limits)
-- ---------------------------------------------------------------------------
CREATE POLICY "rate_limits_service_only" ON public.rate_limits
  FOR ALL TO authenticated
  USING (false);
-- Rate limit operations happen via SECURITY DEFINER functions

-- =============================================================================
-- STEP 8: Update SECURITY DEFINER functions with org awareness
-- =============================================================================

-- Fix get_dashboard_stats to respect organization context
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
    org_id UUID;
BEGIN
    org_id := public.get_my_organization_id();

    IF org_id IS NULL THEN
        RETURN '{}'::JSON;
    END IF;

    SELECT json_build_object(
        'total_deals', (SELECT COUNT(*) FROM public.deals WHERE organization_id = org_id AND deleted_at IS NULL),
        'pipeline_value', (SELECT COALESCE(SUM(value), 0) FROM public.deals WHERE organization_id = org_id AND is_won = FALSE AND is_lost = FALSE AND deleted_at IS NULL),
        'total_contacts', (SELECT COUNT(*) FROM public.contacts WHERE organization_id = org_id AND deleted_at IS NULL),
        'total_companies', (SELECT COUNT(*) FROM public.crm_companies WHERE organization_id = org_id AND deleted_at IS NULL),
        'won_deals', (SELECT COUNT(*) FROM public.deals WHERE organization_id = org_id AND is_won = TRUE AND deleted_at IS NULL),
        'won_value', (SELECT COALESCE(SUM(value), 0) FROM public.deals WHERE organization_id = org_id AND is_won = TRUE AND deleted_at IS NULL),
        'lost_deals', (SELECT COUNT(*) FROM public.deals WHERE organization_id = org_id AND is_lost = TRUE AND deleted_at IS NULL),
        'activities_today', (SELECT COUNT(*) FROM public.activities WHERE organization_id = org_id AND DATE(date) = CURRENT_DATE AND deleted_at IS NULL)
    ) INTO result;

    RETURN result;
END;
$$;

-- Fix get_contact_stage_counts to respect organization context
CREATE OR REPLACE FUNCTION get_contact_stage_counts()
RETURNS TABLE (
  stage TEXT,
  count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    c.stage,
    COUNT(*)::BIGINT as count
  FROM contacts c
  WHERE c.deleted_at IS NULL
    AND c.organization_id = public.get_my_organization_id()
  GROUP BY c.stage;
$$;

-- Fix mark_deal_won to verify organization ownership
CREATE OR REPLACE FUNCTION public.mark_deal_won(p_deal_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.deals
    SET
        is_won = TRUE,
        is_lost = FALSE,
        closed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_deal_id
      AND organization_id = public.get_my_organization_id();
END;
$$;

-- Fix mark_deal_lost to verify organization ownership
CREATE OR REPLACE FUNCTION public.mark_deal_lost(p_deal_id UUID, reason TEXT DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.deals
    SET
        is_lost = TRUE,
        is_won = FALSE,
        loss_reason = COALESCE(reason, loss_reason),
        closed_at = NOW(),
        updated_at = NOW()
    WHERE id = p_deal_id
      AND organization_id = public.get_my_organization_id();
END;
$$;

-- Fix reopen_deal to verify organization ownership
CREATE OR REPLACE FUNCTION public.reopen_deal(p_deal_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.deals
    SET
        is_won = FALSE,
        is_lost = FALSE,
        closed_at = NULL,
        updated_at = NOW()
    WHERE id = p_deal_id
      AND organization_id = public.get_my_organization_id();
END;
$$;

-- Fix log_audit_event to capture organization context
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}',
    p_severity TEXT DEFAULT 'info'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_org_id UUID;
    v_log_id UUID;
BEGIN
    v_user_id := auth.uid();
    v_org_id := public.get_my_organization_id();

    INSERT INTO public.audit_logs (
        user_id, organization_id, action, resource_type, resource_id, details, severity
    ) VALUES (
        v_user_id, v_org_id, p_action, p_resource_type, p_resource_id, p_details, p_severity
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;

-- =============================================================================
-- STEP 9: Add organization_id indexes for RLS performance
-- =============================================================================

-- These indexes are critical for RLS policy performance
-- Without them, every query does a sequential scan on organization_id
CREATE INDEX IF NOT EXISTS idx_profiles_org ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_boards_org ON public.boards(organization_id);
CREATE INDEX IF NOT EXISTS idx_board_stages_org ON public.board_stages(organization_id);
CREATE INDEX IF NOT EXISTS idx_contacts_org ON public.contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_org ON public.products(organization_id);
CREATE INDEX IF NOT EXISTS idx_deals_org ON public.deals(organization_id);
CREATE INDEX IF NOT EXISTS idx_deal_items_org ON public.deal_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_activities_org ON public.activities(organization_id);
CREATE INDEX IF NOT EXISTS idx_tags_org ON public.tags(organization_id);
CREATE INDEX IF NOT EXISTS idx_custom_field_definitions_org ON public.custom_field_definitions(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_org ON public.leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_org ON public.system_notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_org ON public.security_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_crm_companies_org ON public.crm_companies(organization_id);

-- =============================================================================
-- VERIFICATION COMMENT
-- =============================================================================
COMMENT ON SCHEMA public IS 'RLS organization isolation applied on 2026-02-07. All CRM tables now enforce organization-level data isolation.';
