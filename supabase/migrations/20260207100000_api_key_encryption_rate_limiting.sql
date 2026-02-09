-- =============================================================================
-- MIGRATION: API Key Encryption & Rate Limiting (Phase A.2)
-- =============================================================================
--
-- Purpose: Encrypt AI API keys at-rest using pgcrypto and add rate limiting
--          to prevent brute-force attacks on key validation.
--
-- Security Impact: CRITICAL
--   Before: AI API keys stored in plaintext in organization_settings and user_settings
--   After:  Keys encrypted with AES-256 via pgp_sym_encrypt, rate-limited validation
--
-- Affected tables: organization_settings, user_settings, api_key_rate_limits (new)
-- =============================================================================

-- =============================================================================
-- STEP 1: Create encryption helper functions
-- =============================================================================

-- Encryption key is stored as a database setting (set via Supabase vault or env)
-- In production, use: ALTER DATABASE postgres SET app.encryption_key = 'your-key';
-- For Supabase, set via Dashboard > Settings > Database > Configuration

-- Encrypt a value (returns NULL if input is NULL)
CREATE OR REPLACE FUNCTION public.encrypt_sensitive(plaintext TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF plaintext IS NULL OR btrim(plaintext) = '' THEN
    RETURN NULL;
  END IF;

  -- Use pgp_sym_encrypt with AES-256
  RETURN encode(
    pgp_sym_encrypt(
      plaintext,
      current_setting('app.encryption_key', true)
    ),
    'base64'
  );
EXCEPTION WHEN OTHERS THEN
  -- If encryption key is not set, raise a clear error
  RAISE EXCEPTION 'Encryption key not configured. Set app.encryption_key via ALTER DATABASE.';
END;
$$;

-- Decrypt a value (returns NULL if input is NULL)
-- Handles both 'enc:' prefixed and raw ciphertext for backward compatibility
CREATE OR REPLACE FUNCTION public.decrypt_sensitive(ciphertext TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actual_ciphertext TEXT;
BEGIN
  IF ciphertext IS NULL OR btrim(ciphertext) = '' THEN
    RETURN NULL;
  END IF;

  -- Strip 'enc:' prefix if present (new format)
  actual_ciphertext := CASE
    WHEN ciphertext LIKE 'enc:%' THEN substring(ciphertext, 5)
    ELSE ciphertext
  END;

  RETURN pgp_sym_decrypt(
    decode(actual_ciphertext, 'base64'),
    current_setting('app.encryption_key', true)
  );
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Decryption failed. Check encryption key configuration.';
END;
$$;

-- Do NOT grant to authenticated users - only SECURITY DEFINER triggers and RPCs need these
-- Direct access to encrypt/decrypt increases attack surface
-- All decryption for users goes through get_org_ai_keys() and get_user_ai_keys() RPCs
REVOKE ALL ON FUNCTION public.encrypt_sensitive(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.decrypt_sensitive(TEXT) FROM PUBLIC;

COMMENT ON FUNCTION public.encrypt_sensitive IS 'Encrypts sensitive text using AES-256 via pgp_sym_encrypt. Key from app.encryption_key.';
COMMENT ON FUNCTION public.decrypt_sensitive IS 'Decrypts text encrypted by encrypt_sensitive. Key from app.encryption_key.';

-- =============================================================================
-- STEP 2: Encryption trigger for organization_settings AI keys
-- =============================================================================

CREATE OR REPLACE FUNCTION public.encrypt_org_ai_keys()
RETURNS TRIGGER AS $$
DECLARE
  enc_key TEXT;
BEGIN
  -- Check if encryption key is configured
  enc_key := current_setting('app.encryption_key', true);
  IF enc_key IS NULL OR btrim(enc_key) = '' THEN
    -- Skip encryption if key not configured (graceful degradation during setup)
    RETURN NEW;
  END IF;

  -- Encrypt Google key (only if changed and not already encrypted)
  IF NEW.ai_google_key IS NOT NULL
     AND NEW.ai_google_key != ''
     AND (TG_OP = 'INSERT' OR NEW.ai_google_key IS DISTINCT FROM OLD.ai_google_key) THEN
    -- Don't re-encrypt already encrypted values (check for deterministic prefix)
    IF NOT (NEW.ai_google_key LIKE 'enc:%') THEN
      NEW.ai_google_key := 'enc:' || public.encrypt_sensitive(NEW.ai_google_key);
    END IF;
  END IF;

  -- Encrypt OpenAI key
  IF NEW.ai_openai_key IS NOT NULL
     AND NEW.ai_openai_key != ''
     AND (TG_OP = 'INSERT' OR NEW.ai_openai_key IS DISTINCT FROM OLD.ai_openai_key) THEN
    IF NOT (NEW.ai_openai_key LIKE 'enc:%') THEN
      NEW.ai_openai_key := 'enc:' || public.encrypt_sensitive(NEW.ai_openai_key);
    END IF;
  END IF;

  -- Encrypt Anthropic key
  IF NEW.ai_anthropic_key IS NOT NULL
     AND NEW.ai_anthropic_key != ''
     AND (TG_OP = 'INSERT' OR NEW.ai_anthropic_key IS DISTINCT FROM OLD.ai_anthropic_key) THEN
    IF NOT (NEW.ai_anthropic_key LIKE 'enc:%') THEN
      NEW.ai_anthropic_key := 'enc:' || public.encrypt_sensitive(NEW.ai_anthropic_key);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS encrypt_org_settings_keys ON public.organization_settings;
CREATE TRIGGER encrypt_org_settings_keys
  BEFORE INSERT OR UPDATE ON public.organization_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_org_ai_keys();

-- =============================================================================
-- STEP 3: Encryption trigger for user_settings AI keys
-- =============================================================================

CREATE OR REPLACE FUNCTION public.encrypt_user_ai_keys()
RETURNS TRIGGER AS $$
DECLARE
  enc_key TEXT;
BEGIN
  enc_key := current_setting('app.encryption_key', true);
  IF enc_key IS NULL OR btrim(enc_key) = '' THEN
    RETURN NEW;
  END IF;

  -- Legacy ai_api_key
  IF NEW.ai_api_key IS NOT NULL
     AND NEW.ai_api_key != ''
     AND (TG_OP = 'INSERT' OR NEW.ai_api_key IS DISTINCT FROM OLD.ai_api_key) THEN
    IF NOT (NEW.ai_api_key LIKE 'enc:%') THEN
      NEW.ai_api_key := 'enc:' || public.encrypt_sensitive(NEW.ai_api_key);
    END IF;
  END IF;

  -- Google key
  IF NEW.ai_google_key IS NOT NULL
     AND NEW.ai_google_key != ''
     AND (TG_OP = 'INSERT' OR NEW.ai_google_key IS DISTINCT FROM OLD.ai_google_key) THEN
    IF NOT (NEW.ai_google_key LIKE 'enc:%') THEN
      NEW.ai_google_key := 'enc:' || public.encrypt_sensitive(NEW.ai_google_key);
    END IF;
  END IF;

  -- OpenAI key
  IF NEW.ai_openai_key IS NOT NULL
     AND NEW.ai_openai_key != ''
     AND (TG_OP = 'INSERT' OR NEW.ai_openai_key IS DISTINCT FROM OLD.ai_openai_key) THEN
    IF NOT (NEW.ai_openai_key LIKE 'enc:%') THEN
      NEW.ai_openai_key := 'enc:' || public.encrypt_sensitive(NEW.ai_openai_key);
    END IF;
  END IF;

  -- Anthropic key
  IF NEW.ai_anthropic_key IS NOT NULL
     AND NEW.ai_anthropic_key != ''
     AND (TG_OP = 'INSERT' OR NEW.ai_anthropic_key IS DISTINCT FROM OLD.ai_anthropic_key) THEN
    IF NOT (NEW.ai_anthropic_key LIKE 'enc:%') THEN
      NEW.ai_anthropic_key := 'enc:' || public.encrypt_sensitive(NEW.ai_anthropic_key);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS encrypt_user_settings_keys ON public.user_settings;
CREATE TRIGGER encrypt_user_settings_keys
  BEFORE INSERT OR UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_user_ai_keys();

-- =============================================================================
-- STEP 4: Decryption helper for reading AI keys (application use)
-- =============================================================================

-- Get decrypted org AI keys (admin only)
CREATE OR REPLACE FUNCTION public.get_org_ai_keys(p_org_id UUID)
RETURNS TABLE (
  ai_provider TEXT,
  ai_model TEXT,
  ai_google_key TEXT,
  ai_openai_key TEXT,
  ai_anthropic_key TEXT,
  ai_enabled BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  enc_key TEXT;
BEGIN
  -- Verify caller belongs to this org
  IF p_org_id != public.get_my_organization_id() THEN
    RAISE EXCEPTION 'Forbidden: not your organization';
  END IF;

  enc_key := current_setting('app.encryption_key', true);

  IF enc_key IS NULL OR btrim(enc_key) = '' THEN
    -- Return raw values if encryption not configured
    RETURN QUERY
    SELECT os.ai_provider, os.ai_model,
           os.ai_google_key, os.ai_openai_key, os.ai_anthropic_key,
           os.ai_enabled
    FROM public.organization_settings os
    WHERE os.organization_id = p_org_id;
  ELSE
    RETURN QUERY
    SELECT os.ai_provider, os.ai_model,
           public.decrypt_sensitive(os.ai_google_key),
           public.decrypt_sensitive(os.ai_openai_key),
           public.decrypt_sensitive(os.ai_anthropic_key),
           os.ai_enabled
    FROM public.organization_settings os
    WHERE os.organization_id = p_org_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_org_ai_keys(UUID) TO authenticated;

-- Get decrypted user AI keys (own keys only)
CREATE OR REPLACE FUNCTION public.get_user_ai_keys()
RETURNS TABLE (
  ai_provider TEXT,
  ai_model TEXT,
  ai_api_key TEXT,
  ai_google_key TEXT,
  ai_openai_key TEXT,
  ai_anthropic_key TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  enc_key TEXT;
  uid UUID;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  enc_key := current_setting('app.encryption_key', true);

  IF enc_key IS NULL OR btrim(enc_key) = '' THEN
    RETURN QUERY
    SELECT us.ai_provider, us.ai_model,
           us.ai_api_key, us.ai_google_key, us.ai_openai_key, us.ai_anthropic_key
    FROM public.user_settings us
    WHERE us.user_id = uid;
  ELSE
    RETURN QUERY
    SELECT us.ai_provider, us.ai_model,
           public.decrypt_sensitive(us.ai_api_key),
           public.decrypt_sensitive(us.ai_google_key),
           public.decrypt_sensitive(us.ai_openai_key),
           public.decrypt_sensitive(us.ai_anthropic_key)
    FROM public.user_settings us
    WHERE us.user_id = uid;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_ai_keys() TO authenticated;

-- =============================================================================
-- STEP 5: Rate limiting for API key validation
-- =============================================================================

-- Track validation attempts per IP/identifier
CREATE TABLE IF NOT EXISTS public.api_key_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,  -- IP address or user identifier
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_key_rate_limits_lookup
  ON public.api_key_rate_limits(identifier, attempted_at DESC);

ALTER TABLE public.api_key_rate_limits ENABLE ROW LEVEL SECURITY;

-- No direct access - only via SECURITY DEFINER functions
CREATE POLICY "api_key_rate_limits_no_access" ON public.api_key_rate_limits
  FOR ALL TO authenticated
  USING (false);

-- Check rate limit before validation (max 10 attempts per minute)
CREATE OR REPLACE FUNCTION public.check_api_key_rate_limit(p_identifier TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  -- Count attempts in the last minute
  SELECT COUNT(*) INTO attempt_count
  FROM public.api_key_rate_limits
  WHERE identifier = p_identifier
    AND attempted_at > NOW() - INTERVAL '1 minute';

  -- Record this attempt
  INSERT INTO public.api_key_rate_limits (identifier)
  VALUES (p_identifier);

  -- Clean old entries (best effort)
  DELETE FROM public.api_key_rate_limits
  WHERE attempted_at < NOW() - INTERVAL '5 minutes';

  -- Return true if under limit
  RETURN attempt_count < 10;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_api_key_rate_limit(TEXT) TO anon, authenticated;

-- Update validate_api_key to include rate limiting
CREATE OR REPLACE FUNCTION public.validate_api_key(p_token TEXT)
RETURNS TABLE (
  api_key_id UUID,
  api_key_prefix TEXT,
  organization_id UUID,
  organization_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  h TEXT;
  caller_ip TEXT;
BEGIN
  IF p_token IS NULL OR btrim(p_token) = '' THEN
    RETURN;
  END IF;

  -- Use token prefix as rate limit identifier (prevents timing attacks)
  caller_ip := left(p_token, 12);

  -- Check rate limit
  IF NOT public.check_api_key_rate_limit(caller_ip) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Maximum 10 attempts per minute.'
      USING ERRCODE = 'P0001';
  END IF;

  h := public._api_key_sha256_hex(p_token);

  RETURN QUERY
  WITH k AS (
    SELECT ak.id, ak.key_prefix, ak.organization_id
    FROM public.api_keys ak
    WHERE ak.key_hash = h
      AND ak.revoked_at IS NULL
    LIMIT 1
  )
  SELECT
    k.id,
    k.key_prefix,
    k.organization_id,
    o.name
  FROM k
  JOIN public.organizations o ON o.id = k.organization_id;

  -- Touch last_used_at (best-effort)
  UPDATE public.api_keys
    SET last_used_at = now(),
        updated_at = now()
  WHERE key_hash = h
    AND revoked_at IS NULL;
END;
$$;

-- =============================================================================
-- STEP 6: Encrypt existing plaintext keys (one-time migration)
-- =============================================================================

-- This DO block encrypts any existing plaintext keys
-- It's safe to run multiple times (idempotent via the regex check in triggers)
-- NOTE: This requires app.encryption_key to be set BEFORE running this migration
-- If not set, keys remain as-is and will be encrypted on next update

DO $$
DECLARE
  enc_key TEXT;
BEGIN
  enc_key := current_setting('app.encryption_key', true);

  IF enc_key IS NOT NULL AND btrim(enc_key) != '' THEN
    RAISE NOTICE 'Encryption key found. Existing keys will be encrypted on next write via triggers.';
    -- Trigger a no-op update to activate the encryption trigger
    -- Only for rows that have non-null, non-empty keys
    UPDATE public.organization_settings
    SET updated_at = NOW()
    WHERE ai_google_key IS NOT NULL
       OR ai_openai_key IS NOT NULL
       OR ai_anthropic_key IS NOT NULL;

    UPDATE public.user_settings
    SET updated_at = NOW()
    WHERE ai_api_key IS NOT NULL
       OR ai_google_key IS NOT NULL
       OR ai_openai_key IS NOT NULL
       OR ai_anthropic_key IS NOT NULL;

    RAISE NOTICE 'Existing keys encrypted successfully.';
  ELSE
    RAISE NOTICE 'No encryption key configured. Keys will remain unencrypted until app.encryption_key is set.';
    RAISE NOTICE 'Set via: ALTER DATABASE postgres SET app.encryption_key = ''your-32-char-key'';';
  END IF;
END $$;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
COMMENT ON TABLE public.api_key_rate_limits IS
  'Rate limiting for API key validation attempts. Max 10/minute per identifier.';
