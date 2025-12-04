# Playwright E2E Tests

## Ejecutar tests

```bash
# Todos los tests
npm run test:e2e

# UI mode (recomendado para desarrollo)
npm run test:e2e:ui

# Con navegador visible
npm run test:e2e:headed

# Ver último reporte
npm run test:e2e:report
```

## Estructura

```
e2e/
├── auth.spec.js          # Tests de autenticación
├── cartelera.spec.js     # Tests de cartelera
└── fixtures.js           # Helpers reutilizables
```

## Escribir tests

```js
import { test, expect } from '@playwright/test';

test('mi test', async ({ page }) => {
  await page.goto('/ruta');
  await page.click('button');
  await expect(page.locator('h1')).toContainText('Texto');
});
```

## Con autenticación

```js
import { test, expect } from './fixtures.js';

test('test autenticado', async ({ authenticatedPage }) => {
  // Ya estás logueado en /admin
  await authenticatedPage.goto('/admin/peliculas');
});
```
