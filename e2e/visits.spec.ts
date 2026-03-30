import { test, expect } from '@playwright/test';

test.describe('Visit scheduling', () => {
  test('adds a visit to a pet', async ({ page }) => {
    await page.goto('/owners/6');
    await page.locator('tr').filter({ hasText: 'Samantha' }).getByRole('link', { name: 'Add Visit' }).click();
    await expect(page.getByTestId('visit-form')).toBeVisible();
    await expect(page.getByText('Samantha')).toBeVisible();
    await expect(page.getByText('Previous Visits')).toBeVisible();
    await page.getByLabel('Date').fill('2024-03-15');
    await page.getByLabel('Description').fill('annual checkup');
    await page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(page).toHaveURL(/\/owners\/6/);
    await expect(page.getByText('Your visit has been booked')).toBeVisible();
  });

  test('visit appears on owner detail page', async ({ page }) => {
    await page.goto('/owners/6');
    await page.getByRole('link', { name: 'Add Visit' }).first().click();
    await page.getByLabel('Date').fill('2024-06-20');
    await page.getByLabel('Description').fill('dental cleaning');
    await page.getByRole('button', { name: 'Add Visit' }).click();
    await expect(page).toHaveURL(/\/owners\/6/);
    await expect(page.getByText('dental cleaning')).toBeVisible();
  });
});
