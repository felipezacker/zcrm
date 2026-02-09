import { NextRequest, NextResponse } from 'next/server';
import { logger, generateCorrelationId } from '../logger';
import { redactSensitiveData } from '../utils/redact';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Logging wrapper for Next.js App Router Route Handlers.
 * Usage: export const GET = withLogging(async (req) => { ... });
 */
export const withLogging = (
  handler: (req: NextRequest, context?: unknown) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context?: unknown): Promise<NextResponse> => {
    const correlationId = generateCorrelationId();
    const startTime = Date.now();

    logger.info(
      {
        correlationId,
        method: req.method,
        url: req.nextUrl.pathname,
        search: req.nextUrl.search,
        headers: redactSensitiveData(Object.fromEntries(req.headers)),
      },
      'Incoming request'
    );

    try {
      const response = await handler(req, context);
      const duration = Date.now() - startTime;

      logger.info(
        {
          correlationId,
          statusCode: response.status,
          duration,
        },
        'Request completed'
      );

      // Add correlation ID to response headers for tracing
      response.headers.set('x-correlation-id', correlationId);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error(
        {
          correlationId,
          duration,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Request failed'
      );

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500, headers: { 'x-correlation-id': correlationId } }
      );
    }
  };
};

export default withLogging;
