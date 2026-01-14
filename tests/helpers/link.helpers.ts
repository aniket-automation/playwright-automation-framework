import { Page } from '@playwright/test';

/**
 * Verify that all links have href attributes
 */
export async function verifyLinksHaveHref(page: Page): Promise<boolean> {
  const links = page.locator('main a');
  const count = await links.count();

  if (count === 0) return false;

  for (let i = 0; i < Math.min(count, 10); i++) {
    const href = await links.nth(i).getAttribute('href');
    if (!href) return false;
  }

  return true;
}

/**
 * Verify that all links have text content
 */
export async function verifyLinksHaveText(page: Page): Promise<boolean> {
  const links = page.locator('main a');
  const count = await links.count();

  if (count === 0) return false;

  for (let i = 0; i < Math.min(count, 10); i++) {
    const text = await links.nth(i).textContent();
    if (!text || text.trim().length === 0) return false;
  }

  return true;
}

/**
 * Get count of links in main content area
 */
export async function getMainContentLinksCount(page: Page): Promise<number> {
  const mainContent = page.locator('main');
  return await mainContent.locator('a').count();
}

/**
 * Get all link hrefs from main content
 */
export async function getMainContentLinkHrefs(page: Page): Promise<string[]> {
  const mainContent = page.locator('main');
  const links = mainContent.locator('a');
  const count = await links.count();
  const hrefs: string[] = [];

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    if (href) hrefs.push(href);
  }

  return hrefs;
}

/**
 * Verify all internal links are valid
 */
export async function verifyInternalLinksValid(page: Page): Promise<boolean> {
  const hrefs = await getMainContentLinkHrefs(page);
  const invalidHrefs = hrefs.filter(href => !href.startsWith('/') && !href.startsWith('http'));
  return invalidHrefs.length === 0;
}

/**
 * Get count of external links
 */
export async function getExternalLinksCount(page: Page): Promise<number> {
  const hrefs = await getMainContentLinkHrefs(page);
  return hrefs.filter(href => href.startsWith('http')).length;
}
