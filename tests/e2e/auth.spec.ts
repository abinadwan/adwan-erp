import { test, expect } from '@playwright/test';

test('sign in form', async ({ page }) => {
  await page.goto('/en/(auth)/sign-in');
  await expect(page.locator('input[name="email"]')).toBeVisible();
});
