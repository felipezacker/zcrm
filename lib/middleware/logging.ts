import { NextApiRequest, NextApiResponse } from 'next';
import { logger, generateCorrelationId, serializeRequest, redactSensitiveData } from '../logger';

export const withLogging = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const correlationId = generateCorrelationId();
    const startTime = Date.now();

    // Store correlation ID in request for later use
    (req as any).correlationId = correlationId;

    // Log incoming request
    logger.info(
      {
        correlationId,
        ...serializeRequest(req),
      },
      'Incoming request'
    );

    // Capture response
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      const duration = Date.now() - startTime;

      // Log response
      logger.info(
        {
          correlationId,
          statusCode: res.statusCode,
          duration,
          body: redactSensitiveData(body),
        },
        'Request completed'
      );

      return originalJson(body);
    };

    try {
      return await handler(req, res);
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

      throw error;
    }
  };
};

export default withLogging;
