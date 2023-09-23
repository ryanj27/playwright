// auth.setup.ts
import { expect, selectors, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
setup('authenticate', async ({ page }) => {
  // Auth0 Login

  // This env variable cannot be USER or it'll pick up the USER env variable from your machine.
  const user = process.env.USERNAME;
  const pass = process.env.PASSWORD;
  const login = process.env.LOGIN;
  const success = process.env.SUCCESS;

  // The Auth0 login form username field, password field, and submit button don't have any useful
  // attributes that Playwright can identify by. And Playwright doesn't have the largest assortment
  // of getBy options so as a workaround I'm setting the test ID as the name attribute so then I
  // can use getByTestId to grab the elements I need. Note that this does not persist into the
  // tests. The test ID will reset to 'data-testid' in the tests.
  selectors.setTestIdAttribute('name');

  if (!user || !pass) {
    throw new Error('You must set a username and password.');
  }

  if (!login) {
    throw new Error('You must set a login page.');
  }

  if (!success) {
    throw new Error('You must have a successful login URL.');
  }

  await page.goto(login);
  await page.getByTestId('username').fill(user);
  const submit = page.getByTestId('action');
  await submit.click();
  await page.getByTestId('password').fill(pass);

  // For some strange reason Playwright thinks there are two submit buttons at this point.
  await submit.last().click();
  await page.waitForURL(success);

  await page.context().storageState({ path: authFile });
});
