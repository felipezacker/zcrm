-- Cleanup: remove temporary migration helper functions
DROP FUNCTION IF EXISTS public._migration_disable_deal_trigger();
DROP FUNCTION IF EXISTS public._migration_enable_deal_trigger();
