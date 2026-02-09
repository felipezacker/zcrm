/**
 * Sentry Alert Rules Configuration
 * Defines critical error monitoring and notification settings
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Error severity levels for categorization
 */
export enum ErrorSeverity {
  FATAL = 'fatal',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Error categorization tags
 */
export enum ErrorCategory {
  DATABASE = 'database',
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  UNKNOWN = 'unknown',
}

/**
 * Categorize error based on message and type
 */
export function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase();

  if (
    message.includes('db') ||
    message.includes('database') ||
    message.includes('sql') ||
    message.includes('postgres')
  ) {
    return ErrorCategory.DATABASE;
  }

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('connection refused')
  ) {
    return ErrorCategory.NETWORK;
  }

  if (
    message.includes('auth') ||
    message.includes('unauthorized') ||
    message.includes('401') ||
    message.includes('invalid token')
  ) {
    return ErrorCategory.AUTHENTICATION;
  }

  if (
    message.includes('forbidden') ||
    message.includes('permission') ||
    message.includes('403')
  ) {
    return ErrorCategory.AUTHORIZATION;
  }

  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('required')
  ) {
    return ErrorCategory.VALIDATION;
  }

  if (message.includes('business') || message.includes('rule')) {
    return ErrorCategory.BUSINESS_LOGIC;
  }

  return ErrorCategory.UNKNOWN;
}

/**
 * Capture error with categorization
 */
export function captureErrorWithCategory(
  error: Error,
  userContext?: string
): void {
  const category = categorizeError(error);
  const severity = determineSeverity(error, category);

  Sentry.captureException(error, {
    level: severity,
    tags: {
      error_category: category,
      error_severity: severity,
      user_context: userContext || 'anonymous',
    },
    fingerprint: [category, error.name],
  });
}

/**
 * Determine error severity based on category and type
 */
function determineSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
  // Critical errors
  if (
    category === ErrorCategory.AUTHENTICATION ||
    category === ErrorCategory.DATABASE ||
    error.message.includes('CRITICAL')
  ) {
    return ErrorSeverity.FATAL;
  }

  // High-priority errors
  if (
    category === ErrorCategory.NETWORK ||
    category === ErrorCategory.AUTHORIZATION
  ) {
    return ErrorSeverity.ERROR;
  }

  // Lower priority
  if (category === ErrorCategory.VALIDATION) {
    return ErrorSeverity.WARNING;
  }

  return ErrorSeverity.ERROR;
}

/**
 * Alert threshold configuration
 * These should be configured in Sentry dashboard
 */
export const ALERT_THRESHOLDS = {
  // Alert if error rate exceeds 5% of transactions
  errorRatePercentage: 5,

  // Alert if more than 10 errors in 5 minutes
  errorCountThreshold: 10,
  errorCountTimeWindow: 5, // minutes

  // Alert for specific error types
  criticalErrorThreshold: 1, // Alert on any FATAL error

  // Alert if response time exceeds threshold
  responseTimeThreshold: 5000, // milliseconds

  // Alert for unhandled rejections
  unhandledRejectionThreshold: 1,
};

/**
 * Recommended Sentry Alert Rules
 *
 * These need to be configured in Sentry dashboard:
 * Settings → Alerts → Create Alert
 *
 * Rule 1: High Error Rate
 * - Trigger: When error rate exceeds 5%
 * - Actions: Send to Slack #alerts, Email
 * - Time window: Last 5 minutes
 *
 * Rule 2: Critical Errors
 * - Trigger: When FATAL error occurs
 * - Actions: Send to Slack #critical, PagerDuty
 * - Condition: error_severity:fatal
 *
 * Rule 3: Database Errors
 * - Trigger: When 3+ database errors in 10 minutes
 * - Actions: Send to Slack #database
 * - Condition: error_category:database
 *
 * Rule 4: Authentication Failures
 * - Trigger: When 10+ auth errors in 5 minutes
 * - Actions: Send to Slack #security
 * - Condition: error_category:authentication
 *
 * Rule 5: Unhandled Rejections
 * - Trigger: When unhandled promise rejection occurs
 * - Actions: Send to Slack #errors
 * - Condition: error.unhandled:true
 */

/**
 * Initialize error monitoring with alert integration
 */
export function initializeErrorMonitoring(): void {
  console.log('[Sentry] Error monitoring alerts configured');
  console.log('[Sentry] Alert thresholds:', ALERT_THRESHOLDS);

  // Log configuration in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sentry] Alert rules need manual configuration in Sentry dashboard');
  }
}

/**
 * Generate Sentry dashboard URL for error monitoring
 */
export function getSentryDashboardUrl(): string {
  const org = process.env.SENTRY_ORG || 'your-org';
  const project = process.env.SENTRY_PROJECT || 'your-project';
  return `https://sentry.io/organizations/${org}/issues/?project=${project}`;
}

/**
 * Get alert configuration summary
 */
export function getAlertConfigurationSummary(): string {
  return `
Sentry Alert Configuration Summary:
=====================================
Error Rate Alert: ${ALERT_THRESHOLDS.errorRatePercentage}% threshold
Critical Error Alert: Immediate notification
Database Error Alert: ${ALERT_THRESHOLDS.errorCountThreshold} errors in ${ALERT_THRESHOLDS.errorCountTimeWindow}m
Response Time Alert: ${ALERT_THRESHOLDS.responseTimeThreshold}ms threshold
Unhandled Rejection Alert: ${ALERT_THRESHOLDS.unhandledRejectionThreshold}+ rejections

Configure these rules in:
${getSentryDashboardUrl()}

Error Categories:
- database: Database queries and transactions
- network: Network requests and connectivity
- authentication: Login and token issues
- authorization: Permission and access issues
- validation: Input validation errors
- business_logic: Application logic errors
- unknown: Uncategorized errors
`;
}
