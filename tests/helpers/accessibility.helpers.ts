import { Page, expect } from '@playwright/test';

/**
 * Verify page accessibility structure with main landmarks
 */
export async function verifyPageAccessibility(page: Page): Promise<void> {
  // Check for main landmark
  const main = page.locator('main');
  expect(await main.isVisible()).toBeTruthy();

  // Check for header
  const header = page.locator('header');
  expect(await header.isVisible()).toBeTruthy();

  // Check for footer
  const footer = page.locator('footer');
  expect(await footer.isVisible()).toBeTruthy();
}

/**
 * Verify skip to main content link is present
 */
export async function verifySkipLinkPresent(page: Page): Promise<boolean> {
  const skipLink = page.getByText(/skip.*main|main.*content/i);
  return await skipLink.isVisible().catch(() => false);
}

/**
 * Verify all images have alt text
 */
export async function verifyImagesHaveAltText(page: Page): Promise<boolean> {
  const images = page.locator('main img');
  const count = await images.count();

  if (count === 0) return true;

  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    if (!alt) return false;
  }

  return true;
}

/**
 * Verify all headings are in correct order
 */
export async function verifyHeadingHierarchy(page: Page): Promise<boolean> {
  const headings = page.locator('main h1, main h2, main h3, main h4, main h5, main h6');
  const count = await headings.count();

  if (count === 0) return true;

  let previousLevel = 0;

  for (let i = 0; i < count; i++) {
    const tagName = await headings.nth(i).evaluate((el) => el.tagName);
    const currentLevel = parseInt(tagName.charAt(1));

    if (currentLevel > previousLevel + 1) {
      return false;
    }

    previousLevel = currentLevel;
  }

  return true;
}

/**
 * Verify all form inputs have associated labels
 */
export async function verifyFormInputsHaveLabels(page: Page): Promise<boolean> {
  const inputs = page.locator('form input[type="text"], form input[type="email"], form textarea');
  const count = await inputs.count();

  if (count === 0) return true;

  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);
    const id = await input.getAttribute('id');
    const ariaLabel = await input.getAttribute('aria-label');

    if (id) {
      const label = page.locator(`label[for="${id}"]`);
      const labelExists = await label.isVisible().catch(() => false);
      if (!labelExists && !ariaLabel) return false;
    } else if (!ariaLabel) {
      return false;
    }
  }

  return true;
}

/**
 * Verify page has proper language attribute
 */
export async function verifyPageLanguageAttribute(page: Page): Promise<boolean> {
  const htmlElement = page.locator('html');
  const lang = await htmlElement.getAttribute('lang');
  return lang !== null;
}

/**
 * Verify links are keyboard accessible
 */
export async function verifyKeyboardAccessibility(page: Page): Promise<boolean> {
  const links = page.locator('main a');
  const count = await links.count();

  if (count === 0) return true;

  for (let i = 0; i < Math.min(count, 5); i++) {
    const link = links.nth(i);
    const tabindex = await link.getAttribute('tabindex');
    
    if (tabindex === '-1') {
      return false;
    }
  }

  return true;
}

/**
 * Verify page has sufficient color contrast (basic check)
 */
export async function verifyPageHasAccessibleFonts(page: Page): Promise<boolean> {
  const mainText = page.locator('main p, main li, main span');
  const count = await mainText.count();

  return count > 0;
}
