-- =============================================================================
-- ROLLBACK: RLS Organization Isolation (Phase A.1)
-- =============================================================================
-- Run this ONLY if you need to revert to the previous permissive policies.
-- WARNING: This will REMOVE organization isolation and revert to USING(true).
-- =============================================================================

-- Drop new org-isolated policies
DROP POLICY IF EXISTS "org_isolation_select" ON public.organizations;
DROP POLICY IF EXISTS "org_isolation_update" ON public.organizations;
DROP POLICY IF EXISTS "profiles_org_select" ON public.profiles;
DROP POLICY IF EXISTS "boards_org_select" ON public.boards;
DROP POLICY IF EXISTS "boards_org_insert" ON public.boards;
DROP POLICY IF EXISTS "boards_org_update" ON public.boards;
DROP POLICY IF EXISTS "boards_org_delete" ON public.boards;
DROP POLICY IF EXISTS "board_stages_org_select" ON public.board_stages;
DROP POLICY IF EXISTS "board_stages_org_insert" ON public.board_stages;
DROP POLICY IF EXISTS "board_stages_org_update" ON public.board_stages;
DROP POLICY IF EXISTS "board_stages_org_delete" ON public.board_stages;
DROP POLICY IF EXISTS "lifecycle_stages_read" ON public.lifecycle_stages;
DROP POLICY IF EXISTS "crm_companies_org_all" ON public.crm_companies;
DROP POLICY IF EXISTS "contacts_org_all" ON public.contacts;
DROP POLICY IF EXISTS "products_org_all" ON public.products;
DROP POLICY IF EXISTS "deals_org_all" ON public.deals;
DROP POLICY IF EXISTS "deal_items_org_all" ON public.deal_items;
DROP POLICY IF EXISTS "activities_org_all" ON public.activities;
DROP POLICY IF EXISTS "tags_org_all" ON public.tags;
DROP POLICY IF EXISTS "custom_field_definitions_org_all" ON public.custom_field_definitions;
DROP POLICY IF EXISTS "leads_org_all" ON public.leads;
DROP POLICY IF EXISTS "deal_notes_org_all" ON public.deal_notes;
DROP POLICY IF EXISTS "deal_files_org_all" ON public.deal_files;
DROP POLICY IF EXISTS "system_notifications_org_all" ON public.system_notifications;
DROP POLICY IF EXISTS "security_alerts_org_all" ON public.security_alerts;
DROP POLICY IF EXISTS "ai_conversations_user_all" ON public.ai_conversations;
DROP POLICY IF EXISTS "ai_decisions_user_all" ON public.ai_decisions;
DROP POLICY IF EXISTS "ai_audio_notes_user_all" ON public.ai_audio_notes;
DROP POLICY IF EXISTS "ai_suggestion_interactions_user_all" ON public.ai_suggestion_interactions;
DROP POLICY IF EXISTS "user_consents_user_all" ON public.user_consents;
DROP POLICY IF EXISTS "audit_logs_org_select" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_insert" ON public.audit_logs;
DROP POLICY IF EXISTS "rate_limits_service_only" ON public.rate_limits;

-- Restore original permissive policies (idempotent: drop if exists before create)
DROP POLICY IF EXISTS "authenticated_access" ON public.organizations;
CREATE POLICY "authenticated_access" ON public.organizations FOR ALL TO authenticated USING (deleted_at IS NULL) WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.boards;
CREATE POLICY "Enable read access for authenticated users" ON public.boards FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.boards;
CREATE POLICY "Enable insert access for authenticated users" ON public.boards FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.boards;
CREATE POLICY "Enable update access for authenticated users" ON public.boards FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.boards;
CREATE POLICY "Enable delete access for authenticated users" ON public.boards FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.board_stages;
CREATE POLICY "Enable read access for authenticated users" ON public.board_stages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.board_stages;
CREATE POLICY "Enable insert access for authenticated users" ON public.board_stages FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.board_stages;
CREATE POLICY "Enable update access for authenticated users" ON public.board_stages FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.board_stages;
CREATE POLICY "Enable delete access for authenticated users" ON public.board_stages FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.lifecycle_stages;
CREATE POLICY "Enable all access for authenticated users" ON public.lifecycle_stages FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.crm_companies;
CREATE POLICY "Enable all access for authenticated users" ON public.crm_companies FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.contacts;
CREATE POLICY "Enable all access for authenticated users" ON public.contacts FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.products;
CREATE POLICY "Enable all access for authenticated users" ON public.products FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.deals;
CREATE POLICY "Enable all access for authenticated users" ON public.deals FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.deal_items;
CREATE POLICY "Enable all access for authenticated users" ON public.deal_items FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.activities;
CREATE POLICY "Enable all access for authenticated users" ON public.activities FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.tags;
CREATE POLICY "Enable all access for authenticated users" ON public.tags FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.custom_field_definitions;
CREATE POLICY "Enable all access for authenticated users" ON public.custom_field_definitions FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.leads;
CREATE POLICY "Enable all access for authenticated users" ON public.leads FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "deal_notes_access" ON public.deal_notes;
CREATE POLICY "deal_notes_access" ON public.deal_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "deal_files_access" ON public.deal_files;
CREATE POLICY "deal_files_access" ON public.deal_files FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_conversations;
CREATE POLICY "Enable all access for authenticated users" ON public.ai_conversations FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_decisions;
CREATE POLICY "Enable all access for authenticated users" ON public.ai_decisions FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_audio_notes;
CREATE POLICY "Enable all access for authenticated users" ON public.ai_audio_notes FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.ai_suggestion_interactions;
CREATE POLICY "Enable all access for authenticated users" ON public.ai_suggestion_interactions FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.system_notifications;
CREATE POLICY "Enable all access for authenticated users" ON public.system_notifications FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.rate_limits;
CREATE POLICY "Enable all access for authenticated users" ON public.rate_limits FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.user_consents;
CREATE POLICY "Enable all access for authenticated users" ON public.user_consents FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.audit_logs;
CREATE POLICY "Enable all access for authenticated users" ON public.audit_logs FOR ALL TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.security_alerts;
CREATE POLICY "Enable all access for authenticated users" ON public.security_alerts FOR ALL TO authenticated USING (true);
