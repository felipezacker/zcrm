-- Migration: Add partial indexes for soft delete columns
-- Task: [DEBT-002] Add Partial Indexes for Soft Delete
-- Author: Data Engineer Agent
-- Date: 2026-02-12

-- Goal: Optimize queries that filter out deleted records (WHERE deleted_at IS NULL).
-- This significantly reduces index size and scan time for the active dataset.

-- 1. Deals
CREATE INDEX IF NOT EXISTS idx_deals_active 
ON public.deals (id) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_deals_owner_active 
ON public.deals (owner_id) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_deals_stage_active 
ON public.deals (stage_id) 
WHERE deleted_at IS NULL;

-- 2. Contacts
CREATE INDEX IF NOT EXISTS idx_contacts_active 
ON public.contacts (id) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_contacts_owner_active 
ON public.contacts (owner_id) 
WHERE deleted_at IS NULL;

-- 3. Activities
CREATE INDEX IF NOT EXISTS idx_activities_active 
ON public.activities (id) 
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_activities_deal_active 
ON public.activities (deal_id) 
WHERE deleted_at IS NULL;

-- 4. Organizations (For multi-tenant lookups)
CREATE INDEX IF NOT EXISTS idx_organizations_active 
ON public.organizations (id) 
WHERE deleted_at IS NULL;

-- 5. Products (SKIPPED: products table does not have deleted_at column)

-- Verification Comment (for review):
-- These indexes are "partial", meaning they only contain keys for rows where deleted_at IS NULL.
-- This makes them much smaller than full indexes and strictly enforces the soft-delete pattern efficiency.
