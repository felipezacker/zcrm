-- ============================================
-- Performance Indexes v2 - Brownfield Discovery
-- ============================================
-- TECH-001: Complementa índices identificados no DB-AUDIT
-- Foco: owner_id, organization_id com partial indexes,
-- e índices faltantes para queries filtradas por deleted_at.
-- ============================================

-- DEALS: Índice parcial para deals ativos por board
CREATE INDEX IF NOT EXISTS idx_deals_board_active
    ON public.deals (board_id)
    WHERE deleted_at IS NULL;

-- DEALS: Índice parcial para deals por status (dashboard stats)
CREATE INDEX IF NOT EXISTS idx_deals_won_lost
    ON public.deals (is_won, is_lost)
    WHERE deleted_at IS NULL;

-- DEALS: owner_id para filtro "meus deals"
CREATE INDEX IF NOT EXISTS idx_deals_owner_id
    ON public.deals (owner_id);

-- DEALS: organization_id para multi-tenant queries
CREATE INDEX IF NOT EXISTS idx_deals_org_id
    ON public.deals (organization_id)
    WHERE deleted_at IS NULL;

-- CONTACTS: organization_id filtrado
CREATE INDEX IF NOT EXISTS idx_contacts_org_active
    ON public.contacts (organization_id)
    WHERE deleted_at IS NULL;

-- CONTACTS: owner_id para filtro "meus contatos"
CREATE INDEX IF NOT EXISTS idx_contacts_owner_id
    ON public.contacts (owner_id);

-- ACTIVITIES: Índice parcial por data (dashboard, calendário)
CREATE INDEX IF NOT EXISTS idx_activities_date_active
    ON public.activities (date)
    WHERE deleted_at IS NULL;

-- ACTIVITIES: organization_id
CREATE INDEX IF NOT EXISTS idx_activities_org_id
    ON public.activities (organization_id)
    WHERE deleted_at IS NULL;

-- PROFILES: email lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email
    ON public.profiles (email);

-- CRM_COMPANIES: organization_id filtrado
CREATE INDEX IF NOT EXISTS idx_crm_companies_org_active
    ON public.crm_companies (organization_id)
    WHERE deleted_at IS NULL;

-- BOARDS: organization_id filtrado
CREATE INDEX IF NOT EXISTS idx_boards_org_active
    ON public.boards (organization_id)
    WHERE deleted_at IS NULL;

-- AI_DECISIONS: user_id + status para inbox
CREATE INDEX IF NOT EXISTS idx_ai_decisions_user_status
    ON public.ai_decisions (user_id, status);

-- AI_DECISIONS: deal_id para contexto
CREATE INDEX IF NOT EXISTS idx_ai_decisions_deal_id
    ON public.ai_decisions (deal_id);

-- LEADS: status para filtro
CREATE INDEX IF NOT EXISTS idx_leads_status
    ON public.leads (status);

-- LEADS: organization_id
CREATE INDEX IF NOT EXISTS idx_leads_org_id
    ON public.leads (organization_id);

-- Comments
COMMENT ON INDEX idx_deals_board_active IS 'Performance: deals ativos por pipeline (partial index)';
COMMENT ON INDEX idx_deals_won_lost IS 'Performance: dashboard stats por status won/lost';
COMMENT ON INDEX idx_deals_owner_id IS 'Performance: filtro meus deals';
COMMENT ON INDEX idx_deals_org_id IS 'Performance: deals por organização (multi-tenant)';
COMMENT ON INDEX idx_contacts_org_active IS 'Performance: contatos ativos por org';
COMMENT ON INDEX idx_contacts_owner_id IS 'Performance: filtro meus contatos';
COMMENT ON INDEX idx_activities_date_active IS 'Performance: atividades ativas por data (calendar)';
COMMENT ON INDEX idx_activities_org_id IS 'Performance: atividades por organização';
COMMENT ON INDEX idx_profiles_email IS 'Performance: lookup por email';
COMMENT ON INDEX idx_crm_companies_org_active IS 'Performance: empresas ativas por org';
COMMENT ON INDEX idx_boards_org_active IS 'Performance: boards ativos por org';
COMMENT ON INDEX idx_ai_decisions_user_status IS 'Performance: AI inbox por user+status';
COMMENT ON INDEX idx_ai_decisions_deal_id IS 'Performance: AI decisions por deal';
COMMENT ON INDEX idx_leads_status IS 'Performance: leads por status';
COMMENT ON INDEX idx_leads_org_id IS 'Performance: leads por organização';
