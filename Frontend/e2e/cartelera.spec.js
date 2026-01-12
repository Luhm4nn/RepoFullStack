import { test, expect } from '@playwright/test';

test.describe('Cartelera Page', () => {
  test('should display movies in cartelera', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('Cutzy Cinema', { timeout: 15000 });
    
    await expect(page.locator('text=Cargando cartelera...')).not.toBeVisible({ timeout: 15000 });
    
    const movieGrid = page.locator('.grid').first();
    await expect(movieGrid).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to movie details', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('text=Cargando cartelera...')).not.toBeVisible({ timeout: 15000 });
    
    const movieCards = page.locator('.bg-slate-800\\/60.rounded-xl');
    await expect(movieCards.first()).toBeVisible({ timeout: 10000 });
    
    const firstCard = movieCards.first();
    const movieTitle = await firstCard.locator('h2').textContent();
    
    await firstCard.locator('button:has-text("Ver detalles")').click();
    
    await expect(page).toHaveURL(/\/reservar\/\d+/, { timeout: 10000 });
  });
});
