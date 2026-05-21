/**
 * UAT screenshot capture — produces visual evidence for every major SPA page
 * after the migration. Writes PNGs to /opt/cursor/artifacts/uat-screenshots/.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';
const OUT_DIR = '/opt/cursor/artifacts/uat-screenshots';
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function shot(name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('saved', file);
}

try {
  await page.goto(`${BASE_URL}/`);
  await page.getByRole('heading', { name: 'Welcome' }).waitFor();
  await shot('01-home');

  await page.goto(`${BASE_URL}/owners/find`);
  await page.getByTestId('search-owner-form').waitFor();
  await shot('02-find-owners');

  await page.goto(`${BASE_URL}/owners`);
  await page.getByTestId('owners-table').waitFor();
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="owner-row"]').length === 5,
  );
  await shot('03-owners-list');

  await page.goto(`${BASE_URL}/owners/1`);
  await page.getByTestId('owner-information').waitFor();
  await shot('04-owner-detail');

  await page.goto(`${BASE_URL}/owners/new`);
  await page.getByTestId('owner-form').waitFor();
  await shot('05-owner-new');

  await page.goto(`${BASE_URL}/owners/1/edit`);
  await page.getByTestId('owner-form').waitFor();
  await shot('06-owner-edit');

  await page.goto(`${BASE_URL}/owners/1/pets/new`);
  await page.getByTestId('pet-form').waitFor();
  await shot('07-pet-new');

  await page.goto(`${BASE_URL}/owners/1/pets/1/edit`);
  await page.getByTestId('pet-form').waitFor();
  await shot('08-pet-edit');

  await page.goto(`${BASE_URL}/owners/6/pets/7/visits/new`);
  await page.getByTestId('visit-form').waitFor();
  await shot('09-visit-new');

  await page.goto(`${BASE_URL}/vets.html`);
  await page.getByTestId('vets-table').waitFor();
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="vet-row"]').length === 5,
  );
  await shot('10-vets-page1');

  await page.goto(`${BASE_URL}/vets.html?page=2`);
  await page.getByTestId('vets-table').waitFor();
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="vet-row"]').length === 1,
  );
  await shot('11-vets-page2');

  await page.goto(`${BASE_URL}/oups`);
  await page.getByRole('heading', { name: 'Something happened...' }).waitFor();
  await shot('12-error-oups');

  await page.goto(`${BASE_URL}/no-such-route`);
  await page.getByText('The requested page was not found.').waitFor();
  await shot('13-404');

  console.log('UAT screenshots: PASS');
}
finally {
  await browser.close();
}
