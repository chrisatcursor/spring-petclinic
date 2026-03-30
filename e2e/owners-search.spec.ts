import { test, expect } from '@playwright/test';

test.describe('Owner search', () => {
  test('search form is displayed', async ({ page }) => {
    await page.goto('/owners/find');
    await expect(page.getByTestId('search-owner-form')).toBeVisible();
    await expect(page.getByLabel('Last Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Find Owner' })).toBeVisible();
  });

  test('empty search returns all owners', async ({ page }) => {
    await page.goto('/owners/find');
    await page.getByRole('button', { name: 'Find Owner' }).click();
    await page.waitForURL(/\/owners/);
    expect(page.url()).toContain('/owners');
    await expect(page.getByTestId('owners-table')).toBeVisible();
    await expect(page.getByTestId('owner-row')).toHaveCount(5);
  });

  test('search by last name returns filtered results', async ({ page }) => {
    await page.goto('/owners/find');
    await page.getByLabel('Last Name').fill('Davis');
    await page.getByRole('button', { name: 'Find Owner' }).click();
    await expect(page.getByTestId('owners-table')).toBeVisible();
    await expect(page.getByTestId('owner-row')).toHaveCount(2);
    await expect(page.getByText('Betty Davis')).toBeVisible();
    await expect(page.getByText('Harold Davis')).toBeVisible();
  });

  test('single result redirects to owner detail', async ({ page }) => {
    await page.goto('/owners/find');
    await page.getByLabel('Last Name').fill('Franklin');
    await page.getByRole('button', { name: 'Find Owner' }).click();
    await page.waitForURL(/\/owners\/1/);
    expect(page.url()).toContain('/owners/1');
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
  });

  test('no results shows not found message', async ({ page }) => {
    await page.goto('/owners/find');
    await page.getByLabel('Last Name').fill('Zzzzz');
    await page.getByRole('button', { name: 'Find Owner' }).click();
    await expect(page.getByText('has not been found')).toBeVisible();
  });
});
