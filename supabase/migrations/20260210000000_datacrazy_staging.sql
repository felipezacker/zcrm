-- =============================================================================
-- DATACRAZY → ZMOBCRM: Schema Additions for 100% Data Migration
-- =============================================================================
-- Purpose: Add supporting tables and columns to preserve ALL DataCrazy data
-- Author: Dara (data-engineer)
-- Date: 2026-02-10
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CONTACT_TAGS junction table (DataCrazy leads have tags[])
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_tags (
    contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (contact_id, tag_id)
);

ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_contact_tags_contact ON public.contact_tags(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_tags_tag ON public.contact_tags(tag_id);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.contact_tags;
CREATE POLICY "Enable all access for authenticated users" ON public.contact_tags
    FOR ALL TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 2. LOSS_REASONS lookup table (preserves DataCrazy loss reasons)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loss_reasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    requires_justification BOOLEAN DEFAULT false,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, organization_id)
);

ALTER TABLE public.loss_reasons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.loss_reasons;
CREATE POLICY "Enable all access for authenticated users" ON public.loss_reasons
    FOR ALL TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 3. CONTACTS: Add metadata JSONB for extra DataCrazy fields
-- -----------------------------------------------------------------------------
ALTER TABLE public.contacts
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS instagram TEXT,
    ADD COLUMN IF NOT EXISTS tax_id TEXT,
    ADD COLUMN IF NOT EXISTS website TEXT,
    ADD COLUMN IF NOT EXISTS raw_phone TEXT,
    ADD COLUMN IF NOT EXISTS address JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS datacrazy_id UUID;

COMMENT ON COLUMN public.contacts.metadata IS 'Extra fields from DataCrazy migration (metrics, sourceReferral, lists, platform contacts, etc.)';
COMMENT ON COLUMN public.contacts.datacrazy_id IS 'Original DataCrazy lead ID for traceability';

-- Index for dedup during re-runs
CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_datacrazy_id
    ON public.contacts(datacrazy_id)
    WHERE datacrazy_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 4. DEALS: Add extra columns for DataCrazy fields
-- -----------------------------------------------------------------------------
ALTER TABLE public.deals
    ADD COLUMN IF NOT EXISTS datacrazy_id UUID,
    ADD COLUMN IF NOT EXISTS datacrazy_code INTEGER,
    ADD COLUMN IF NOT EXISTS loss_reason_text TEXT,
    ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS loss_reason_id UUID REFERENCES public.loss_reasons(id);

COMMENT ON COLUMN public.deals.datacrazy_id IS 'Original DataCrazy business ID for traceability';
COMMENT ON COLUMN public.deals.datacrazy_code IS 'DataCrazy sequential deal code';
COMMENT ON COLUMN public.deals.loss_reason_text IS 'DataCrazy justification text for lost deals';
COMMENT ON COLUMN public.deals.discount IS 'Discount amount from DataCrazy';

CREATE UNIQUE INDEX IF NOT EXISTS idx_deals_datacrazy_id
    ON public.deals(datacrazy_id)
    WHERE datacrazy_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 5. ACTIVITIES: Add extra columns for DataCrazy fields
-- -----------------------------------------------------------------------------
ALTER TABLE public.activities
    ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS datacrazy_id UUID,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE UNIQUE INDEX IF NOT EXISTS idx_activities_datacrazy_id
    ON public.activities(datacrazy_id)
    WHERE datacrazy_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 6. PRODUCTS: Add datacrazy_id for traceability
-- -----------------------------------------------------------------------------
ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS datacrazy_id UUID,
    ADD COLUMN IF NOT EXISTS image TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_datacrazy_id
    ON public.products(datacrazy_id)
    WHERE datacrazy_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 7. Realtime for new table
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'contact_tags') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE contact_tags;
    END IF;
END $$;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
