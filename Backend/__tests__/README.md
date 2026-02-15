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
├── auth.test.js         # tests de login/refresh/logout
├── usuarios.test.js     # tests de CRUD + ownership
└── funciones.test.js    # tests de validaciones complejas
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


