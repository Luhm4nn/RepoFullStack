import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully starting from home page', async ({ page }) => {
    // 1. Ir a Inicio
    await page.goto('/');
    
    // 2. Click "Iniciar Sesión"
    // Busca el enlace o botón que lleve a /login
    const loginLink = page.locator('a[href="/login"], button:has-text("Iniciar Sesión")').first();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);

    // 3. Completa credenciales
    await page.fill('input[id="email"]', 'admin@cutzy.com');
    await page.fill('input[id="password"]', '123456');
    
    // 4. Submit
    await page.click('button[type="submit"]');
    
    // 5. Verifica que estemos en Dashboard
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 15000 });
  });
});
