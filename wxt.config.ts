import { defineConfig } from 'wxt';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Browser Side Panel Starter',
    description: 'A side panel that stays open alongside the pages you browse.',
    permissions: ['sidePanel'],
  }
});
