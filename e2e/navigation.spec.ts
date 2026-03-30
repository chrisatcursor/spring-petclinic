import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('nav links navigate to correct URLs', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-owners').click();
    expect(page.url()).toContain('/owners/find');

    await page.getByTestId('nav-vets').click();
    expect(page.url()).toContain('/vets.html');

    await page.getByTestId('nav-error').click();
    expect(page.url()).toContain('/oups');

    await page.getByTestId('nav-home').click();
    expect(page.url()).toMatch(/\/$/);
  });

  test('/oups shows error page', async ({ page }) => {
    await page.goto('/oups');
    await expect(
      page.getByRole('heading', { name: 'Something happened...' }),
    ).toBeVisible();
  });

  test('unknown URL shows 404 error page', async ({ page }) => {
    await page.goto('/nonexistent');
    await expect(page.getByText('Something happened...')).toBeVisible();
    await expect(
      page.getByText('The requested page was not found.'),
    ).toBeVisible();
  });

  test('browser back/forward', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('nav-owners').click();
    expect(page.url()).toContain('/owners/find');

    await page.goBack();
    expect(page.url()).toMatch(/\/$/);

    await page.goForward();
    expect(page.url()).toContain('/owners/find');
  });
});
