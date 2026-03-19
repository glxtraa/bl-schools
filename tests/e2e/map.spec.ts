import { test, expect } from '@playwright/test';

test('click on school markers on the map', async ({ page }) => {
  await page.goto('/');

  // Wait for markers to be rendered
  // Leaflet markers are usually img elements with this class
  const markers = page.locator('img.leaflet-marker-icon');
  
  // Wait for at least one marker to appear
  await expect(markers.first()).toBeVisible({ timeout: 15000 });

  const count = await markers.count();
  console.log(`Found ${count} markers on the map`);

  for (let i = 0; i < count; i++) {
    const marker = markers.nth(i);
    console.log(`Clicking marker ${i}...`);
    
    // Click the marker - use force to ensure it clicks even if overlapping
    await marker.click({ force: true });

    // Verify a popup appears
    const popup = page.locator('.leaflet-popup-content').first();
    await expect(popup).toBeVisible();

    // Verify the popup contains some school info
    const schoolName = await popup.locator('h3').textContent();
    console.log(`Verified popup ${i} for school: ${schoolName}`);

    // Small delay to ensure UI stability
    await page.waitForTimeout(500);

    // Click the "X" on the popup if it exists to clean up, 
    // or just click the map background
    const closeButton = page.locator('.leaflet-popup-close-button');
    if (await closeButton.isVisible()) {
        await closeButton.click();
        await expect(popup).toBeHidden();
    }
  }
});
