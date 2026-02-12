import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

function json<T>(body: T, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
    },
  });
}

/**
 * Verifica se a instância já foi inicializada.
 * Endpoint público (não requer autenticação) para uso nas páginas de instalação.
 * 
 * @returns {Promise<Response>} Retorna { initialized: boolean }
 */
export async function GET() {
  // Bypass em desenvolvimento local: sempre permite acesso ao wizard
  if (process.env.NODE_ENV === 'development') {
    logger.debug('[check-initialized] Development mode: bypassing initialization check');
    return json({ initialized: false });
  }

  try {
    const supabase = await createClient();

    // is_instance_initialized tem GRANT para anon/authenticated
    const { data, error } = await supabase.rpc('is_instance_initialized');

    if (error) {
      // Em caso de erro, assumimos que não está inicializado para não bloquear o wizard
      logger.warn({ error }, '[check-initialized] Error checking initialization');
      return json({ initialized: false });
    }

    return json({ initialized: data === true });
  } catch (err) {
    // Fail-safe: em caso de erro, não bloqueia o acesso ao wizard
    logger.warn({ err: err instanceof Error ? err.message : String(err) }, '[check-initialized] Exception');
    return json({ initialized: false });
  }
}

