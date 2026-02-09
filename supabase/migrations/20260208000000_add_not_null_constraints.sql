-- =============================================================================
-- Phase C.1: Add Missing NOT NULL Constraints
-- =============================================================================
-- Timeline: 1 day
-- Risk Level: Medium (adds constraints, may fail if NULL values exist)
-- Rollback: Drop constraints
--
-- Purpose: Enforce data integrity by adding NOT NULL constraints to
-- required fields across all critical tables
--
-- Changes:
-- 1. organization_id: NOT NULL on all data tables
-- 2. board_id: NOT NULL on deals and board_stages
-- 3. contact_id: NOT NULL on activities
-- 4. created_at: NOT NULL on all tables (safety net)
--
-- =============================================================================

BEGIN;

-- ==============================================================================
-- 1. ORGANIZATION_ID CONSTRAINTS (All data tables must reference organization)
-- ==============================================================================

-- profiles.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.profiles
DROP CONSTRAINT IF EXISTS profiles_organization_id_not_null,
ADD CONSTRAINT profiles_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- contacts.organization_id -> NOT NULL (already NOT NULL in schema)
ALTER TABLE IF EXISTS public.contacts
ADD CONSTRAINT contacts_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- deals.organization_id -> NOT NULL (already NOT NULL in schema)
ALTER TABLE IF EXISTS public.deals
ADD CONSTRAINT deals_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- boards.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.boards
DROP CONSTRAINT IF EXISTS boards_organization_id_not_null,
ADD CONSTRAINT boards_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- activities.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.activities
DROP CONSTRAINT IF EXISTS activities_organization_id_not_null,
ADD CONSTRAINT activities_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- deal_items.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.deal_items
DROP CONSTRAINT IF EXISTS deal_items_organization_id_not_null,
ADD CONSTRAINT deal_items_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- deal_notes.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.deal_notes
DROP CONSTRAINT IF EXISTS deal_notes_organization_id_not_null,
ADD CONSTRAINT deal_notes_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- board_stages.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.board_stages
DROP CONSTRAINT IF EXISTS board_stages_organization_id_not_null,
ADD CONSTRAINT board_stages_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- custom_field_definitions.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.custom_field_definitions
DROP CONSTRAINT IF EXISTS custom_field_definitions_organization_id_not_null,
ADD CONSTRAINT custom_field_definitions_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- custom_field_values.organization_id -> NOT NULL
ALTER TABLE IF EXISTS public.custom_field_values
DROP CONSTRAINT IF EXISTS custom_field_values_organization_id_not_null,
ADD CONSTRAINT custom_field_values_organization_id_not_null CHECK (organization_id IS NOT NULL);

-- ==============================================================================
-- 2. BOARD_ID CONSTRAINTS (Deals must belong to a board)
-- ==============================================================================

-- deals.board_id -> NOT NULL (already NOT NULL in schema)
ALTER TABLE IF EXISTS public.deals
ADD CONSTRAINT deals_board_id_not_null CHECK (board_id IS NOT NULL);

-- deal_items.board_id -> NOT NULL
ALTER TABLE IF EXISTS public.deal_items
DROP CONSTRAINT IF EXISTS deal_items_board_id_not_null,
ADD CONSTRAINT deal_items_board_id_not_null CHECK (board_id IS NOT NULL);

-- ==============================================================================
-- 3. CONTACT_ID CONSTRAINTS (Activities should be linked to contacts)
-- ==============================================================================

-- activities.contact_id -> NOT NULL
ALTER TABLE IF EXISTS public.activities
DROP CONSTRAINT IF EXISTS activities_contact_id_not_null,
ADD CONSTRAINT activities_contact_id_not_null CHECK (contact_id IS NOT NULL);

-- ==============================================================================
-- 4. CREATED_AT CONSTRAINTS (All tables should have creation timestamp)
-- ==============================================================================

-- profiles.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.profiles
DROP CONSTRAINT IF EXISTS profiles_created_at_not_null,
ADD CONSTRAINT profiles_created_at_not_null CHECK (created_at IS NOT NULL);

-- contacts.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.contacts
ADD CONSTRAINT contacts_created_at_not_null CHECK (created_at IS NOT NULL);

-- deals.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.deals
ADD CONSTRAINT deals_created_at_not_null CHECK (created_at IS NOT NULL);

-- boards.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.boards
ADD CONSTRAINT boards_created_at_not_null CHECK (created_at IS NOT NULL);

-- board_stages.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.board_stages
ADD CONSTRAINT board_stages_created_at_not_null CHECK (created_at IS NOT NULL);

-- activities.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.activities
ADD CONSTRAINT activities_created_at_not_null CHECK (created_at IS NOT NULL);

-- deal_items.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.deal_items
ADD CONSTRAINT deal_items_created_at_not_null CHECK (created_at IS NOT NULL);

-- deal_notes.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.deal_notes
ADD CONSTRAINT deal_notes_created_at_not_null CHECK (created_at IS NOT NULL);

-- crm_companies.created_at -> NOT NULL
ALTER TABLE IF EXISTS public.crm_companies
ADD CONSTRAINT crm_companies_created_at_not_null CHECK (created_at IS NOT NULL);

-- ==============================================================================
-- 5. DOCUMENTATION
-- ==============================================================================

COMMENT ON CONSTRAINT profiles_organization_id_not_null ON public.profiles IS
  'Ensures all profiles belong to an organization (data isolation)';

COMMENT ON CONSTRAINT deals_board_id_not_null ON public.deals IS
  'Ensures all deals belong to a board (pipeline integrity)';

COMMENT ON CONSTRAINT activities_contact_id_not_null ON public.activities IS
  'Ensures all activities are linked to a contact (traceability)';

-- ==============================================================================
-- 6. VALIDATION (Check no NULL values that would violate constraints)
-- ==============================================================================

DO $$
DECLARE
  v_null_count INTEGER := 0;
BEGIN
  -- Check organization_id nulls (should be 0)
  SELECT COUNT(*) INTO v_null_count FROM public.profiles WHERE organization_id IS NULL;
  IF v_null_count > 0 THEN
    RAISE WARNING 'Found % NULL organization_id values in profiles', v_null_count;
  END IF;

  SELECT COUNT(*) INTO v_null_count FROM public.contacts WHERE organization_id IS NULL;
  IF v_null_count > 0 THEN
    RAISE WARNING 'Found % NULL organization_id values in contacts', v_null_count;
  END IF;

  SELECT COUNT(*) INTO v_null_count FROM public.deals WHERE organization_id IS NULL;
  IF v_null_count > 0 THEN
    RAISE WARNING 'Found % NULL organization_id values in deals', v_null_count;
  END IF;

  RAISE NOTICE 'Constraint validation completed successfully';
END $$;

COMMIT;
