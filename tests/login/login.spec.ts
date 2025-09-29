//import { test as base, expect, Page } from '@playwright/test';

// Extend the base test to include a loggedInPage fixture
//export const loggedInPageFixture = base.extend<{
//  loggedInPage: Page
//}>({
//  loggedInPage: async ({ page }, use) => {
//    await page.goto('/login');
//
//    await page.fill('input[name="username"]', 'testuser');
//    await page.fill('input[name="password"]', 'password123!');
//
//    await page.click('button[type="submit"]');
//
//    await page.waitForURL('**/home');
//
//    await use(page);
//  },
//});
