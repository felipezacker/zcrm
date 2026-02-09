/**
 * Sentry Error Dashboard Configuration
 * Provides dashboard queries and filtering for error monitoring
 */

/**
 * Predefined Sentry dashboard queries for error analysis
 */
export const SENTRY_DASHBOARD_QUERIES = {
  // Overview queries
  allErrors: 'event.type:error',
  unhandledErrors: 'error.unhandled:true',
  recentErrors: 'event.timestamp:>-24h',

  // By severity
  criticalErrors: 'level:fatal',
  errorsSeverity: 'level:error',
  warnings: 'level:warning',

  // By category (based on tags)
  databaseErrors: 'tags.error_category:database',
  networkErrors: 'tags.error_category:network',
  authErrors: 'tags.error_category:authentication',
  authorizationErrors: 'tags.error_category:authorization',
  validationErrors: 'tags.error_category:validation',
  businessLogicErrors: 'tags.error_category:business_logic',

  // By environment
  productionErrors: 'environment:production',
  stagingErrors: 'environment:staging',
  developmentErrors: 'environment:development',

  // By feature/module
  dealErrors: 'tags.feature:deals',
  contactErrors: 'tags.feature:contacts',
  boardErrors: 'tags.feature:boards',
  authenticationFeatureErrors: 'tags.feature:authentication',

  // Performance-related
  slowRequests: 'measurement.http.response_content_length:>1000',
  timeoutErrors: 'error.message:*timeout*',
  connectionErrors: 'error.message:*connection*refused*',

  // User experience
  userImpact: 'user.id:*',
  sessionErrors: 'tags.session_id:*',

  // Custom metrics
  errorRate: 'event.rate:>0.05', // > 5% error rate
  errorSpike: 'event.count:>10 period:5m', // > 10 errors in 5m
};

/**
 * Dashboard filter combinations for common scenarios
 */
export const SENTRY_DASHBOARD_FILTERS = {
  // Critical issues requiring immediate attention
  criticalNow: [
    SENTRY_DASHBOARD_QUERIES.criticalErrors,
    SENTRY_DASHBOARD_QUERIES.productionErrors,
    SENTRY_DASHBOARD_QUERIES.recentErrors,
  ].join(' '),

  // User-impacting errors
  userImpacting: [
    SENTRY_DASHBOARD_QUERIES.errorsSeverity,
    SENTRY_DASHBOARD_QUERIES.userImpact,
    'timesSeen:>5', // Affecting multiple users
  ].join(' '),

  // Database issues
  databaseProblems: [
    SENTRY_DASHBOARD_QUERIES.databaseErrors,
    SENTRY_DASHBOARD_QUERIES.productionErrors,
  ].join(' '),

  // Network/Integration issues
  networkProblems: [
    SENTRY_DASHBOARD_QUERIES.networkErrors,
    SENTRY_DASHBOARD_QUERIES.recentErrors,
  ].join(' '),

  // Authentication issues
  authProblems: [
    SENTRY_DASHBOARD_QUERIES.authErrors,
    SENTRY_DASHBOARD_QUERIES.recentErrors,
  ].join(' '),

  // New errors (not seen before)
  newErrors: [
    SENTRY_DASHBOARD_QUERIES.unhandledErrors,
    'firstSeen:>-24h',
  ].join(' '),

  // Regression detection (recently seen errors that were fixed)
  regressions: [
    SENTRY_DASHBOARD_QUERIES.recentErrors,
    'lastSeen:>-1h',
  ].join(' '),
};

/**
 * Generate Sentry Issues URL with query parameters
 */
export function buildSentryIssuesUrl(
  query?: string,
  options?: { org?: string; project?: string; environment?: string }
): string {
  const org = options?.org || process.env.SENTRY_ORG || 'your-org';
  const project = options?.project
    ? `&project=${options.project}`
    : process.env.SENTRY_PROJECT
      ? `&project=${process.env.SENTRY_PROJECT}`
      : '';

  const environment = options?.environment ? `&environment=${options.environment}` : '';

  const encodedQuery = query ? `query=${encodeURIComponent(query)}` : '';

  return `https://sentry.io/organizations/${org}/issues/?${encodedQuery}${project}${environment}`;
}

