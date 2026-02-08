const SENSITIVE_PATTERNS = [
  'password',
  'token',
  'api_key',
  'secret',
  'authorization',
  'cookie',
  'session',
  'email',
  'phone',
  'ssn',
];

const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'x-api-key',
  'x-access-token',
];

const SENSITIVE_URL_PARAMS = [
  'token',
  'api_key',
  'password',
  'secret',
  'key',
];

const MAX_DEPTH = 5;

export const redactSensitiveData = (obj: unknown, depth = 0): unknown => {
  if (!obj || typeof obj !== 'object' || depth > MAX_DEPTH) return obj;

  const redacted = Array.isArray(obj) ? [...obj] : { ...(obj as Record<string, unknown>) };

  for (const key of Object.keys(redacted)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_PATTERNS.some(pattern => lowerKey.includes(pattern));

    if (isSensitive) {
      (redacted as Record<string, unknown>)[key] = '[REDACTED]';
    } else if (typeof (redacted as Record<string, unknown>)[key] === 'object') {
      (redacted as Record<string, unknown>)[key] = redactSensitiveData(
        (redacted as Record<string, unknown>)[key],
        depth + 1
      );
    }
  }

  return redacted;
};

export const redactHeaders = (headers: Record<string, unknown>): Record<string, unknown> => {
  const redacted = { ...headers };

  for (const [key] of Object.entries(redacted)) {
    if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    }
  }

  return redacted;
};

export const redactUrl = (url: string): string => {
  try {
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;

    for (const param of SENSITIVE_URL_PARAMS) {
      if (params.has(param)) {
        params.set(param, '[REDACTED]');
      }
    }

    return urlObj.toString();
  } catch {
    return url;
  }
};
