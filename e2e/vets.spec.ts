import { test, expect } from '@playwright/test';

test.describe('Veterinarians', () => {
  test('displays vet list with table', async ({ page }) => {
    await page.goto('/vets.html');
    await expect(page.getByRole('heading', { name: 'Veterinarians' })).toBeVisible();
    await expect(page.getByTestId('vets-table')).toBeVisible();
    await expect(page.getByTestId('vet-row')).toHaveCount(5);
  });

  test('shows vet specialties', async ({ page }) => {
    await page.goto('/vets.html');
    await expect(page.getByText('radiology').first()).toBeVisible();
    await expect(page.getByText('surgery').first()).toBeVisible();
  });

  test('shows none for vets without specialties', async ({ page }) => {
    await page.goto('/vets.html');
    await expect(page.getByTestId('vets-table').getByText('none').first()).toBeVisible();
  });

  test('pagination works', async ({ page }) => {
    await page.goto('/vets.html');
    await page.getByRole('link', { name: '2' }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByTestId('vets-table')).toBeVisible();
    await expect(page.getByTestId('vet-row')).toHaveCount(1);
  });
});
