import path from 'node:path';
import { chromium, expect, test, type BrowserContext } from '@playwright/test';

const extensionPath = path.resolve('.output/chrome-mv3');

let context: BrowserContext;
let extensionId: string;

test.beforeAll(async () => {
  // Extensions only load in a persistent context. channel 'chromium' enables
  // the new headless mode, which supports extensions.
  context = await chromium.launchPersistentContext('', {
    channel: 'chromium',
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
  let [worker] = context.serviceWorkers();
  worker ??= await context.waitForEvent('serviceworker');
  extensionId = new URL(worker.url()).host;
});

test.afterAll(async () => {
  await context.close();
});

// Opens the built panel page in a normal tab. This checks the page's content,
// not that the toolbar click opens the real side panel.
test('built side panel page renders the shell', async () => {
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);

  await expect(page).toHaveTitle('Browser Side Panel Starter');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Browser Side Panel Starter' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Your side panel is ready.');
  await expect(page.getByRole('contentinfo')).toContainText('Made with 💛 in NYC');
});

test('shell does not overflow horizontally at 320px', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(`chrome-extension://${extensionId}/sidepanel.html`);

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
