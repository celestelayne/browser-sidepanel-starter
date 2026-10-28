import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Playwright owns tests/e2e; keep Vitest to unit tests only.
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
});
