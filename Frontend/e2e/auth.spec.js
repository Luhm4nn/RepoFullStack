import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully as admin', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[id="email"]', 'admin@cutzy.com');
    await page.fill('input[id="password"]', '123456');
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/Dashboard', { timeout: 10000 });
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[id="email"]', 'invalid@test.com');
    await page.fill('input[id="password"]', 'wrongpass');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.bg-red-900\\/20')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[id="email"]', 'admin@cutzy.com');
    await page.fill('input[id="password"]', '123456');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('/Dashboard', { timeout: 10000 });
    
    await page.click('button[aria-label="Cerrar Sesión"]');
    
    const modal = page.locator('text=¿Estás seguro que deseas cerrar sesión?');
    await expect(modal).toBeVisible();
    
    await page.click('button:has-text("Sí, cerrar sesión")');
    
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});
