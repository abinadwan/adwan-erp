import { test, expect } from '@playwright/test';

test('home page renders', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('nav')).toBeVisible();
});