/**
 * Get dashboard URLs for common views
 */
export function getDashboardUrls() {
  return {
    allIssues: buildSentryIssuesUrl(),
    criticalNow: buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.criticalNow),
    userImpacting: buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.userImpacting),
    databaseProblems: buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.databaseProblems),
    networkProblems: buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.networkProblems),
    authProblems: buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.authProblems),
    newErrors: buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.newErrors),
    regressions: buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.regressions),

    // By environment
    productionIssues: buildSentryIssuesUrl(
      SENTRY_DASHBOARD_QUERIES.productionErrors,
      { environment: 'production' }
    ),
    stagingIssues: buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.stagingErrors, {
      environment: 'staging',
    }),

    // By feature
    dealErrors: buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.dealErrors),
    contactErrors: buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.contactErrors),
    boardErrors: buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.boardErrors),
  };
}

/**
 * Sentry dashboard setup recommendations
 */
export const DASHBOARD_SETUP_GUIDE = `
Sentry Error Dashboard Setup Guide
===================================

1. CRITICAL ISSUES DASHBOARD
   Location: Sentry Issues page
   Query: ${SENTRY_DASHBOARD_FILTERS.criticalNow}
   Purpose: Monitor production-critical errors
   Refresh: Real-time

2. USER IMPACT DASHBOARD
   Query: ${SENTRY_DASHBOARD_FILTERS.userImpacting}
   Purpose: Errors affecting multiple users
   Alert: On > 5 users affected

3. ERROR CATEGORIZATION
   Severity Levels:
   - FATAL: Critical issues requiring immediate action
   - ERROR: Functional issues affecting features
   - WARNING: Degradation or edge cases
   - INFO: Informational events

   Categories:
   - database: Database query failures
   - network: Network/API integration issues
   - authentication: Login/token problems
   - authorization: Permission issues
   - validation: Input validation failures
   - business_logic: Application logic errors

4. FILTERING BY SEVERITY
   Fatal:    ${buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.criticalErrors)}
   Error:    ${buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.errorsSeverity)}
   Warning:  ${buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.warnings)}

5. FILTERING BY CATEGORY
   Database:       ${buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.databaseErrors)}
   Network:        ${buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.networkErrors)}
   Authentication: ${buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.authErrors)}
   Validation:     ${buildSentryIssuesUrl(SENTRY_DASHBOARD_QUERIES.validationErrors)}

6. TREND ANALYSIS
   New Errors:    ${buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.newErrors)}
   Regressions:   ${buildSentryIssuesUrl(SENTRY_DASHBOARD_FILTERS.regressions)}
   Error Spike:   Issues with spike in error rate

7. RECOMMENDED DASHBOARDS TO CREATE
   - On-Call Dashboard (critical + recent)
   - User Impact Dashboard (>5 affected users)
   - Database Health (database errors)
   - Integration Health (network errors)
   - Security Monitoring (auth + authorization)

8. BROWSER EXTENSION (Optional)
   Install Sentry browser extension for quick access:
   https://sentry.io/settings/browser-extensions/
`;

/**
 * Log dashboard configuration guide
 */
export function logDashboardGuide(): void {
  console.log(DASHBOARD_SETUP_GUIDE);
  console.log('\nQuick Links:');
  const urls = getDashboardUrls();
  Object.entries(urls).forEach(([name, url]) => {
    console.log(`  ${name}: ${url}`);
  });
}

/**
 * Export dashboard data for reporting
 */
export interface DashboardMetrics {
  totalErrors: number;
  criticalErrors: number;
  errorRate: number;
  affectedUsers: number;
  topErrorCategories: Record<string, number>;
  topFeatures: Record<string, number>;
}

/**
 * Get dashboard metrics summary
 */
export function getDashboardMetricsSummary(): DashboardMetrics {
  // This would be populated from actual Sentry API
  // For now, it's a template for what metrics to track
  return {
    totalErrors: 0,
    criticalErrors: 0,
    errorRate: 0,
    affectedUsers: 0,
    topErrorCategories: {},
    topFeatures: {},
  };
}
