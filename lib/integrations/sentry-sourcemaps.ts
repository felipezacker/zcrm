/**
 * Sentry Source Maps Configuration for Production Debugging
 * Enables stack traces to point to original source code instead of minified JS
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Initialize source map uploads for Sentry
 * Requires SENTRY_AUTH_TOKEN environment variable
 */
export function initializeSourceMaps(): void {
  if (!process.env.SENTRY_AUTH_TOKEN) {
    console.warn(
      '[Sentry] SENTRY_AUTH_TOKEN not configured. Source maps will not be uploaded to Sentry.'
    );
    return;
  }

  console.log('[Sentry] Source map upload configured for error tracking');
}

/**
 * Next.js Build Webpack Configuration for Source Maps
 * This should be added to next.config.js
 *
 * Example next.config.js:
 * ```javascript
 * const { withSentryConfig } = require('@sentry/nextjs');
 *
 * const nextConfig = {
 *   // ... other config options
 *   webpack: (config, { isServer }) => {
 *     // Ensure source maps are generated
 *     config.devtool = isServer ? false : 'hidden-source-map';
 *     return config;
 *   },
 * };
 *
 * module.exports = withSentryConfig(nextConfig, {
 *   org: process.env.SENTRY_ORG,
 *   project: process.env.SENTRY_PROJECT,
 *   authToken: process.env.SENTRY_AUTH_TOKEN,
 *   shouldHideSourcemaps: true,
 * });
 * ```
 */

/**
 * Configure error with source map metadata
 */
export function captureExceptionWithSourceMap(
  error: Error,
  context?: Record<string, unknown>
): void {
  Sentry.captureException(error, {
    contexts: {
      trace: {
        op: 'error.capture',
        description: error.message,
      },
    },
    extra: {
      ...context,
      sourceMapEnabled: !!process.env.SENTRY_AUTH_TOKEN,
    },
    tags: {
      errorType: error.constructor.name,
      environment: process.env.NODE_ENV,
    },
  });
}

/**
 * Sentry Source Map Upload Configuration
 * Add to package.json scripts:
 *
 * ```json
 * {
 *   "scripts": {
 *     "build": "next build",
 *     "build:upload-sourcemaps": "npm run build && sentry-cli releases files upload-sourcemaps ./out"
 *   }
 * }
 * ```
 *
 * Environment variables required:
 * - SENTRY_AUTH_TOKEN: Authentication token for Sentry CLI
 * - SENTRY_ORG: Sentry organization slug
 * - SENTRY_PROJECT: Sentry project slug
 */

/**
 * Verify source maps are properly configured
 */
export function verifySentrySourceMaps(): {
  configured: boolean;
  messages: string[];
} {
  const messages: string[] = [];

  if (!process.env.SENTRY_DSN) {
    messages.push('❌ SENTRY_DSN not configured');
  } else {
    messages.push('✅ SENTRY_DSN configured');
  }

  if (!process.env.SENTRY_AUTH_TOKEN) {
    messages.push('⚠️  SENTRY_AUTH_TOKEN not configured - source maps will not be uploaded');
  } else {
    messages.push('✅ SENTRY_AUTH_TOKEN configured - source maps will be uploaded');
  }

  if (!process.env.SENTRY_ORG) {
    messages.push('⚠️  SENTRY_ORG not configured - required for source map uploads');
  } else {
    messages.push('✅ SENTRY_ORG configured');
  }

  if (!process.env.SENTRY_PROJECT) {
    messages.push('⚠️  SENTRY_PROJECT not configured - required for source map uploads');
  } else {
    messages.push('✅ SENTRY_PROJECT configured');
  }

  const configured =
    !!process.env.SENTRY_DSN &&
    !!process.env.SENTRY_AUTH_TOKEN &&
    !!process.env.SENTRY_ORG &&
    !!process.env.SENTRY_PROJECT;

  return { configured, messages };
}

/**
 * Documentation: Sentry Source Maps
 *
 * Source maps map minified/compiled code back to original source for better debugging
 *
 * Setup steps:
 * 1. Create Sentry account and project (https://sentry.io)
 * 2. Generate authentication token in Sentry settings
 * 3. Set environment variables:
 *    - SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
 *    - SENTRY_AUTH_TOKEN=sntrys_xxxx
 *    - SENTRY_ORG=your-org
 *    - SENTRY_PROJECT=your-project
 * 4. Update next.config.js with withSentryConfig wrapper
 * 5. Run: npm run build:upload-sourcemaps
 * 6. Errors will now show original source code instead of minified
 */
