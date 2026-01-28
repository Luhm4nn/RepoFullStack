import { test, expect } from '@playwright/test';

test.describe('Funciones E2E', () => {

  test('debe crear y eliminar una funcion correctamente', async ({ page }) => {
    // 1. Login
    console.log('Paso 1: Logueandose...');
    await page.goto('/login');
    await page.fill('input[id="email"]', 'admin@cutzy.com');
    await page.fill('input[id="password"]', '123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/Dashboard/i, { timeout: 15000 });
    console.log('Login exitoso');

    // 2. Navegar a Funciones
    console.log('Paso 2: Navegando a Funciones...');
    await page.goto('/Funciones');
    await expect(page).toHaveURL(/\/Funciones/i);
    console.log('Navegacion exitosa');

    // 3. Abrir Modal de Creacion
    console.log('Paso 3: Abriendo Modal...');
    await page.click('button:has-text("Añadir Función")');
    await expect(page.locator('h2:has-text("Agregar Nueva Función")')).toBeVisible();
    console.log('Modal abierto');

    // 4. Rellenar Sala (Buscar y Seleccionar)
    console.log('Paso 4: Rellenando Sala...');
    const salaInput = page.locator('#search-sala');
    await salaInput.fill('A1');
    await page.waitForTimeout(5000); // Wait for debounce and backend
    await expect(page.locator('.absolute.z-20').first()).toBeVisible({ timeout: 10000 });
    await page.click('.absolute.z-20 > div:first-child'); 
    console.log('Sala seleccionada');

    await page.waitForTimeout(5000); // Wait for debounce and backend

    // 5. Rellenar Pelicula (Buscar y Seleccionar)
    console.log('Paso 5: Rellenando Pelicula...');
    const peliInput = page.locator('#search-pelicula');
    await peliInput.fill('star');
    await page.waitForTimeout(5000); // Wait for debounce and backend
    await expect(page.locator('.absolute.z-20').last()).toBeVisible({ timeout: 10000 }); 
    await page.click('.absolute.z-20 > div:first-child');
    console.log('Pelicula seleccionada');

    // 6. Rellenar Fecha (Mañana a las 20:00)
    console.log('Paso 6: Rellenando Fecha...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const hours = String(tomorrow.getHours()).padStart(2, '0');
    const minutes = String(tomorrow.getMinutes()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}T${hours}:${minutes}`;

    await page.fill('input[name="fechaHoraFuncion"]', dateString);
    console.log('Fecha rellenada');

    // 7. Guardar
    console.log('Paso 7: Guardando...');
    await page.click('button:has-text("Guardar Función")');
    console.log('Guardado');

    // 8. Verificar Creacion
    console.log('Paso 8: Verificando creacion...');
    await page.waitForTimeout(2000); 
    const row = page.locator('tr:has-text("Star Wars")').first();
    await expect(row).toBeVisible();
    console.log('Creacion verificada');

    // 9. Eliminar
    console.log('Paso 9: Eliminando...');
    await row.locator('button:has-text("Eliminar")').click();
    console.log('Eliminado');

    // 10. Confirmar Eliminacion
    console.log('Paso 10: Confirmando eliminacion...');
    await expect(page.locator('text=¿Estás seguro de que quieres eliminar esta función?')).toBeVisible();
    await page.getByRole('button', { name: 'Sí, eliminar' }).click();
    console.log('Eliminacion confirmada');

    // 11. Verificar Eliminacion
    console.log('Paso 11: Verificando eliminacion...');
    await expect(page.locator('text=Función eliminada exitosamente')).toBeVisible({timeout: 10000});
    await expect(row).not.toBeVisible();
    console.log('Eliminacion verificada');
  });
});
