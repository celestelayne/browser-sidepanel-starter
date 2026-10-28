import { defineConfig } from '@playwright/test';

// Tests load the built extension from .output/chrome-mv3, so run `npm run build` first.
export default defineConfig({
  testDir: 'tests/e2e',
  // Extensions need a persistent browser context, so run serially.
  workers: 1,
  reporter: 'list',
});
