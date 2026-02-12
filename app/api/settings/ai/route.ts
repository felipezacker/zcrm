import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { isAllowedOrigin } from '@/lib/security/sameOrigin';
import { AI_DEFAULT_MODELS } from '@/lib/ai/defaults';

function json<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

type Provider = 'google' | 'openai' | 'anthropic';

const UpdateOrgAISettingsSchema = z
  .object({
    aiEnabled: z.boolean().optional(),
    aiProvider: z.enum(['google', 'openai', 'anthropic']).optional(),
    aiModel: z.string().min(1).max(200).optional(),
    aiGoogleKey: z.string().optional(),
    aiOpenaiKey: z.string().optional(),
    aiAnthropicKey: z.string().optional(),
  })
  .strict();

/**
 * Handler HTTP `GET` deste endpoint (Next.js Route Handler).
 * @returns {Promise<Response>} Retorna um valor do tipo `Promise<Response>`.
 */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    return json({ error: 'Profile not found' }, 404);
  }

  // Fetch org AI settings (decrypted via RPC if secret available)
  const secret = process.env.AI_KEY_ENCRYPTION_SECRET;
  let orgSettings: any = null;
  let orgError: any = null;

  if (secret) {
    const { data: decrypted, error: rpcError } = await supabase.rpc('get_decrypted_org_settings', {
      p_org_id: profile.organization_id,
      p_secret: secret
    });
    if (!rpcError && decrypted && decrypted.length > 0) {
      orgSettings = decrypted[0];
    } else {
      if (rpcError) orgError = rpcError;
    }
  }

  if (!orgSettings) {
    const { data: legacySettings, error: legacyError } = await supabase
      .from('organization_settings')
      .select('ai_provider, ai_model, ai_google_key, ai_openai_key, ai_anthropic_key, ai_enabled')
      .eq('organization_id', profile.organization_id)
      .maybeSingle();
    orgSettings = legacySettings;
    if (legacyError) orgError = legacyError;
  }

  if (orgError) {
    return json({ error: orgError.message }, 500);
  }

  const aiEnabled = typeof orgSettings?.ai_enabled === 'boolean' ? orgSettings.ai_enabled : true;

  // Security: members should NOT receive raw API keys.
  if (profile.role !== 'admin') {
    return json({
      aiEnabled,
      aiProvider: (orgSettings?.ai_provider || 'google') as Provider,
      aiModel: orgSettings?.ai_model || AI_DEFAULT_MODELS.google,
      aiGoogleKey: '',
      aiOpenaiKey: '',
      aiAnthropicKey: '',
      aiHasGoogleKey: Boolean(orgSettings?.ai_google_key),
      aiHasOpenaiKey: Boolean(orgSettings?.ai_openai_key),
      aiHasAnthropicKey: Boolean(orgSettings?.ai_anthropic_key),
    });
  }

  return json({
    aiEnabled,
    aiProvider: (orgSettings?.ai_provider || 'google') as Provider,
    aiModel: orgSettings?.ai_model || AI_DEFAULT_MODELS.google,
    aiGoogleKey: orgSettings?.ai_google_key || '',
    aiOpenaiKey: orgSettings?.ai_openai_key || '',
    aiAnthropicKey: orgSettings?.ai_anthropic_key || '',
    aiHasGoogleKey: Boolean(orgSettings?.ai_google_key),
    aiHasOpenaiKey: Boolean(orgSettings?.ai_openai_key),
    aiHasAnthropicKey: Boolean(orgSettings?.ai_anthropic_key),
  });
}

/**
 * Handler HTTP `POST` deste endpoint (Next.js Route Handler).
 *
 * @param {Request} req - Objeto da requisição.
 * @returns {Promise<Response>} Retorna um valor do tipo `Promise<Response>`.
 */
export async function POST(req: Request) {
  // Mitigação CSRF: endpoint autenticado por cookies.
  if (!isAllowedOrigin(req)) {
    return json({ error: 'Forbidden' }, 403);
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile?.organization_id) {
    return json({ error: 'Profile not found' }, 404);
  }

  if (profile.role !== 'admin') {
    return json({ error: 'Forbidden' }, 403);
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = UpdateOrgAISettingsSchema.safeParse(rawBody);
  if (!parsed.success) {
    return json({ error: 'Invalid payload', details: parsed.error.flatten() }, 400);
  }

  const updates = parsed.data;

  // Normalize empty-string keys to null
  const normalizeKey = (value: string | undefined) => {
    if (value === undefined) return undefined;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  };

  const dbUpdates: Record<string, unknown> = {
    organization_id: profile.organization_id,
    updated_at: new Date().toISOString(),
  };

  const googleKey = normalizeKey(updates.aiGoogleKey);
  const openaiKey = normalizeKey(updates.aiOpenaiKey);
  const anthropicKey = normalizeKey(updates.aiAnthropicKey);

  const secret = process.env.AI_KEY_ENCRYPTION_SECRET;

  // If secret is set, we use the secure RPC to update settings (including encryption)
  if (secret) {
    const { error: rpcError } = await supabase.rpc('update_encrypted_org_settings', {
      p_org_id: profile.organization_id,
      p_secret: secret,
      p_ai_provider: updates.aiProvider,
      p_ai_model: updates.aiModel,
      p_ai_enabled: updates.aiEnabled,
      p_google_key: googleKey ?? undefined,
      p_openai_key: openaiKey ?? undefined,
      p_anthropic_key: anthropicKey ?? undefined
    });

    if (rpcError) {
      return json({ error: rpcError.message }, 500);
    }
  } else {
    // Fallback (legacy): update directly (plaintext)
    if (updates.aiEnabled !== undefined) dbUpdates.ai_enabled = updates.aiEnabled;
    if (updates.aiProvider !== undefined) dbUpdates.ai_provider = updates.aiProvider;
    if (updates.aiModel !== undefined) dbUpdates.ai_model = updates.aiModel;

    if (googleKey !== undefined) dbUpdates.ai_google_key = googleKey;
    if (openaiKey !== undefined) dbUpdates.ai_openai_key = openaiKey;
    if (anthropicKey !== undefined) dbUpdates.ai_anthropic_key = anthropicKey;

    const { error: upsertError } = await supabase
      .from('organization_settings')
      .upsert(dbUpdates, { onConflict: 'organization_id' });

    if (upsertError) {
      return json({ error: upsertError.message }, 500);
    }
  }

  return json({ ok: true });
}
