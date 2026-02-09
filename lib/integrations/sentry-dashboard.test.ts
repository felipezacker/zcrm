import { describe, it, expect } from 'vitest';
import {
  SENTRY_DASHBOARD_QUERIES,
  SENTRY_DASHBOARD_FILTERS,
  buildSentryIssuesUrl,
  getDashboardUrls,
} from './sentry-dashboard';

describe('Sentry Dashboard', () => {
  describe('Dashboard Queries', () => {
    it('should have all error query', () => {
      expect(SENTRY_DASHBOARD_QUERIES.allErrors).toBe('event.type:error');
    });

    it('should have unhandled errors query', () => {
      expect(SENTRY_DASHBOARD_QUERIES.unhandledErrors).toContain('unhandled');
    });

    it('should have critical errors query', () => {
      expect(SENTRY_DASHBOARD_QUERIES.criticalErrors).toContain('fatal');
    });

    it('should have database errors query', () => {
      expect(SENTRY_DASHBOARD_QUERIES.databaseErrors).toContain('database');
    });

    it('should have network errors query', () => {
      expect(SENTRY_DASHBOARD_QUERIES.networkErrors).toContain('network');
    });

    it('should have authentication errors query', () => {
      expect(SENTRY_DASHBOARD_QUERIES.authErrors).toContain('authentication');
    });

    it('should have production environment query', () => {
      expect(SENTRY_DASHBOARD_QUERIES.productionErrors).toContain('production');
    });
  });

  describe('Dashboard Filters', () => {
    it('should combine multiple queries in filters', () => {
      expect(SENTRY_DASHBOARD_FILTERS.criticalNow).toContain('fatal');
      expect(SENTRY_DASHBOARD_FILTERS.criticalNow).toContain('production');
    });

    it('should have user impact filter', () => {
      expect(SENTRY_DASHBOARD_FILTERS.userImpacting).toContain('user.id');
    });

    it('should have database problems filter', () => {
      expect(SENTRY_DASHBOARD_FILTERS.databaseProblems).toContain('database');
      expect(SENTRY_DASHBOARD_FILTERS.databaseProblems).toContain('production');
    });

    it('should have network problems filter', () => {
      expect(SENTRY_DASHBOARD_FILTERS.networkProblems).toContain('network');
    });

    it('should have auth problems filter', () => {
      expect(SENTRY_DASHBOARD_FILTERS.authProblems).toContain('authentication');
    });

    it('should have new errors filter', () => {
      expect(SENTRY_DASHBOARD_FILTERS.newErrors).toContain('unhandled');
      expect(SENTRY_DASHBOARD_FILTERS.newErrors).toContain('firstSeen');
    });

    it('should have regressions filter', () => {
      expect(SENTRY_DASHBOARD_FILTERS.regressions).toContain('lastSeen');
    });
  });

  describe('buildSentryIssuesUrl', () => {
    it('should build valid Sentry URL', () => {
      const url = buildSentryIssuesUrl();
      expect(url).toContain('sentry.io');
      expect(url).toContain('issues');
    });

    it('should include query parameter when provided', () => {
      const url = buildSentryIssuesUrl('level:fatal');
      expect(url).toContain('query=');
      expect(url).toContain(encodeURIComponent('level:fatal'));
    });

    it('should encode query properly', () => {
      const url = buildSentryIssuesUrl('level:fatal AND tags.error_category:database');
      expect(url).toContain(encodeURIComponent(' '));
      expect(url).toContain('query=');
    });

    it('should accept custom org', () => {
      const url = buildSentryIssuesUrl(undefined, { org: 'custom-org' });
      expect(url).toContain('custom-org');
    });

    it('should accept custom project', () => {
      const url = buildSentryIssuesUrl(undefined, { project: 'my-project' });
      expect(url).toContain('project=my-project');
    });

    it('should accept environment option', () => {
      const url = buildSentryIssuesUrl(undefined, { environment: 'production' });
      expect(url).toContain('environment=production');
    });

    it('should combine multiple options', () => {
      const url = buildSentryIssuesUrl('level:fatal', {
        org: 'my-org',
        project: 'my-project',
        environment: 'production',
      });

      expect(url).toContain('my-org');
      expect(url).toContain('my-project');
      expect(url).toContain('production');
      expect(url).toContain('query=');
    });
  });

  describe('getDashboardUrls', () => {
    it('should generate all dashboard URLs', () => {
      const urls = getDashboardUrls();

      expect(urls.allIssues).toBeDefined();
      expect(urls.criticalNow).toBeDefined();
      expect(urls.userImpacting).toBeDefined();
      expect(urls.databaseProblems).toBeDefined();
      expect(urls.networkProblems).toBeDefined();
      expect(urls.authProblems).toBeDefined();
      expect(urls.newErrors).toBeDefined();
      expect(urls.regressions).toBeDefined();
    });

    it('should have environment-specific URLs', () => {
      const urls = getDashboardUrls();

      expect(urls.productionIssues).toContain('production');
      expect(urls.stagingIssues).toContain('staging');
    });

    it('should have feature-specific URLs', () => {
      const urls = getDashboardUrls();

      expect(urls.dealErrors).toBeDefined();
      expect(urls.contactErrors).toBeDefined();
      expect(urls.boardErrors).toBeDefined();
    });

    it('all URLs should be valid Sentry links', () => {
      const urls = getDashboardUrls();

      Object.values(urls).forEach((url) => {
        expect(url).toContain('sentry.io');
        expect(url).toContain('organizations');
      });
    });
  });
});
