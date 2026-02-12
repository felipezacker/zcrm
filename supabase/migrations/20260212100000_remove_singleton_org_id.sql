-- Migration: Remove singleton org function and update user trigger
-- Task: [DEBT-003] Remove get_singleton_organization_id
-- Author: Architect Agent (via AIOS Master)
-- Date: 2026-02-12

-- Goal: Remove the security risk of auto-assigning users to a random "singleton" organization.
-- New Logic: Users MUST have an organization_id in metadata OR have a valid pending invite.

-- 1. Update the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_org_id uuid;
    v_role text;
    v_name text;
BEGIN
    -- 1. Try to get organization from metadata (Set by Installer or Admin console)
    v_org_id := (new.raw_user_meta_data->>'organization_id')::uuid;
    v_role := COALESCE(new.raw_user_meta_data->>'role', 'user');
    v_name := COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

    -- 2. If not found, check for valid pending invites
    IF v_org_id IS NULL THEN
        SELECT organization_id, role INTO v_org_id, v_role
        FROM public.organization_invites
        WHERE email = new.email 
          AND used_at IS NULL
          AND (expires_at IS NULL OR expires_at > NOW())
        ORDER BY created_at DESC
        LIMIT 1;
        
        -- Note: We don't mark invite as used here because that usually happens 
        -- explicitly when the user clicks the invite link. 
        -- This logic is just a safety net to ensure they land in the right place.
    END IF;

    -- 3. If still null, BLOCK creation (Security enforcement)
    IF v_org_id IS NULL THEN
        RAISE EXCEPTION 'Security Policy: User must belong to an organization. No invite or organization_id found for %.', new.email;
    END IF;

    -- 4. Create Profile
    INSERT INTO public.profiles (id, email, name, avatar, role, organization_id)
    VALUES (
        new.id,
        new.email,
        v_name,
        new.raw_user_meta_data->>'avatar_url',
        v_role,
        v_org_id
    );

    -- 5. Create User Settings (idempotent)
    INSERT INTO public.user_settings (user_id)
    VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the dangerous function
DROP FUNCTION IF EXISTS public.get_singleton_organization_id();
