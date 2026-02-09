-- =============================================================================
-- MIGRATION: API Key Rotation & Management (Phase A.3)
-- =============================================================================
--
-- Purpose: Add key versioning for public API keys and scheduled rotation support.
--
-- Features:
--   1. Key version tracking on api_keys table
--   2. Scheduled rotation function (monthly)
--   3. Key expiry support
-- =============================================================================

-- =============================================================================
-- STEP 1: Add versioning and expiry to api_keys
-- =============================================================================

ALTER TABLE public.api_keys
ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE public.api_keys
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.api_keys
ADD COLUMN IF NOT EXISTS rotated_from UUID REFERENCES public.api_keys(id) DEFAULT NULL;

COMMENT ON COLUMN public.api_keys.version IS 'Key version number. Incremented on rotation.';
COMMENT ON COLUMN public.api_keys.expires_at IS 'When this key expires. NULL = no expiry.';
COMMENT ON COLUMN public.api_keys.rotated_from IS 'Reference to the previous key this was rotated from.';

-- =============================================================================
-- STEP 2: Key rotation function
-- =============================================================================

-- Rotate an API key: creates a new key and revokes the old one
-- Returns the new token (shown once to the user)
CREATE OR REPLACE FUNCTION public.rotate_api_key(p_api_key_id UUID)
RETURNS TABLE (
  new_api_key_id UUID,
  token TEXT,
  key_prefix TEXT,
  version INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  org_id UUID;
  old_key RECORD;
  new_token TEXT;
  new_prefix TEXT;
  new_hash TEXT;
  new_version INTEGER;
  new_id UUID;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get the old key
  SELECT ak.* INTO old_key
  FROM public.api_keys ak
  WHERE ak.id = p_api_key_id
    AND ak.revoked_at IS NULL;

  IF old_key IS NULL THEN
    RAISE EXCEPTION 'API key not found or already revoked';
  END IF;

  -- Verify ownership
  SELECT p.organization_id INTO org_id
  FROM public.profiles p
  WHERE p.id = uid;

  IF org_id IS NULL OR org_id != old_key.organization_id THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  -- Must be admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.organization_id = org_id AND p.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Forbidden: admin only';
  END IF;

  -- Generate new key
  new_token := public._api_key_make_token();
  new_prefix := left(new_token, 12);
  new_hash := public._api_key_sha256_hex(new_token);
  new_version := old_key.version + 1;

  -- Create new key
  INSERT INTO public.api_keys (
    organization_id, name, key_prefix, key_hash, created_by,
    version, rotated_from, updated_at
  )
  VALUES (
    old_key.organization_id,
    old_key.name || ' (v' || new_version || ')',
    new_prefix,
    new_hash,
    uid,
    new_version,
    old_key.id,
    NOW()
  )
  RETURNING id INTO new_id;

  -- Revoke old key
  UPDATE public.api_keys
  SET revoked_at = NOW(),
      updated_at = NOW()
  WHERE id = p_api_key_id;

  -- Return new key info
  new_api_key_id := new_id;
  token := new_token;
  key_prefix := new_prefix;
  version := new_version;
  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.rotate_api_key(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rotate_api_key(UUID) TO authenticated;

-- =============================================================================
-- STEP 3: Scheduled cleanup of expired keys
-- =============================================================================

-- Function to revoke expired keys (run via pg_cron or Edge Function)
CREATE OR REPLACE FUNCTION public.revoke_expired_api_keys()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  revoked_count INTEGER;
BEGIN
  UPDATE public.api_keys
  SET revoked_at = NOW(),
      updated_at = NOW()
  WHERE expires_at IS NOT NULL
    AND expires_at < NOW()
    AND revoked_at IS NULL;

  GET DIAGNOSTICS revoked_count = ROW_COUNT;
  RETURN revoked_count;
END;
$$;

-- =============================================================================
-- STEP 4: API key audit view (for admin dashboard)
-- =============================================================================

CREATE OR REPLACE VIEW public.api_key_audit AS
SELECT
  ak.id,
  ak.organization_id,
  ak.name,
  ak.key_prefix,
  ak.version,
  ak.created_at,
  ak.last_used_at,
  ak.revoked_at,
  ak.expires_at,
  ak.rotated_from,
  p.name AS created_by_name,
  p.email AS created_by_email,
  CASE
    WHEN ak.revoked_at IS NOT NULL THEN 'revoked'
    WHEN ak.expires_at IS NOT NULL AND ak.expires_at < NOW() THEN 'expired'
    ELSE 'active'
  END AS status
FROM public.api_keys ak
LEFT JOIN public.profiles p ON p.id = ak.created_by;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
COMMENT ON FUNCTION public.rotate_api_key IS
  'Rotates an API key: creates new key with incremented version and revokes the old one.';
COMMENT ON FUNCTION public.revoke_expired_api_keys IS
  'Revokes all expired API keys. Run via pg_cron or scheduled Edge Function.';
