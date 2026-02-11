import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  },
  optimizeDeps: {
    exclude: ['@storybook/nextjs-vite']
  },
  test: {
    globals: true,
    // Muitos testes do projeto (inclusive alguns .test.ts) usam React Testing Library
    // e precisam de um DOM. Por isso, usamos um ambiente com DOM por padrão.
    environment: 'happy-dom',
    // Setup base + DOM-only helpers (guardados para não quebrar caso algum teste rode em node)
    setupFiles: ['test/setup.ts', 'test/setup.dom.ts'],
    // Cobrir testes unitários tanto em /test quanto em components/features
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist', 'tmp', '**/*.bak', '**/*.bkp'],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    // Storybook project temporarily disabled due to known Vite compatibility issues
    // with @storybook/nextjs-vite v10.2.7 and sb-original/image-context resolution
    // projects: [{...}]
  }
});