/**
 * Função pública `loadEnvFile` do projeto.
 * Implementação stub para browser - operações FS realizam no setup.ts (Node-only)
 *
 * @param {string} filePath - Parâmetro `filePath`.
 * @param {{ override?: boolean | undefined; } | undefined} opts - Parâmetro `opts`.
 * @returns {void} Não retorna valor.
 */
export function loadEnvFile(filePath: string, opts?: { override?: boolean }) {
  // No-op in browser context. Real implementation in test/setup.node.ts
}

/**
 * Função pública `requireEnv` do projeto.
 *
 * @param {string} name - Parâmetro `name`.
 * @returns {string} Retorna um valor do tipo `string`.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

/**
 * Função pública `getSupabaseUrl` do projeto.
 * @returns {string} Retorna um valor do tipo `string`.
 */
export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  );
}

/**
 * Função pública `getServiceRoleKey` do projeto.
 * Prefer new secret key format, fallback to legacy service_role key.
 * @returns {string} Retorna um valor do tipo `string`.
 */
export function getServiceRoleKey(): string {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

/**
 * Função pública `getAnonKey` do projeto.
 * Prefer new publishable key format, fallback to legacy anon key.
 * @returns {string} Retorna um valor do tipo `string`.
 */
export function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

/**
 * Função pública `isPlaceholderApiKey` do projeto.
 *
 * @param {string | null | undefined} value - Parâmetro `value`.
 * @returns {boolean} Retorna um valor do tipo `boolean`.
 */
export function isPlaceholderApiKey(value?: string | null): boolean {
  if (!value) return true;
  const v = value.trim();
  if (!v) return true;
  return v === 'your_google_ai_api_key' || v.startsWith('your_');
}
