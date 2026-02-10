-- =============================================================================
-- TEMPORARY: Migration helper functions (remove after migration)
-- =============================================================================

-- Disable deal duplicate trigger for bulk import
CREATE OR REPLACE FUNCTION public._migration_disable_deal_trigger()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  ALTER TABLE public.deals DISABLE TRIGGER check_deal_duplicate_trigger;
END;
$$;

-- Re-enable deal duplicate trigger after import
CREATE OR REPLACE FUNCTION public._migration_enable_deal_trigger()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  ALTER TABLE public.deals ENABLE TRIGGER check_deal_duplicate_trigger;
END;
$$;

-- Grant to service role
GRANT EXECUTE ON FUNCTION public._migration_disable_deal_trigger() TO authenticated;
GRANT EXECUTE ON FUNCTION public._migration_enable_deal_trigger() TO authenticated;
