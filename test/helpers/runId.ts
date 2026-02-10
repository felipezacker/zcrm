let cached: string | null = null;

/**
 * Função pública `getRunId` do projeto.
 *
 * @param {string} prefix - Parâmetro `prefix`.
 * @returns {string} Retorna um valor do tipo `string`.
 */
export function getRunId(prefix = 'vitest'): string {
  if (cached) return cached;
  // Use browser-compatible UUID generation (via crypto.getRandomValues)
  // Real UUID from Node.js is set by load-env.cjs if available
  cached = globalThis.__VITEST_RUN_ID__ || `${prefix}_${generateUUID()}`;
  return cached;
}

// Browser-compatible UUID v4 generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
