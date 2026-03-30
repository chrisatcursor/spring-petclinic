import { test, expect } from '@playwright/test';

test.describe('Owner CRUD', () => {
  test('displays owner details', async ({ page }) => {
    await page.goto('/owners/1');
    await expect(page.getByTestId('owner-information')).toBeVisible();
    await expect(page.getByText('George Franklin')).toBeVisible();
    await expect(page.getByText('110 W. Liberty St.')).toBeVisible();
    await expect(page.getByText('Madison')).toBeVisible();
    await expect(page.getByText('6085551023')).toBeVisible();
    await expect(page.getByTestId('pets-and-visits')).toBeVisible();
    await expect(page.getByText('Leo')).toBeVisible();
  });

  test('adds a new owner', async ({ page }) => {
    await page.goto('/owners/new');
    await expect(page.getByTestId('owner-form')).toBeVisible();
    await page.getByLabel('First Name').fill('TestFirst');
    await page.getByLabel('Last Name').fill('TestLast');
    await page.getByLabel('Address').fill('123 Test St.');
    await page.getByLabel('City').fill('TestCity');
    await page.getByLabel('Telephone').fill('1234567890');
    await Promise.all([
      page.waitForURL((url) => /^\/owners\/\d+([;/]|$)/.test(url.pathname)),
      page.getByRole('button', { name: 'Add Owner' }).click(),
    ]);
    await expect(page.getByText('New Owner Created')).toBeVisible();
    await expect(page.getByText('TestFirst TestLast')).toBeVisible();
    await expect(page.getByText('123 Test St.')).toBeVisible();
    await expect(page.getByText('1234567890')).toBeVisible();
  });

  test('edits an existing owner', async ({ page }) => {
    await page.goto('/owners/1');
    await page.getByTestId('edit-owner-link').click();
    await expect(page).toHaveURL(/\/owners\/1\/edit/);
    await page.getByLabel('Telephone').clear();
    await page.getByLabel('Telephone').fill('1112223333');
    await Promise.all([
      page.waitForURL((url) => /^\/owners\/1([;/]|$)/.test(url.pathname)),
      page.getByRole('button', { name: 'Update Owner' }).click(),
    ]);
    await expect(page.getByText('Owner Values Updated')).toBeVisible();
    await expect(page.getByText('1112223333')).toBeVisible();
  });

  test('shows validation errors on blank form submission', async ({ page }) => {
    await page.goto('/owners/new');
    await page.getByLabel('First Name').clear();
    await page.getByLabel('Last Name').clear();
    await page.getByLabel('Address').clear();
    await page.getByLabel('City').clear();
    await page.getByLabel('Telephone').clear();
    await page.getByRole('button', { name: 'Add Owner' }).click();
    await expect(page.getByTestId('owner-form')).toBeVisible();
    await expect(page.locator('.has-error').first()).toBeVisible();
  });

  test('shows telephone validation error', async ({ page }) => {
    await page.goto('/owners/new');
    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Address').fill('123 St');
    await page.getByLabel('City').fill('City');
    await page.getByLabel('Telephone').fill('abcdefghij');
    await page.getByRole('button', { name: 'Add Owner' }).click();
    await expect(page.getByText(/must be a 10-digit number/)).toBeVisible();
  });
});
