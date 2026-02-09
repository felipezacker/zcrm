import pino from 'pino';
import path from 'path';
import fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

/**
 * Create logs directory if it doesn't exist
 */
function ensureLogsDir(): string {
  const logsDir = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  return logsDir;
}

/**
 * Configure log transport based on environment
 * Development: pino-pretty console output
 * Production: File transport with rotation
 */
export function getLogTransport() {
  if (isDev) {
    return {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: false,
        translateTime: 'SYS:standard',
      },
    };
  }

  // Production: Use pino-roll for log rotation
  const logsDir = ensureLogsDir();

  return {
    target: 'pino-roll',
    options: {
      dir: logsDir,
      file: 'app.log',
      frequency: 'daily', // Rotate daily
      size: '100m', // Also rotate at 100MB
      mkdir: true,
    },
  };
}

/**
 * Get logger configuration (without transport)
 */
export function getLoggerConfig() {
  return {
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    base: {
      environment: process.env.NODE_ENV,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
      timestamp: new Date().toISOString(),
    },
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
      bindings: (bindings: any) => {
        return {
          ...bindings,
          pid: undefined, // Remove PID in production
        };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  };
}

/**
 * Log retention configuration
 * Defines cleanup policy for old log files
 */
export const LOG_RETENTION_DAYS = 7; // Keep logs for 7 days
export const LOG_CLEANUP_INTERVAL_HOURS = 24; // Check for cleanup daily

/**
 * Clean up old log files based on retention policy
 */
export async function cleanupOldLogs(): Promise<void> {
  if (!isProd) return; // Only cleanup in production

  try {
    const logsDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(logsDir)) {
      return;
    }

    const files = fs.readdirSync(logsDir);
    const now = Date.now();
    const retentionMs = LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtimeMs;

      if (fileAge > retentionMs) {
        fs.unlinkSync(filePath);
        console.log(
          `[LogCleanup] Removed old log file: ${file} (${Math.round(fileAge / (24 * 60 * 60 * 1000))} days old)`
        );
      }
    }
  } catch (error) {
    console.error('[LogCleanup] Error during log cleanup:', error);
  }
}

/**
 * Schedule automatic log cleanup
 * Call this function during application startup
 */
export function scheduleLogCleanup(): void {
  if (!isProd) return;

  // Clean up immediately on startup
  cleanupOldLogs().catch(console.error);

  // Then schedule periodic cleanup
  setInterval(() => {
    cleanupOldLogs().catch(console.error);
  }, LOG_CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);
}
