import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 45000 });
});

test.afterAll(async () => {
  console.log('Test execution completed. Closing browsers.');
});

export { test, expect };