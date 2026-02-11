import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: { alias: { '@': resolve(__dirname, '.') } },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['test/setup.ts', 'test/setup.dom.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist', 'tmp', '**/*.bak', '**/*.bkp', '**/*.stories.*'],
    testTimeout: 60000
  }
});
