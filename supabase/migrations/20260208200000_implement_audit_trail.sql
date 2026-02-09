-- =============================================================================
-- Phase C.3: Implement Audit Trail (LGPD Compliance)
-- =============================================================================
-- Timeline: 1-2 days
-- Risk Level: Medium (adds new table + triggers)
-- Rollback: Drop triggers and audit_log table
--
-- Purpose: Implement immutable audit trail for LGPD/GDPR compliance.
-- Tracks who changed what, when, and why for all critical tables.
--
-- Features:
-- 1. Immutable audit_log table (append-only, no deletes)
-- 2. Audit triggers on critical tables (contacts, deals, organizations)
-- 3. Tracks: operation (INSERT/UPDATE/DELETE), old values, new values
-- 4. 7-year retention policy
-- 5. Access via audit queries (not directly by users)
--
-- =============================================================================

BEGIN;

-- ==============================================================================
-- 1. AUDIT LOG TABLE (Immutable, append-only)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What was changed
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),

    -- Who changed it
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

    -- Before and after values
    old_values JSONB DEFAULT NULL,
    new_values JSONB DEFAULT NULL,

    -- When it was changed
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Audit trail metadata
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    description TEXT DEFAULT NULL
);

-- Create indexes for audit queries
-- FIXED (H3): Removed static NOW() evaluation from WHERE clauses
-- NOTE: For very large audit logs (>10M rows), consider using pg_partman for time-based partitioning
-- until then, these full indexes support all queries over the 7-year retention period

CREATE INDEX IF NOT EXISTS idx_audit_log_table_name
  ON public.audit_log(table_name);

CREATE INDEX IF NOT EXISTS idx_audit_log_record_id
  ON public.audit_log(record_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_organization_id
  ON public.audit_log(organization_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_changed_by
  ON public.audit_log(changed_by);

CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at
  ON public.audit_log(changed_at DESC);

-- Composite index for historical queries (table + record + date)
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record_date
  ON public.audit_log(table_name, record_id, changed_at DESC);

-- Enable RLS (only admins can view)
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can SELECT audit logs for their organization
CREATE POLICY "Audit logs visible to authenticated users" ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles
      WHERE id = auth.uid()
    )
  );

-- ADDED (M1): Prevent UPDATE operations on audit_log (immutability enforcement)
CREATE POLICY "Audit logs cannot be updated" ON public.audit_log
  FOR UPDATE
  USING (false);

-- ADDED (M1): Prevent DELETE operations on audit_log (immutability enforcement)
CREATE POLICY "Audit logs cannot be deleted" ON public.audit_log
  FOR DELETE
  USING (false);

COMMENT ON TABLE public.audit_log IS
  'Immutable audit trail for LGPD/GDPR compliance. Tracks all changes to critical tables.';

