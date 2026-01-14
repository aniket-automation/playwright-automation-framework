import { Page } from '@playwright/test';

/**
 * Verify that the search box is visible on the page
 */
export async function verifySearchBoxVisible(page: Page): Promise<boolean> {
  const searchInput = page.getByRole('searchbox', { name: /search/i });
  return await searchInput.isVisible().catch(() => false);
}

/**
 * Perform a search with the given query
 */
export async function performSearch(page: Page, query: string): Promise<void> {
  const searchInput = page.getByRole('searchbox', { name: /search/i });
  const searchButton = page.getByRole('button', { name: /search/i }).first();

  await searchInput.fill(query);
  await searchButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Get the current value in the search input
 */
export async function getSearchInputValue(page: Page): Promise<string> {
  const searchInput = page.getByRole('searchbox', { name: /search/i });
  return await searchInput.inputValue();
}

/**
 * Clear the search input
 */
export async function clearSearch(page: Page): Promise<void> {
  const searchInput = page.getByRole('searchbox', { name: /search/i });
  await searchInput.clear();
}

/**
 * Verify that search results are displayed
 */
export async function verifySearchResultsDisplayed(page: Page): Promise<boolean> {
  const results = page.locator('[data-test*="search-result"], .search-result, [class*="result"]');
  return await results.first().isVisible().catch(() => false);
}

/**
 * Get count of search results
 */
export async function getSearchResultsCount(page: Page): Promise<number> {
  const results = page.locator('[data-test*="search-result"], .search-result, [class*="result"]');
  return await results.count();
}
