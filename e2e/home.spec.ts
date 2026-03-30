import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('GET / loads and shows Welcome heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  });

  test('PetClinic pets image is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('img[src*="pets.png"]')).toBeVisible();
  });

  test('Nav Home navigates to /', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-home').click();
    expect(page.url()).toMatch(/\/$/);
  });

  test('Nav Find Owners navigates to /owners/find', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-owners').click();
    expect(page.url()).toContain('/owners/find');
  });

  test('Nav Vets navigates to /vets.html', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-vets').click();
    expect(page.url()).toContain('/vets.html');
  });
});
