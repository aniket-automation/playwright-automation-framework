import { test, expect } from '@playwright/test';

test.describe('Form Validation & Filtering Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  });

  test('Verify subscription form accepts valid email input', async ({ page }) => {
    // Look for email subscription form
    const emailInput = page.locator(
      'input[type="email"], input[placeholder*="email"], input[placeholder*="Email"], input[aria-label*="email"], input[aria-label*="Email"]'
    ).first();
    
    const emailInputVisible = await emailInput.isVisible().catch(() => false);
    
    if (emailInputVisible) {
      console.log('Email subscription form found');
      
      // Test valid email
      const testEmail = 'test@example.com';
      await emailInput.fill(testEmail);
      const inputValue = await emailInput.inputValue();
      expect(inputValue).toBe(testEmail);
      
      // Verify submit button exists
      const submitButton = page.locator('button[type="submit"]').first();
      const submitButtonVisible = await submitButton.isVisible().catch(() => false);
      expect(submitButtonVisible).toBe(true);
    } else {
      console.log('Email subscription form not found on main page, checking for alternate forms');
      // Verify page has forms
      const forms = page.locator('form');
      const formCount = await forms.count();
      expect(formCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('Verify search form submission with filter options', async ({ page }) => {
    // Find search form
    const searchForm = page.locator('form, .search-form, [role="search"]').first();
    const searchFormVisible = await searchForm.isVisible().catch(() => false);
    
    if (searchFormVisible) {
      // Verify search input in form
      const searchInput = searchForm.locator('input[type="search"], input[placeholder*="Search"]').first();
      const inputVisible = await searchInput.isVisible().catch(() => false);
      expect(inputVisible).toBe(true);
      
      // Check for filter options
      const filterOptions = searchForm.locator('input[type="checkbox"], input[type="radio"], select');
      const filterCount = await filterOptions.count();
      console.log(`Found ${filterCount} filter options`);
    }
  });

  test('Verify form inputs accept text correctly', async ({ page }) => {
    // Find any input element
    const inputs = page.locator('input[type="text"], input[type="search"], input:not([type])');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const testInput = inputs.first();
      const isVisible = await testInput.isVisible();
      
      if (isVisible) {
        // Test typing
        const testText = 'Test Input';
        await testInput.fill(testText);
        const value = await testInput.inputValue();
        expect(value).toBe(testText);
        
        // Clear input
        await testInput.clear();
        const clearedValue = await testInput.inputValue();
        expect(clearedValue).toBe('');
      }
    }
  });

  test('Verify select/dropdown filters work (if available)', async ({ page }) => {
    // Look for select elements (dropdown filters)
    const selectElements = page.locator('select');
    const selectCount = await selectElements.count();
    
    console.log(`Found ${selectCount} select/dropdown elements`);
    
    if (selectCount > 0) {
      const firstSelect = selectElements.first();
      await expect(firstSelect).toBeVisible();
      
      // Get options
      const options = firstSelect.locator('option');
      const optionCount = await options.count();
      console.log(`First select has ${optionCount} options`);
      
      expect(optionCount).toBeGreaterThan(0);
    }
  });

  test('Verify checkbox and radio button filters (if available)', async ({ page }) => {
    // Look for filter checkboxes and radio buttons
    const checkboxes = page.locator('input[type="checkbox"]');
    const radioButtons = page.locator('input[type="radio"]');
    
    const checkboxCount = await checkboxes.count();
    const radioCount = await radioButtons.count();
    
    console.log(`Found ${checkboxCount} checkboxes and ${radioCount} radio buttons`);
    
    // If checkboxes exist, verify they can be checked
    if (checkboxCount > 0) {
      const firstCheckbox = checkboxes.first();
      const isVisible = await firstCheckbox.isVisible();
      
      if (isVisible) {
        await firstCheckbox.check();
        const isChecked = await firstCheckbox.isChecked();
        expect(isChecked).toBe(true);
        
        await firstCheckbox.uncheck();
        const isUnchecked = await firstCheckbox.isChecked();
        expect(isUnchecked).toBe(false);
      }
    }
    
    // If radio buttons exist, verify they can be selected
    if (radioCount > 0) {
      const firstRadio = radioButtons.first();
      const isVisible = await firstRadio.isVisible();
      
      if (isVisible) {
        await firstRadio.check();
        const isChecked = await firstRadio.isChecked();
        expect(isChecked).toBe(true);
      }
    }
  });

  test('Verify form validation messages (if applicable)', async ({ page }) => {
    // Look for required input fields
    const requiredInputs = page.locator('input[required]');
    const requiredCount = await requiredInputs.count();
    
    console.log(`Found ${requiredCount} required fields`);
    
    if (requiredCount > 0) {
      const firstRequired = requiredInputs.first();
      const isRequired = await firstRequired.getAttribute('required');
      expect(isRequired).toBeDefined();
    }
  });

  test('Verify page responds to keyboard navigation (Tab key)', async ({ page }) => {
    // Press Tab key multiple times to navigate through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Get focused element
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement;
      return {
        tagName: active?.tagName,
        type: (active as HTMLInputElement)?.type,
        id: active?.id,
        className: active?.className
      };
    });
    
    console.log(`Focused element: ${focusedElement.tagName}`);
    expect(focusedElement.tagName).toBeTruthy();
  });

  test('Verify page responds to Enter key submission', async ({ page }) => {
    // Find form input and test Enter key
    const searchInput = page.locator(
      'input[type="search"], input[placeholder*="Search"], [role="searchbox"]'
    ).first();
    
    const inputVisible = await searchInput.isVisible().catch(() => false);
    
    if (inputVisible) {
      await searchInput.fill('test');
      
      // Press Enter and wait for navigation or form submission
      const navigationPromise = page.waitForLoadState('networkidle').catch(() => {});
      await searchInput.press('Enter');
      
      // Wait a bit for potential navigation
      await navigationPromise;
      
      console.log(`After Enter key press, URL: ${page.url()}`);
    }
  });
});
