import { Page } from '@playwright/test';

/**
 * Verify that the search input accepts text
 */
export async function verifySearchInputAcceptsText(page: Page, text: string): Promise<boolean> {
  const searchInput = page.getByRole('searchbox', { name: /search/i });

  try {
    await searchInput.fill(text);
    const value = await searchInput.inputValue();
    await searchInput.clear();
    return value === text;
  } catch {
    return false;
  }
}

/**
 * Submit a form by clicking submit button
 */
export async function submitForm(page: Page, formSelector: string = 'form'): Promise<void> {
  const form = page.locator(formSelector);
  const submitButton = form.locator('button[type="submit"]');
  await submitButton.click();
}

/**
 * Fill form input by label text
 */
export async function fillFormInput(page: Page, labelText: string, value: string): Promise<void> {
  const label = page.locator(`label:has-text("${labelText}")`);
  const inputId = await label.getAttribute('for');

  if (inputId) {
    const input = page.locator(`#${inputId}`);
    await input.fill(value);
  }
}

/**
 * Verify form input is required
 */
export async function verifyFormInputRequired(page: Page, inputSelector: string): Promise<boolean> {
  const input = page.locator(inputSelector);
  const required = await input.getAttribute('required');
  return required !== null;
}

/**
 * Get form input value
 */
export async function getFormInputValue(page: Page, inputSelector: string): Promise<string> {
  const input = page.locator(inputSelector);
  return await input.inputValue();
}

/**
 * Clear form input
 */
export async function clearFormInput(page: Page, inputSelector: string): Promise<void> {
  const input = page.locator(inputSelector);
  await input.clear();
}

/**
 * Verify form has specific number of inputs
 */
export async function verifyFormInputCount(
  page: Page,
  formSelector: string,
  expectedCount: number
): Promise<boolean> {
  const form = page.locator(formSelector);
  const inputs = form.locator('input, textarea, select');
  const count = await inputs.count();
  return count === expectedCount;
}
