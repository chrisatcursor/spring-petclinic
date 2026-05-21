/**
 * Manual UAT harness — exercises docs/UAT-REACT-MIGRATION.md matrix.
 * Run: node scripts/uat-manual-walkthrough.mjs
 * Requires Spring Boot SPA at http://localhost:8080 (or set BASE_URL) and
 * spring-petclinic-rest at http://localhost:9966.
 */
import { chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';
const RUN_ID = Date.now().toString().slice(-6);

function pathWithoutSession(url) {
  return url.pathname.split(';')[0].replace(/\/$/, '') || '/';
}

const results = [];

function record(id, pass, note = '') {
  results.push({ id, pass, note });
  if (!pass) {
    throw new Error(`${id} failed: ${note}`);
  }
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

try {
  // UAT-01
  await page.goto(`${BASE_URL}/`);
  await page.getByRole('heading', { name: 'Welcome' }).waitFor();
  await page.locator('img[src*="pets.png"]').waitFor();
  record('UAT-01', true);

  // UAT-02
  await page.getByTestId('nav-owners').click();
  record('UAT-02', page.url().includes('/owners/find'), 'Find Owners');
  await page.getByTestId('nav-vets').click();
  record('UAT-02', page.url().includes('/vets.html'), 'Vets');
  await page.getByTestId('nav-error').click();
  record('UAT-02', page.url().includes('/oups'), 'Error');
  await page.getByTestId('nav-home').click();
  record('UAT-02', /\/$/.test(new URL(page.url()).pathname) || page.url().endsWith('/'), 'Home');

  // UAT-03
  await page.goto(`${BASE_URL}/oups`);
  await page.getByRole('heading', { name: 'Something happened...' }).waitFor();
  record('UAT-03', true);

  // UAT-04
  await page.goto(`${BASE_URL}/nonexistent`);
  await page.getByText('Something happened...').waitFor();
  await page.getByText('The requested page was not found.').waitFor();
  record('UAT-04', true);

  // UAT-05
  await page.goto(`${BASE_URL}/owners/find`);
  await page.getByRole('button', { name: 'Find Owner' }).click();
  await page.waitForURL(/\/owners/);
  await page.getByTestId('owners-table').waitFor();
  const rowCount5 = await page.getByTestId('owner-row').count();
  record('UAT-05', rowCount5 === 5, `rows=${rowCount5}`);

  // UAT-06
  await page.goto(`${BASE_URL}/owners/find`);
  await page.getByLabel('Last Name').fill('Davis');
  await page.getByRole('button', { name: 'Find Owner' }).click();
  await page.waitForURL(/\/owners/);
  await page.getByTestId('owners-table').waitFor();
  const rowCount2 = await page.getByTestId('owner-row').count();
  record('UAT-06', rowCount2 === 2, `rows=${rowCount2}`);

  // UAT-07
  await page.goto(`${BASE_URL}/owners/find`);
  await page.getByLabel('Last Name').fill('Franklin');
  await page.getByRole('button', { name: 'Find Owner' }).click();
  await page.waitForURL(/\/owners\/1/);
  record('UAT-07', page.url().includes('/owners/1'));

  // UAT-08
  await page.goto(`${BASE_URL}/owners/find`);
  await page.getByLabel('Last Name').fill('Zzzzz');
  await page.getByRole('button', { name: 'Find Owner' }).click();
  await page.getByText('has not been found').waitFor();
  record('UAT-08', true);

  // UAT-09
  await page.goto(`${BASE_URL}/owners/1`);
  await page.getByText('George Franklin').waitFor();
  await page.getByText('Leo').waitFor();
  record('UAT-09', true);

  // UAT-10
  await page.goto(`${BASE_URL}/owners/new`);
  await page.getByLabel('First Name').fill('UatFirst');
  await page.getByLabel('Last Name').fill('UatLast');
  await page.getByLabel('Address').fill('1 UAT St');
  await page.getByLabel('City').fill('UatCity');
  await page.getByLabel('Telephone').fill('5551234567');
  await Promise.all([
    page.waitForURL((url) => /^\/owners\/\d+([;/]|$)/.test(url.pathname)),
    page.getByRole('button', { name: 'Add Owner' }).click(),
  ]);
  await page.getByText('New Owner Created').waitFor();
  record('UAT-10', true);

  // UAT-11 — restore demo phone after edit so later runs stay consistent
  await page.goto(`${BASE_URL}/owners/1/edit`);
  await page.getByLabel('Telephone').fill('6085551023');
  await Promise.all([
    page.waitForURL((url) => /^\/owners\/1([;/]|$)/.test(url.pathname)),
    page.getByRole('button', { name: 'Update Owner' }).click(),
  ]);
  await page.getByText('Owner Values Updated').waitFor();
  await page.getByText('6085551023').waitFor();
  record('UAT-11', true);

  // UAT-12
  await page.goto(`${BASE_URL}/owners/new`);
  await page.getByLabel('First Name').clear();
  await page.getByLabel('Last Name').clear();
  await page.getByLabel('Address').clear();
  await page.getByLabel('City').clear();
  await page.getByLabel('Telephone').clear();
  await page.getByRole('button', { name: 'Add Owner' }).click();
  const hasError = await page.locator('.has-error').first().isVisible();
  record('UAT-12', hasError);

  // UAT-13
  await page.goto(`${BASE_URL}/owners/new`);
  await page.getByLabel('First Name').fill('T');
  await page.getByLabel('Last Name').fill('U');
  await page.getByLabel('Address').fill('1 St');
  await page.getByLabel('City').fill('C');
  await page.getByLabel('Telephone').fill('abcdefghij');
  await page.getByRole('button', { name: 'Add Owner' }).click();
  await page.getByText(/must be a 10-digit number/).waitFor();
  record('UAT-13', true);

  // UAT-14
  const uatPetName = `UatPet${RUN_ID}`;
  await page.goto(`${BASE_URL}/owners/1`);
  await page.getByTestId('add-pet-link').click();
  await page.getByLabel('Name').fill(uatPetName);
  await page.getByLabel('Birth Date').fill('2020-05-15');
  await page.getByLabel('Type').selectOption('dog');
  await page.getByRole('button', { name: 'Add Pet' }).click();
  await page.getByText('New Pet has been Added').waitFor();
  record('UAT-14', true);

  // UAT-15
  await page.goto(`${BASE_URL}/owners/1`);
  await page.getByTestId('add-pet-link').click();
  await page.getByLabel('Name').fill('Leo');
  await page.getByLabel('Birth Date').fill('2020-01-01');
  await page.getByLabel('Type').selectOption('cat');
  await page.getByRole('button', { name: 'Add Pet' }).click();
  await page.getByText('is already in use').waitFor();
  record('UAT-15', true);

  // UAT-16
  await page.goto(`${BASE_URL}/owners/1`);
  await page.getByTestId('add-pet-link').click();
  await page.getByLabel('Name').fill('FuturePet');
  await page.getByLabel('Birth Date').fill('2027-01-01');
  await page.getByLabel('Type').selectOption('cat');
  await page.getByRole('button', { name: 'Add Pet' }).click();
  await page.getByText('invalid date').waitFor();
  record('UAT-16', true);

  // UAT-17 — edit first pet, then restore Leo for demo data consistency
  await page.goto(`${BASE_URL}/owners/1`);
  await page.getByRole('link', { name: 'Edit Pet' }).first().click();
  await page.getByLabel('Name').fill(`LeoUat${RUN_ID}`);
  await page.getByRole('button', { name: 'Update Pet' }).click();
  await page.waitForURL(
    (url) => pathWithoutSession(url) === '/owners/1' && !url.pathname.includes('/pets'),
  );
  await page.getByText('Pet details has been edited').waitFor();
  await page.getByRole('link', { name: 'Edit Pet' }).first().click();
  await page.getByLabel('Name').fill('Leo');
  await page.getByRole('button', { name: 'Update Pet' }).click();
  await page.waitForURL(
    (url) => pathWithoutSession(url) === '/owners/1' && !url.pathname.includes('/pets'),
  );
  record('UAT-17', true);

  // UAT-18
  await page.goto(`${BASE_URL}/owners/6`);
  await page.locator('tr').filter({ hasText: 'Samantha' }).getByRole('link', { name: 'Add Visit' }).click();
  await page.getByLabel('Date').fill('2024-03-15');
  await page.getByLabel('Description').fill(`uat visit ${RUN_ID}`);
  await page.getByRole('button', { name: 'Add Visit' }).click();
  await page.getByText('Your visit has been booked').waitFor();
  record('UAT-18', true);

  // UAT-19
  await page.goto(`${BASE_URL}/owners/6`);
  await page.getByRole('link', { name: 'Add Visit' }).first().click();
  await page.getByLabel('Date').fill('2024-06-20');
  await page.getByLabel('Description').fill(`uat dental ${RUN_ID}`);
  await page.getByRole('button', { name: 'Add Visit' }).click();
  await page.getByText(`uat dental ${RUN_ID}`).waitFor();
  record('UAT-19', true);

  // UAT-20
  await page.goto(`${BASE_URL}/vets.html`);
  await page.getByRole('heading', { name: 'Veterinarians' }).waitFor();
  const vetRows = await page.getByTestId('vet-row').count();
  record('UAT-20', vetRows === 5, `vets=${vetRows}`);

  // UAT-21
  await page.getByRole('link', { name: '2' }).click();
  await page.waitForURL(/page=2/);
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="vet-row"]').length === 1,
    null,
    { timeout: 5000 },
  );
  record('UAT-21', page.url().includes('page=2'));
  const vetRowsP2 = await page.getByTestId('vet-row').count();
  record('UAT-21', vetRowsP2 === 1, `page2 vets=${vetRowsP2}`);

  // UAT-22
  await page.goto(`${BASE_URL}/`);
  await page.getByTestId('nav-owners').click();
  await page.goBack();
  record('UAT-22', /\/$/.test(pathWithoutSession(new URL(page.url()))));
  await page.goForward();
  record('UAT-22', page.url().includes('/owners/find'));

  console.log('UAT manual walkthrough: PASS');
  console.table(results);
}
finally {
  await browser.close();
}
