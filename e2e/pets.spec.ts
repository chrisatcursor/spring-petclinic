import { test, expect } from '@playwright/test';

function pathWithoutSession(url: URL) {
  return url.pathname.split(';')[0].replace(/\/$/, '') || '/';
}

test.describe('Pet management', () => {
  test('adds a new pet to an owner', async ({ page }) => {
    await page.goto('/owners/1');
    await page.getByTestId('add-pet-link').click();
    await expect(page.getByTestId('pet-form')).toBeVisible();
    await page.getByLabel('Name').fill('TestPet');
    await page.getByLabel('Birth Date').fill('2020-05-15');
    await page.getByLabel('Type').selectOption('dog');
    await page.getByRole('button', { name: 'Add Pet' }).click();
    await expect(page).toHaveURL(
      (url) => pathWithoutSession(url) === '/owners/1' && !url.pathname.includes('/pets')
    );
    await expect(page.getByText('New Pet has been Added')).toBeVisible();
    await expect(page.getByText('TestPet')).toBeVisible();
  });

  test('shows error for duplicate pet name', async ({ page }) => {
    await page.goto('/owners/1');
    await page.getByTestId('add-pet-link').click();
    await page.getByLabel('Name').fill('Leo');
    await page.getByLabel('Birth Date').fill('2020-01-01');
    await page.getByLabel('Type').selectOption('cat');
    await page.getByRole('button', { name: 'Add Pet' }).click();
    await expect(page.getByTestId('pet-form')).toBeVisible();
    await expect(page.getByText('is already in use')).toBeVisible();
  });

  test('shows error for future birth date', async ({ page }) => {
    await page.goto('/owners/1');
    await page.getByTestId('add-pet-link').click();
    await page.getByLabel('Name').fill('FuturePet');
    await page.getByLabel('Birth Date').fill('2027-01-01');
    await page.getByLabel('Type').selectOption('cat');
    await page.getByRole('button', { name: 'Add Pet' }).click();
    await expect(page.getByTestId('pet-form')).toBeVisible();
    await expect(page.getByText('invalid date')).toBeVisible();
  });

  test('edits a pet', async ({ page }) => {
    await page.goto('/owners/1');
    await page.getByRole('link', { name: 'Edit Pet' }).first().click();
    await expect(page.getByTestId('pet-form')).toBeVisible();
    await page.getByLabel('Name').clear();
    await page.getByLabel('Name').fill('LeoUpdated');
    await page.getByRole('button', { name: 'Update Pet' }).click();
    await expect(page).toHaveURL(
      (url) => pathWithoutSession(url) === '/owners/1' && !url.pathname.includes('/pets')
    );
    await expect(page.getByText('Pet details has been edited')).toBeVisible();
    await expect(page.getByText('LeoUpdated')).toBeVisible();
  });
});
