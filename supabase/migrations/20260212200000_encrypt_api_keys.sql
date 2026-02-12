-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add encrypted columns to organization_settings
ALTER TABLE organization_settings
ADD COLUMN IF NOT EXISTS encrypted_ai_google_key text,
ADD COLUMN IF NOT EXISTS encrypted_ai_openai_key text,
ADD COLUMN IF NOT EXISTS encrypted_ai_anthropic_key text;

-- Function to get decrypted settings
-- SECURITY: This function allows retrieving the keys if the valid secret is provided.
-- It should be called ONLY from secure server-side environments (Edge Functions, Next.js API Routes).
CREATE OR REPLACE FUNCTION get_decrypted_org_settings(p_org_id uuid, p_secret text)
RETURNS TABLE (
    ai_provider text,
    ai_model text,
    ai_enabled boolean,
    ai_google_key text,
    ai_openai_key text,
    ai_anthropic_key text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        os.ai_provider,
        os.ai_model,
        os.ai_enabled,
        -- Decrypt or fallback to legacy plaintext (during migration)
        COALESCE(
            pgp_sym_decrypt(os.encrypted_ai_google_key::bytea, p_secret)::text,
            os.ai_google_key
        ) as ai_google_key,
        COALESCE(
            pgp_sym_decrypt(os.encrypted_ai_openai_key::bytea, p_secret)::text,
            os.ai_openai_key
        ) as ai_openai_key,
        COALESCE(
            pgp_sym_decrypt(os.encrypted_ai_anthropic_key::bytea, p_secret)::text,
            os.ai_anthropic_key
        ) as ai_anthropic_key
    FROM organization_settings os
    WHERE os.organization_id = p_org_id;
END;
$$;

-- Function to update settings with encryption
CREATE OR REPLACE FUNCTION update_encrypted_org_settings(
    p_org_id uuid,
    p_secret text,
    p_ai_provider text DEFAULT NULL,
    p_ai_model text DEFAULT NULL,
    p_ai_enabled boolean DEFAULT NULL,
    p_google_key text DEFAULT NULL,
    p_openai_key text DEFAULT NULL,
    p_anthropic_key text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update if exists
    UPDATE organization_settings
    SET
        ai_provider = COALESCE(p_ai_provider, ai_provider),
        ai_model = COALESCE(p_ai_model, ai_model),
        ai_enabled = COALESCE(p_ai_enabled, ai_enabled),
        encrypted_ai_google_key = CASE 
            WHEN p_google_key IS NOT NULL AND p_google_key <> '' THEN pgp_sym_encrypt(p_google_key, p_secret)
            ELSE encrypted_ai_google_key 
        END,
        encrypted_ai_openai_key = CASE 
            WHEN p_openai_key IS NOT NULL AND p_openai_key <> '' THEN pgp_sym_encrypt(p_openai_key, p_secret)
            ELSE encrypted_ai_openai_key 
        END,
        encrypted_ai_anthropic_key = CASE 
            WHEN p_anthropic_key IS NOT NULL AND p_anthropic_key <> '' THEN pgp_sym_encrypt(p_anthropic_key, p_secret)
            ELSE encrypted_ai_anthropic_key 
        END,
        -- Clear plaintext keys if new encrypted key is provided
        ai_google_key = CASE WHEN p_google_key IS NOT NULL AND p_google_key <> '' THEN NULL ELSE ai_google_key END,
        ai_openai_key = CASE WHEN p_openai_key IS NOT NULL AND p_openai_key <> '' THEN NULL ELSE ai_openai_key END,
        ai_anthropic_key = CASE WHEN p_anthropic_key IS NOT NULL AND p_anthropic_key <> '' THEN NULL ELSE ai_anthropic_key END,
        updated_at = now()
    WHERE organization_id = p_org_id;
    
    -- Insert if not exists (fallback for first-time setup)
    IF NOT FOUND THEN
        INSERT INTO organization_settings (
            organization_id, 
            ai_provider, 
            ai_model, 
            ai_enabled, 
            encrypted_ai_google_key, 
            encrypted_ai_openai_key, 
            encrypted_ai_anthropic_key
        )
        VALUES (
            p_org_id,
            COALESCE(p_ai_provider, 'google'),
            COALESCE(p_ai_model, 'gemini-1.5-flash'),
            COALESCE(p_ai_enabled, true),
            CASE WHEN p_google_key IS NOT NULL AND p_google_key <> '' THEN pgp_sym_encrypt(p_google_key, p_secret) ELSE NULL END,
            CASE WHEN p_openai_key IS NOT NULL AND p_openai_key <> '' THEN pgp_sym_encrypt(p_openai_key, p_secret) ELSE NULL END,
            CASE WHEN p_anthropic_key IS NOT NULL AND p_anthropic_key <> '' THEN pgp_sym_encrypt(p_anthropic_key, p_secret) ELSE NULL END
        );
    END IF;
END;
$$;
