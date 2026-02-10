/**
 * CommonJS env loader for Node.js
 * This runs in pure Node context before Vitest/Vite transforms anything
 */
const { readFileSync, existsSync } = require('node:fs');
const { randomUUID } = require('node:crypto');
const path = require('node:path');

function parseDotEnv(contents) {
  const out = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq < 0) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
}

function loadEnvFile(filePath, opts = {}) {
  if (!existsSync(filePath)) return;
  const parsed = parseDotEnv(readFileSync(filePath, 'utf8'));
  const override = opts.override === true;
  for (const [k, v] of Object.entries(parsed)) {
    if (override || process.env[k] == null) process.env[k] = v;
  }
}

// Load env files
const projectRoot = path.dirname(__dirname);
loadEnvFile(path.join(projectRoot, '.env'));
loadEnvFile(path.join(projectRoot, '.env.local'), { override: true });
loadEnvFile(path.join(projectRoot, '..', '.env'));
loadEnvFile(path.join(projectRoot, '..', '.env.local'));

// Set global test run ID (for browser-compatible UUID generation)
globalThis.__VITEST_RUN_ID__ = `vitest_${randomUUID()}`;
