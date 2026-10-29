import { readFileSync } from 'node:fs';
import path from 'node:path';
import { chromium, expect, test, type BrowserContext } from '@playwright/test';

const extensionPath = path.resolve('.output/chrome-mv3');
const manifestVersion = (
  JSON.parse(readFileSync(path.join(extensionPath, 'manifest.json'), 'utf8')) as { version: string }
).version;

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

const panelUrl = () => `chrome-extension://${extensionId}/sidepanel.html`;

// Opens the built panel page in a normal tab. This checks the page's content,
// not that the toolbar click opens the real side panel.
test('built side panel page renders the starter content', async () => {
  const page = await context.newPage();
  await page.goto(panelUrl());

  await expect(page).toHaveTitle('Browser Side Panel Starter');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Welcome' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Quick start' })).toBeVisible();
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByRole('heading', { level: 2, name: 'Next step' })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toContainText(`v${manifestVersion}`);
});

// Chromium cannot grant clipboard permission to an extension origin, so these
// tests stub writeText to check what the panel sends and how it reports the result.
test('copy button sends the command to the clipboard and reports success', async () => {
  const page = await context.newPage();
  await page.addInitScript(() => {
    const w = window as unknown as { copied: string[] };
    w.copied = [];
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: (text: string) => Promise.resolve(void w.copied.push(text)) },
    });
  });
  await page.goto(panelUrl());

  await page.getByRole('button', { name: 'Copy /create-slice command' }).click();

  await expect(page.getByRole('status')).toHaveText('Command copied. Paste it into Claude Code.');
  expect(await page.evaluate(() => (window as unknown as { copied: string[] }).copied)).toEqual([
    '/create-slice <slice-name>',
  ]);
});

test('copy button reports failure without claiming success', async () => {
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await page.goto(panelUrl());

  await page.getByRole('button', { name: 'Copy /create-slice command' }).click();

  await expect(page.getByRole('status')).toHaveText(
    'Could not copy. Select the command under Next step instead.',
  );
});

test('panel does not overflow horizontally at 320px', async () => {
  const page = await context.newPage();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(panelUrl());

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
