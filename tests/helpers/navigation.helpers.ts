import { Page } from '@playwright/test';

/**
 * Get all primary navigation items text
 */
export async function getPrimaryNavItems(page: Page): Promise<string[]> {
  const nav = page.locator('nav[aria-label="Primary navigation"]');
  const items = await nav.locator('a').allTextContents();
  return items.filter(item => item.trim().length > 0);
}

/**
 * Get count of primary navigation items
 */
export async function getPrimaryNavItemCount(page: Page): Promise<number> {
  const nav = page.locator('nav[aria-label="Primary navigation"]');
  return await nav.locator('a').count();
}

/**
 * Verify all navigation items have href attributes
 */
export async function verifyAllNavItemsHaveHref(page: Page): Promise<boolean> {
  const navLinks = page.locator('nav[aria-label="Primary navigation"] a');
  const count = await navLinks.count();

  if (count === 0) return false;

  for (let i = 0; i < count; i++) {
    const href = await navLinks.nth(i).getAttribute('href');
    if (!href) return false;
  }

  return true;
}

/**
 * Click a navigation item by its text
 */
export async function clickNavItem(page: Page, itemText: string): Promise<void> {
  const navItem = page.locator('nav').locator(`text=${itemText}`).first();
  await navItem.click();
}

/**
 * Click the logo to return to homepage
 */
export async function clickLogo(page: Page): Promise<void> {
  const logo = page.locator('a[href="/"]').first();
  await logo.click();
}

/**
 * Get footer navigation items
 */
export async function getFooterNavItems(page: Page): Promise<string[]> {
  const footer = page.locator('footer');
  const items = await footer.locator('a').allTextContents();
  return items.filter(item => item.trim().length > 0);
}

/**
 * Get footer navigation item count
 */
export async function getFooterNavItemCount(page: Page): Promise<number> {
  const footer = page.locator('footer');
  return await footer.locator('a').count();
}

/**
 * Verify footer is present
 */
export async function verifyFooterPresent(page: Page): Promise<boolean> {
  const footer = page.locator('footer');
  return await footer.isVisible().catch(() => false);
}
