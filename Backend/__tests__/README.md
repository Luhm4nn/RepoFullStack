# Testing Setup

## Ejecutar Tests

```bash
npm test                  # Ejecutar todos
npm run test:watch        # Modo watch
npm run test:coverage     # Con cobertura
```

## Estructura

```
__tests__/
├── helpers.js           # getAdminToken(), getUserToken(), cleanup()
├── auth.test.js         # 8 tests de login/refresh/logout
├── usuarios.test.js     # 13 tests de CRUD + ownership
└── funciones.test.js    # 12 tests de validaciones complejas
```

## Tests Implementados (33 total)

**Auth** - Login, refresh, logout, cookies httpOnly  
**Usuarios** - CRUD, RBAC, ownership validation  
**Funciones** - Solapamiento, fecha de estreno, estados

## Requisitos

Necesitás en la BD:

- Usuario admin: `admin@cinema.com` / `admin123` / rol `ADMIN`
- Al menos 1 Película (id: 1)
- Al menos 1 Sala (id: 1)

## Agregar Nuevos Tests

```javascript
import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { getAdminToken } from './helpers.js';

describe('Mi Entidad', () => {
  let adminToken;
  beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  test('descripción', async () => {
    const res = await request(app).get('/endpoint').set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });
});
```

## Debugging

```bash
npm test -- --verbose           # Ver detalle
npm test -- auth.test.js        # Un archivo
npm test -- -t "parte del nombre"  # Un test específico
```
