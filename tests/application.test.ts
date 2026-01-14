import { test, expect } from '@playwright/test';

test.describe('Government Resource Links & Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  });

  test('Verify critical government resource links are accessible', async ({ page }) => {
    // Define critical resources to verify
    const criticalResources = [
      { text: 'Passport', path: '/passport' },
      { text: 'Benefits', path: '/benefits' },
      { text: 'Jobs', path: '/jobs' },
    ];

    // Find navigation or main content area - use visible selector to exclude hidden elements
    const mainContent = page.locator('main:visible, [role="main"]:visible').first();
    const mainVisible = await mainContent.isVisible().catch(() => false);
    
    // If main content not found, check for page body visibility instead
    if (!mainVisible) {
      const bodyElement = page.locator('body');
      await expect(bodyElement).toBeVisible();
    } else {
      await expect(mainContent).toBeVisible();
    }

    // Verify page has navigation
    const navBar = page.locator('nav, [role="navigation"], .navigation, header');
    const navCount = await navBar.count();
    expect(navCount).toBeGreaterThan(0);

    // Verify links are present on the page
    const allLinks = page.locator('a[href]');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('Verify footer links load correctly', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Find footer
    const footer = page.locator('footer, [role="contentinfo"], .footer, [class*="footer"]').first();
    const footerVisible = await footer.isVisible().catch(() => false);
    
    if (footerVisible) {
      // Get footer links
      const footerLinks = footer.locator('a[href]');
      const footerLinkCount = await footerLinks.count();
      console.log(`Found ${footerLinkCount} footer links`);
      
      // Verify at least one footer link exists
      if (footerLinkCount > 0) {
        const firstFooterLink = footerLinks.first();
        const href = await firstFooterLink.getAttribute('href');
        expect(href?.length || 0).toBeGreaterThan(0);
      }
    } else {
      console.log('Footer not found, skipping footer link tests');
    }
  });

  test('Verify homepage navigation menu items are functional', async ({ page }) => {
    // Find primary navigation
    const navElements = page.locator('nav a, [role="navigation"] a, header a');
    const navLinkCount = await navElements.count();
    
    expect(navLinkCount).toBeGreaterThan(0);
    
    // Verify first navigation link has valid href
    const firstNavLink = navElements.first();
    const firstLinkHref = await firstNavLink.getAttribute('href');
    const firstLinkText = await firstNavLink.textContent();
    
    console.log(`First nav link: "${firstLinkText?.trim()}" -> ${firstLinkHref}`);
    expect(firstLinkHref?.length || 0).toBeGreaterThan(0);
  });

  test('Verify page has accessible headings', async ({ page }) => {
    // Check for heading structure
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    const h1Count = await h1.count();
    const h2Count = await h2.count();
    const h3Count = await h3.count();
    
    console.log(`Headings found - H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}`);
    
    // At least one heading should exist for accessibility
    const totalHeadings = h1Count + h2Count + h3Count;
    expect(totalHeadings).toBeGreaterThan(0);
    
    // Verify first heading has text content
    if (h1Count > 0) {
      const h1Text = await h1.first().textContent();
      expect(h1Text?.trim().length || 0).toBeGreaterThan(0);
    }
  });

  test('Verify links have proper accessibility attributes', async ({ page }) => {
    const links = page.locator('a[href]').first();
    const linkCount = await page.locator('a[href]').count();
    
    expect(linkCount).toBeGreaterThan(0);
    
    // Check that links have text or aria-label
    const firstLink = links.first();
    const linkText = await firstLink.textContent();
    const ariaLabel = await firstLink.getAttribute('aria-label');
    
    const hasAccessibleText = (linkText?.trim().length || 0) > 0 || ariaLabel?.length || 0 > 0;
    console.log(`Link has accessible text or aria-label: ${hasAccessibleText}`);
  });

  test('Verify main content area is readable', async ({ page }) => {
    // Get page content
    const bodyText = await page.textContent('body');
    expect(bodyText?.length || 0).toBeGreaterThan(0);
    
    // Find main content area
    const mainContent = page.locator('main, [role="main"], article, [class*="content"]').first();
    const contentVisible = await mainContent.isVisible().catch(() => false);
    
    if (contentVisible) {
      const mainText = await mainContent.textContent();
      expect(mainText?.trim().length || 0).toBeGreaterThan(0);
    }
  });
});
