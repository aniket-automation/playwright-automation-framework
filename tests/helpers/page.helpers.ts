import { Page, expect } from '@playwright/test';

/**
 * Verify that the page has loaded correctly
 */
export async function verifyPageLoaded(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Get the current page title
 */
export async function getPageTitle(page: Page): Promise<string> {
  return await page.title();
}

/**
 * Get the current page URL
 */
export async function getPageURL(page: Page): Promise<string> {
  return page.url();
}

/**
 * Get the count of topic links on the page
 */
export async function getTopicsCount(page: Page): Promise<number> {
  const topics = page.locator('a[href*="/topics/"]');
  return await topics.count();
}

/**
 * Verify main heading is present
 */
export async function verifyMainHeadingPresent(page: Page): Promise<boolean> {
  const mainHeading = page.locator('h1');
  return await mainHeading.isVisible();
}

/**
 * Get main heading text
 */
export async function getMainHeadingText(page: Page): Promise<string> {
  const mainHeading = page.locator('h1').first();
  return await mainHeading.textContent() || '';
}

/**
 * Verify page contains specific text
 */
export async function verifyPageContainsText(page: Page, text: string): Promise<boolean> {
  return await page.locator(`text=${text}`).isVisible().catch(() => false);
}