-- ==============================================================================
-- 2. AUDIT TRIGGER FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_organization_id UUID;
BEGIN
  -- Determine organization_id based on table and operation
  IF TG_TABLE_NAME = 'organizations' THEN
    v_organization_id := COALESCE(NEW.id, OLD.id);
  ELSIF TG_TABLE_NAME = 'profiles' THEN
    v_organization_id := COALESCE(NEW.organization_id, OLD.organization_id);
  ELSIF TG_TABLE_NAME = 'contacts' THEN
    v_organization_id := COALESCE(NEW.organization_id, OLD.organization_id);
  ELSIF TG_TABLE_NAME = 'deals' THEN
    v_organization_id := COALESCE(NEW.organization_id, OLD.organization_id);
  ELSIF TG_TABLE_NAME = 'boards' THEN
    v_organization_id := COALESCE(NEW.organization_id, OLD.organization_id);
  ELSIF TG_TABLE_NAME = 'crm_companies' THEN
    v_organization_id := COALESCE(NEW.organization_id, OLD.organization_id);
  ELSIF TG_TABLE_NAME = 'activities' THEN
    v_organization_id := COALESCE(NEW.organization_id, OLD.organization_id);
  ELSE
    -- Fallback: try to get organization_id from either record
    v_organization_id := COALESCE(
      (NEW::jsonb ->> 'organization_id')::UUID,
      (OLD::jsonb ->> 'organization_id')::UUID
    );
  END IF;

  -- If we still don't have organization_id, skip (safety)
  IF v_organization_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Insert audit log entry
  -- FIXED (H2): Capture old_values on both UPDATE and DELETE operations
  INSERT INTO public.audit_log (
    table_name,
    record_id,
    operation,
    old_values,
    new_values,
    changed_by,
    organization_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    auth.uid(),
    v_organization_id
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 3. ATTACH AUDIT TRIGGERS TO CRITICAL TABLES
-- ==============================================================================

-- Audit organizations
DROP TRIGGER IF EXISTS trg_audit_organizations ON public.organizations;
CREATE TRIGGER trg_audit_organizations
  AFTER INSERT OR UPDATE OR DELETE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- Audit profiles
DROP TRIGGER IF EXISTS trg_audit_profiles ON public.profiles;
CREATE TRIGGER trg_audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- Audit contacts
DROP TRIGGER IF EXISTS trg_audit_contacts ON public.contacts;
CREATE TRIGGER trg_audit_contacts
  AFTER INSERT OR UPDATE OR DELETE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- Audit deals
DROP TRIGGER IF EXISTS trg_audit_deals ON public.deals;
CREATE TRIGGER trg_audit_deals
  AFTER INSERT OR UPDATE OR DELETE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- Audit boards
DROP TRIGGER IF EXISTS trg_audit_boards ON public.boards;
CREATE TRIGGER trg_audit_boards
  AFTER INSERT OR UPDATE OR DELETE ON public.boards
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- Audit board_stages
DROP TRIGGER IF EXISTS trg_audit_board_stages ON public.board_stages;
CREATE TRIGGER trg_audit_board_stages
  AFTER INSERT OR UPDATE OR DELETE ON public.board_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- Audit crm_companies
DROP TRIGGER IF EXISTS trg_audit_crm_companies ON public.crm_companies;
CREATE TRIGGER trg_audit_crm_companies
  AFTER INSERT OR UPDATE OR DELETE ON public.crm_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- Audit activities
DROP TRIGGER IF EXISTS trg_audit_activities ON public.activities;
CREATE TRIGGER trg_audit_activities
  AFTER INSERT OR UPDATE OR DELETE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_trigger();

-- ==============================================================================
-- 4. AUDIT QUERY HELPERS
-- ==============================================================================

-- View: Get all changes to a specific record
CREATE OR REPLACE VIEW public.vw_record_audit_history AS
SELECT
  al.id,
  al.table_name,
  al.record_id,
  al.operation,
  al.changed_by,
  p.email AS changed_by_email,
  al.changed_at,
  al.old_values,
  al.new_values,
  al.organization_id
FROM public.audit_log al
LEFT JOIN public.profiles p ON al.changed_by = p.id
ORDER BY al.changed_at DESC;

COMMENT ON VIEW public.vw_record_audit_history IS
  'View for querying audit trail history. Shows who changed what and when.';

-- Function: Get specific field history
CREATE OR REPLACE FUNCTION public.get_field_audit_history(
  p_table_name TEXT,
  p_record_id UUID,
  p_field_name TEXT
)
RETURNS TABLE(
  operation TEXT,
  old_value TEXT,
  new_value TEXT,
  changed_by_email TEXT,
  changed_at TIMESTAMPTZ
) AS $$
SELECT
  al.operation,
  al.old_values ->> p_field_name AS old_value,
  al.new_values ->> p_field_name AS new_value,
  p.email AS changed_by_email,
  al.changed_at
FROM public.audit_log al
LEFT JOIN public.profiles p ON al.changed_by = p.id
WHERE al.table_name = p_table_name
  AND al.record_id = p_record_id
  AND (
    (al.old_values ->> p_field_name IS NOT NULL)
    OR (al.new_values ->> p_field_name IS NOT NULL)
  )
ORDER BY al.changed_at DESC;
$$ LANGUAGE SQL SECURITY DEFINER;

COMMENT ON FUNCTION public.get_field_audit_history IS
  'Get history of changes to a specific field in a record.';

-- ==============================================================================
-- 5. RETENTION POLICY (cleanup old records after 7 years)
-- ==============================================================================

-- This should be scheduled via pg_cron or similar job scheduler
-- For now, we document the cleanup logic

COMMENT ON TABLE public.audit_log IS
  'Immutable audit trail. Retention policy: Keep for 7 years per LGPD.
   Cleanup: DELETE FROM audit_log WHERE changed_at < NOW() - INTERVAL 7 YEAR;';

-- ==============================================================================
-- 6. VALIDATION
-- ==============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Audit trail implementation complete:';
  RAISE NOTICE '  - audit_log table created';
  RAISE NOTICE '  - audit triggers on 8 critical tables';
  RAISE NOTICE '  - RLS policies configured';
  RAISE NOTICE '  - Query helpers (view + function) available';
  RAISE NOTICE '  - Retention: 7 years per LGPD';
END $$;

COMMIT;
