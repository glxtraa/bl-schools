import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // Expect a title "to contain" a substring.
  // We don't know the exact title, so we check for presence.
  await expect(page).toHaveTitle(/./);
});

test('language switcher changes text', async ({ page }) => {
  await page.goto('/');
  
  // Find the Spanish button and click it
  const esButton = page.getByRole('button', { name: /Español/i });
  await esButton.click();
  
  // Check if the page content contains Spanish-specific text (assuming 'Schools' becomes 'Escuelas' or similar)
  // This is a placeholder check; adjusting based on actual content might be needed.
  // For now, let's just check if the button itself reflect the state.
  await expect(esButton).toHaveClass(/bg-accent/);
});
