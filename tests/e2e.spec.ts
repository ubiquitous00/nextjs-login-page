import { test, expect } from '@playwright/test';
//import { loggedInPageFixture } from '@/tests/login/login.spec';

test.describe('Login as an existing user:', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle("Login");
  });

  test('should show error for invalid credentials', async ({ page })=> {
    await page.goto('/login');
    await page.fill('input[name="username"]', 'wrongUser');
    await page.fill('input[name="password"]', 'wrongPass');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator("text=Authentication failed. Please try again.");
    await expect(errorMessage).toBeVisible();
  })

  test('should log in with correct credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="password"]', "password123!");
    await page.click('button[type="submit"]'),
    await page.waitForURL('**/home')
  });
});

test.describe('Register as a new user, then login', () => {
  test('should load register page', async ({ page }) => {
    await page.goto('/register');

    await expect(page).toHaveTitle("Register");
    /* 
    TODO: WRITE AN END TO END TEST WHERE A NEW USER IS CREATED, AND THEN DELETE THAT USER AS WELL 
    Currently, there is no delete user functionality, so I cannot write this test.
    */
  });
});


test.describe('As a logged in user, verify address', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="password"]', "password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL('**/home');
  }),

  test('should navigate to verify, put in valid postcode, suburb and state', async ({ page }) => {
    await page.goto('/home/verify');
    await expect(page).toHaveURL('/home/verify')
    
    await page.fill('input[name="postcode"]', "3000");
    await page.fill('input[name="suburb"]', "MELBOURNE");
    await page.fill('input[name="state"]', "VIC");
    await page.click('button[type="submit"]');
    
    const successMessage = page.locator("text=/The postcode, suburb, and state input are valid/");
    await expect(successMessage).toBeVisible();
  });

  test('should navigate to verify, put an invalid postcode, and raise an error', async ({ page }) => {
    await page.goto('/home/verify');
    await expect(page).toHaveURL('/home/verify')
    
    await page.fill('input[name="postcode"]', "300000");
    await page.fill('input[name="suburb"]', "MELBOURNE");
    await page.fill('input[name="state"]', "VIC");
    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator("text=/The postcode 300000 does not match the suburb MELBOURNE/");
    await expect(errorMessage).toBeVisible();
  });

});
