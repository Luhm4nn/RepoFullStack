# 🎬 Defensa del Proyecto — Cutzy Cinema

> **Guía completa para defender el sistema de reservas de cine Cutzy.**
> Cada sección incluye: qué hace, cómo lo hace, por qué se eligió esa solución, y preguntas frecuentes con respuestas preparadas.

---

## Índice

1. [Arquitectura y Estructura del Software](#1-arquitectura-y-estructura-del-software)
2. [Manejo de Sesiones y Seguridad](#2-manejo-de-sesiones-y-seguridad)
3. [Flujo de Reserva y Transacciones Atómicas](#3-flujo-de-reserva-y-transacciones-atómicas)
4. [UX/UI: Mobile First y Estética](#4-uxui-mobile-first-y-estética)
5. [Filtrado y Paginación (Performance)](#5-filtrado-y-paginación-performance)
6. [Integraciones Externas](#6-integraciones-externas)
7. [Sistema de Validación QR](#7-sistema-de-validación-qr)
8. [Calidad y Testing](#8-calidad-y-testing)
9. [Preguntas Clave de Defensa](#9-preguntas-clave-de-defensa)

---

## 1. Arquitectura y Estructura del Software

### 1.1 Backend — Node.js + Express (Arquitectura por Capas)

El backend está organizado en una **arquitectura modular por capas** (Layered Architecture). No es un solo archivo monolítico; cada dominio del negocio (Películas, Salas, Funciones, Reservas, Auth, etc.) está separado en su propia carpeta con 4 capas bien definidas:

```
Request → Routes → Controllers → Services → Repositories → Base de Datos
```

| Capa | Responsabilidad | Ejemplo (Funciones) |
|------|----------------|---------------------|
| **Routes** | Define endpoints HTTP, aplica middlewares (auth, validación, rate limit) | `funciones.routes.js` |
| **Controllers** | Recibe request/response, delega al Service y devuelve la respuesta | `funciones.controllers.js` |
| **Services** | Contiene la **lógica de negocio** (validaciones, reglas, cálculos) | `funciones.service.js` |
| **Repositories** | Única capa que habla con la base de datos (queries Prisma) | `funciones.repository.js` |

**Ejemplo concreto — Crear una Función:**

```javascript
// 1. ROUTE: Define endpoint y middlewares
router.post('/Funcion',
  authMiddleware,                              // ¿Está logueado?
  authorizeRoles('ADMIN'),                     // ¿Es ADMIN?
  validateBody(funcionesSchema),               // ¿Los datos son válidos? (Yup)
  asyncHandler(createFuncion)                  // Ejecutar controller
);

// 2. CONTROLLER: Recibe req/res, delega al service
export const createFuncion = async (req, res) => {
  const result = await service.create(req.body);
  res.status(201).json(result);
};

// 3. SERVICE: Lógica de negocio
export const create = async (data) => {
  const solapamiento = await verificarSolapamientos(data); // ¿Se pisa con otra función?
  const estrenoProblem = await verificarFechaDeEstreno(data); // ¿La peli ya se estrenó?
  if (solapamiento) return solapamiento;
  return await repository.create(data);
};

// 4. REPOSITORY: Query a la base de datos
async function create(data) {
  return await prisma.funcion.create({ data });
}
```

**¿Por qué esta arquitectura?**
- **Mantenibilidad**: Si cambiamos de base de datos (ej: de PostgreSQL a MongoDB), solo tocamos los Repositories. El Service y el Controller no se enteran.
- **Testeo**: Podemos testear cada capa de forma independiente (unit tests al service, integration tests al controller).
- **Separación de responsabilidades**: El Controller no sabe de SQL. El Repository no sabe de HTTP status codes. El Service no sabe de cookies.

### 1.2 Registro centralizado de rutas

Todas las rutas se conectan desde un **único punto de entrada** en `index.routes.js`:

```javascript
router.use(peliculasRoutes);       // Películas
router.use(salasRoutes);           // Salas
router.use(funcionesRoutes);       // Funciones (horarios)
router.use(reservasRoutes);        // Reservas
router.use('/auth', authRoutes);   // Autenticación
router.use(mercadopagoRoutes);     // Pagos
router.use(qrRoutes);             // Códigos QR
router.use(reportesRoutes);        // Reportes
// ... etc
```

Incluye un endpoint `/health` que verifica que la API y la DB estén funcionando:

```javascript
router.get('/health', async (req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.status(200).json({ status: 'ok', db: 'ok', uptime: process.uptime() });
});
```

### 1.3 ORM — Prisma con PostgreSQL

Usamos **Prisma** como ORM. El esquema (`schema.prisma`) refleja relaciones complejas del dominio del cine:

**Modelos principales y sus relaciones:**

```
pelicula ──1:N──> funcion ──1:N──> reserva ──1:N──> asiento_reserva
                    │                  │                    │
                    └── sala ──1:N─────┘       asiento ─────┘
                                               │
                                           tarifa
```

| Modelo | Clave Primaria | Relaciones clave |
|--------|---------------|-----------------|
| `pelicula` | `idPelicula` (autoincrement) | Tiene muchas `funcion` |
| `sala` | `idSala` (autoincrement) | Tiene muchos `asiento` y `funcion` |
| `funcion` | **Compuesta**: `(idSala, fechaHoraFuncion)` | Pertenece a `pelicula` y `sala`, tiene muchas `reserva` |
| `reserva` | **Compuesta 4 partes**: `(idSala, fechaHoraFuncion, DNI, fechaHoraReserva)` | Pertenece a `funcion` y `usuario`, tiene muchos `asiento_reserva` |
| `asiento_reserva` | **Compuesta**: `(idSala, filaAsiento, nroAsiento, fechaHoraFuncion)` | Vincula asiento con reserva — actúa como **soft lock** |
| `asiento` | **Compuesta**: `(idSala, filaAsiento, nroAsiento)` | Pertenece a `sala` y `tarifa` |
| `tarifa` | `idTarifa` (autoincrement) | Define precios por tipo de asiento |
| `usuario` | `DNI` | Tiene muchas `reserva` y `refresh_token` |
| `parametro` | `idParametro` | Parámetros configurables del sistema (ej: timeout de reserva) |

**¿Por qué Prisma?**
- Integridad referencial automática (FK constraints)
- Migraciones versionadas
- Type-safe queries
- Soporte nativo para transacciones atómicas (`$transaction`)
- Cascade delete configurado (ej: borrar sala elimina sus asientos)

### 1.4 Frontend — React + Vite

El frontend está organizado por **módulos según rol de usuario**:

```
Frontend/src/
├── api/                    # Capa de comunicación con el backend
│   ├── axiosInstance.js    # Instancia Axios con interceptores
│   ├── Reservas.api.js     # Endpoints de reservas
│   ├── MercadoPago.api.js  # Endpoints de pago
│   └── scanner.api.js      # Endpoint de validación QR
│
├── context/                # Estado global (Context API)
│   ├── AuthContext.jsx     # Autenticación y roles
│   └── NotificationContext.jsx  # Sistema de notificaciones
│
├── modules/
│   ├── admin/              # 🔐 Solo ADMIN — Gestión de películas, salas, funciones, reportes
│   ├── user/               # 👤 Solo CLIENTE — Reservas, perfil, historial
│   ├── scanner/            # 📱 Solo ESCANER — Validación de entradas QR
│   └── shared/             # 🌐 Compartido — Login, cartelera pública, 404, footer
│
├── utils/                  # Utilidades (debounce, formateo de fechas/precios)
├── validations/            # Esquemas Yup del frontend
└── constants/              # Constantes compartidas
```

**¿Por qué esta organización?**
- Cada módulo es auto-contenido (pages, components, hooks).
- Un desarrollador que trabaja en el admin no necesita tocar código del scanner.
- Los componentes `shared/` se reutilizan entre módulos (Pagination, Skeleton, ProtectedRoute).

**Context API en lugar de Redux:**
- Usamos `AuthContext` para manejar: usuario logueado, estado de autenticación, roles, login/logout/register.
- Usamos `NotificationContext` para el sistema de notificaciones globales con React Hot Toast.
- **¿Por qué no Redux?** La complejidad del estado no lo justifica. Nuestro estado global es solo auth + notificaciones. Para estados de página usamos hooks locales.

---

## 2. Manejo de Sesiones y Seguridad

> **Este es uno de los puntos más fuertes de la aplicación.** Implementamos un sistema de autenticación a nivel profesional/bancario.

### 2.1 Estrategia de Doble Token

| Token | Ubicación | Vida útil | Propósito |
|-------|-----------|-----------|-----------|
| **Access Token** | Cookie `httpOnly` | 1 hora | Autenticar cada request a la API |
| **Refresh Token** | Cookie `httpOnly` + Base de datos | 7 días | Renovar el Access Token sin re-login |

**¿Por qué DOS tokens?**
- El **Access Token** tiene vida corta (1h) para limitar el daño si es comprometido.
- El **Refresh Token** tiene vida larga (7d) para que el usuario no tenga que loguearse cada hora.
- Si alguien roba el Access Token, solo sirve por 1 hora. Si roba el Refresh Token, está almacenado en la DB así que podemos invalidarlo inmediatamente.

### 2.2 Cookies httpOnly — Protección contra XSS

```javascript
// EN EL LOGIN — auth.service.js
res.cookie('accessToken', accessToken, {
  httpOnly: true,                                          // JavaScript NO puede leer esta cookie
  secure: process.env.NODE_ENV === 'production',           // Solo HTTPS en producción
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 60 * 60 * 1000,                                 // 1 hora
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,                        // 7 días
});
```

> **Pregunta típica: "¿Por qué no guardan el token en localStorage?"**
>
> **Respuesta:** localStorage es accesible por cualquier script JavaScript en la página. Si la aplicación tuviera una vulnerabilidad XSS (Cross-Site Scripting), un atacante podría robar el token con `localStorage.getItem('token')`. Las cookies `httpOnly` **no son accesibles desde JavaScript** — el navegador las envía automáticamente con cada request, pero `document.cookie` no las muestra. Es el estándar profesional que usan bancos y aplicaciones financieras.

### 2.3 Flujo de Refresh Token Automático

Cuando el Access Token expira, el usuario **no se entera** — el sistema lo renueva automáticamente:

**Backend — Endpoint `/auth/refresh`:**
```javascript
export async function handleRefreshToken(req, res) {
  const oldRefreshToken = req.cookies.refreshToken;

  // 1. Verificar que el refresh token existe en la DB
  const tokenInDb = await findRefreshToken(oldRefreshToken);
  if (!tokenInDb) return res.status(401);

  // 2. Verificar firma JWT
  const payload = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);

  // 3. Generar NUEVOS tokens (rotación)
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  // 4. Borrar token viejo de DB y guardar el nuevo
  await deleteRefreshToken(oldRefreshToken);
  await saveRefreshToken(payload.id, newRefreshToken);

  // 5. Setear nuevas cookies
  res.cookie('accessToken', newAccessToken, { httpOnly: true, ... });
  res.cookie('refreshToken', newRefreshToken, { httpOnly: true, ... });
}
```

> **Detalle de seguridad:** El refresh token se **rota** en cada uso. El viejo se borra de la DB y se genera uno nuevo. Si un atacante roba un refresh token y lo usa, el usuario legítimo recibirá un 401 la próxima vez y sabrá que fue comprometido.

**Frontend — Interceptor de Axios (renovación transparente):**
```javascript
// axiosInstance.js — Interceptor de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos 401 y NO es un retry ni un endpoint de auth
    if (error.response?.status === 401 && !originalRequest._retry
        && !originalRequest.url.includes('/auth/')) {

      originalRequest._retry = true;  // Previene loops infinitos

      // Llamar al refresh endpoint
      await axios.post('/auth/refresh', {}, { withCredentials: true });

      // Reintentar el request original (ya con nueva cookie)
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);
```

**¿Qué pasa para el usuario?** Nada. Hace click en algo, el access token expirado devuelve 401, el interceptor llama a `/refresh`, obtiene nuevas cookies, reintenta el request original. Todo transparente en milisegundos.

### 2.4 RBAC — Control de Acceso Basado en Roles

Tenemos **3 roles** bien diferenciados:

| Rol | Acceso | Interfaz |
|-----|--------|----------|
| **ADMIN** | Gestión completa: películas, salas, funciones, reportes, usuarios, tarifas, parámetros | Dashboard administrativo completo |
| **CLIENTE** | Ver cartelera, reservar entradas, pagar, ver historial, cancelar reservas | Interfaz de usuario con cartelera y reservas |
| **ESCANER** | Validar códigos QR en la entrada del cine | Interfaz simplificada de solo escaneo |

**Implementación en el Backend — Middleware `authorizeRoles`:**

```javascript
export function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos' });
    }
    next();
  };
}

// Uso en rutas:
router.post('/Funcion', authMiddleware, authorizeRoles('ADMIN'), ...);
router.post('/qr/validate', authMiddleware, authorizeRoles('ADMIN', 'ESCANER'), ...);
router.get('/reservas/usuario/:DNI', authMiddleware, ...); // Ownership check en service
```

**En el Frontend — Rutas protegidas:**
- `ProtectedRoute` verifica el rol antes de renderizar la página.
- El componente `useAuth()` expone helpers: `hasRole('ADMIN')`, `isAdmin()`, `isClient()`.

### 2.5 Seguridad Adicional

| Medida | Implementación |
|--------|---------------|
| **Helmet** | Headers de seguridad HTTP (CSP, HSTS, X-Frame-Options, etc.) |
| **CORS** | Solo acepta requests del `FRONTEND_URL` configurado |
| **Rate Limiting** | 5 intentos/min login, 3 registros/hora, 10 refresh/hora, 100 general/15min, 200 consultas/5min |
| **bcrypt** | Contraseñas hasheadas con salt (nunca en texto plano) |
| **Validación Yup** | Validación en backend aunque el frontend ya valide (el front puede ser bypasseado) |
| **Logger con redacción** | En producción, el logger redacta emails, IPs, passwords y tokens del output |
| **Trust Proxy** | `app.set('trust proxy', 1)` para funcionar correctamente detrás de reverse proxy |
| **Manejo global de errores** | `errorHandler` middleware captura errores de Prisma (P2002: duplicado, P2003: FK inválida, P2025: no encontrado) |

### 2.6 Validación de Ownership

Además de RBAC, validamos que un usuario solo acceda a **sus propios recursos**:

```javascript
function validateOwnership(user, targetDNI) {
  if (user.rol === 'ADMIN') return; // Admin puede ver todo
  if (user.id !== parseInt(targetDNI)) {
    throw new Error('No puedes acceder a recursos de otros usuarios'); // 403
  }
}
```

Esto se aplica en: reservas, QR, perfil, cancelaciones.

---

## 3. Flujo de Reserva y Transacciones Atómicas

> **Este es el corazón del negocio.** Es donde más errores ocurren en sistemas reales: overbooking, datos huérfanos, race conditions.

### 3.1 Transacciones Atómicas con Prisma

La creación de una reserva y el bloqueo de asientos se ejecutan dentro de una **transacción atómica** (`prisma.$transaction`). Esto garantiza que si CUALQUIER paso falla, TODO se revierte:

```javascript
async function createWithSeats(reservaData, asientos) {
  return await prisma.$transaction(async (tx) => {

    // ✅ Validación 1: El usuario existe
    const usuario = await tx.usuario.findUnique({ where: { DNI } });
    if (!usuario) throw new Error('El usuario no existe.');

    // 🧹 Limpieza: Solo una reserva PENDIENTE por usuario
    await tx.reserva.deleteMany({
      where: { DNI, estado: 'PENDIENTE' },
    });

    // ✅ Validación 2: La función es en el futuro
    if (fechaFuncion <= now) throw new Error('La función ya comenzó.');

    // ✅ Validación 3: La función existe en esa sala
    const funcion = await tx.funcion.findUnique({ ... });
    if (!funcion) throw new Error('La función no existe.');

    // ✅ Validación 4: Todos los asientos existen físicamente
    for (const asiento of asientos) {
      const existe = await tx.asiento.findUnique({ ... });
      if (!existe) throw new Error(`Asiento ${fila}${nro} no existe.`);
    }

    // ✅ Validación 5: Los asientos están disponibles (SOFT LOCK CHECK)
    for (const asiento of asientos) {
      const ocupado = await tx.asiento_reserva.findUnique({ ... });
      if (ocupado) throw new Error(`Asiento ${fila}${nro} ya no está disponible.`);
    }

    // ✅ Validación 6: Calcular total según tarifa de cada asiento
    let total = 0;
    for (const asiento of asientos) {
      const info = await tx.asiento.findUnique({
        include: { tarifa: true }
      });
      total += parseFloat(info.tarifa.precio);
    }

    // 📝 CREAR la reserva
    const newReserva = await tx.reserva.create({
      data: { estado: 'PENDIENTE', total, ... },
    });

    // 🔒 BLOQUEAR los asientos (crear soft locks)
    await tx.asiento_reserva.createMany({
      data: asientosToCreate,
      skipDuplicates: false,   // Si hay duplicado, la transacción FALLA
    });

    return newReserva;
  });
}
```

**¿Qué pasaría sin transacción?**
- Escenario: Dos usuarios reservan el mismo asiento al mismo tiempo. Sin transacción, ambas reservas se crearían y tendríamos overbooking.
- Con `$transaction`: La verificación de disponibilidad y la creación del lock son atómicas. Si otro usuario ya reservó el asiento entre la verificación y la creación, la transacción falla y se revierte todo.
- **No hay datos huérfanos**: Si falla el bloqueo de asientos, la reserva no se crea. Nunca queda una reserva "colgada" sin asientos.

### 3.2 Ciclo de vida de una reserva (Estados)

```
                 ┌──────────┐
                 │ PENDIENTE │ ← Reserva creada, esperando pago
                 └─────┬─────┘
                       │
          Pago OK      │     Timeout (15 min)
        (Webhook MP)   │     (Cron cleanup)
                       │
              ┌────────▼────────┐
              │                 │
      ┌───────▼──────┐   ┌─────▼─────┐
      │   ACTIVA     │   │ ELIMINADA  │ ← Se borra completamente (cascade delete)
      └───────┬──────┘   └───────────┘
              │
     ┌────────┼────────────┐
     │        │            │
┌────▼───┐ ┌──▼──────┐ ┌──▼──────────┐
│ASISTIDA│ │CANCELADA│ │NO_ASISTIDA  │
└────────┘ └─────────┘ └─────────────┘
 (QR OK)   (Usuario)    (Cron, no vino)
```

| Estado | Cómo se llega | Qué significa |
|--------|-------------|--------------|
| `PENDIENTE` | Al crear reserva | Esperando pago. Asientos bloqueados temporalmente. |
| `ACTIVA` | Webhook de Mercado Pago confirma pago aprobado | Pagada. El usuario recibe email con QR. |
| `ASISTIDA` | El escáner valida el QR en la entrada | El cliente asistió al cine. |
| `CANCELADA` | El usuario cancela (mínimo 2h antes de la función) | Reserva cancelada, asientos liberados. |
| `NO_ASISTIDA` | Cron job detecta que la función terminó y no se escaneó | No-show. Auditoría. |
| `ELIMINADA` | Timeout de 15min sin pago (cascade delete) | Se borra de la base de datos completamente. |

### 3.3 Timeout configurable + Cron Jobs

**Limpieza de reservas expiradas:**

```javascript
async function cleanupExpiredReservations() {
  // Obtener timeout del parámetro configurado en la DB (default: 15 min)
  const paramTimeout = await parametrosRepo.getOne(2);
  const timeoutMinutes = paramTimeout ? parseInt(paramTimeout.valor) : 15;

  const cutoffDate = new Date();
  cutoffDate.setMinutes(cutoffDate.getMinutes() - timeoutMinutes);

  // Borrar reservas PENDIENTES que pasaron el timeout
  const deleted = await prisma.reserva.deleteMany({
    where: {
      estado: 'PENDIENTE',
      fechaHoraReserva: { lt: cutoffDate },
    },
  });
  // Gracias a onDelete: Cascade, los asiento_reserva se borran automáticamente
}
```

Esta limpieza se ejecuta **on-demand** (cada vez que alguien consulta asientos disponibles) y también por el **Cron Job** que corre cada 2 horas:

```javascript
// funcionesCron.js — Cron cada 2 horas
cron.schedule('*/120 * * * *', async () => {
  // 1. Buscar funciones que terminaron (hora actual > hora_inicio + duración_película)
  // 2. Marcar función como INACTIVA
  // 3. Marcar reservas ACTIVAS no escaneadas como NO_ASISTIDA
});
```

**¿Por qué el timeout es un parámetro?** Porque el administrador puede cambiarlo desde la interfaz sin tocar código. Si decide que 10 minutos es suficiente, lo cambia en la tabla `parametro` y el sistema lo aplica inmediatamente.

### 3.4 Reglas de negocio en el Service

| Regla | Dónde se valida |
|-------|----------------|
| No reservar función ya empezada | `reservas.repository.js` (dentro de transacción) |
| No cancelar con menos de 2h de anticipación | `reservas.service.js` |
| Solo una reserva PENDIENTE por usuario | `reservas.repository.js` (delete previas) |
| Verificar solapamiento de funciones en sala | `funciones.service.js` |
| Verificar fecha de estreno de película | `funciones.service.js` |
| Total calculado en servidor (no confiar en el front) | `reservas.repository.js` (consulta tarifas) |

---

## 4. UX/UI: Mobile First y Estética

### 4.1 Responsive Design con Tailwind CSS

Todo el diseño es **Mobile First** — se diseña primero para móvil y se agregan breakpoints para pantallas más grandes:

```javascript
// Ejemplo: Grilla de filtros administrativos
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">

// Ejemplo: Card de reserva
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-1">  {/* Poster: full width mobile, 1/4 desktop */}
  <div className="lg:col-span-3">  {/* Detalle: full width mobile, 3/4 desktop */}
```

**Tablas → Cards en móvil:**
```javascript
// Desktop: Tabla completa visible
<div className="hidden md:block overflow-x-auto">
  <table>...</table>
</div>

// Mobile: Layout tipo card (alternativa visible solo en móvil)
<div className="block md:hidden">
  {/* Cards apiladas */}
</div>
```

### 4.2 Skeleton Loaders — Performance Percibida

En lugar de un spinner genérico, usamos **8 tipos de skeleton** que mantienen la estructura visual mientras cargan los datos:

| Skeleton | Uso |
|----------|-----|
| `TableSkeleton` | Tablas administrativas (filas y columnas simuladas) |
| `CardSkeleton` | Grilla de películas/funciones |
| `FormSkeleton` | Formularios de creación/edición |
| `TextSkeleton` | Párrafos de texto (sinopsis, descripciones) |
| `CircleSkeleton` | Avatares y fotos de perfil |
| `ReservaCardSkeleton` | Cards de "Mis Reservas" |

```javascript
// Uso en componente
{loading ? <TableSkeleton rows={8} columns={3} /> : <TablaReal data={data} />}

// Cada skeleton usa animate-pulse de Tailwind
<div className="animate-pulse bg-gray-700 rounded h-4 w-full" />
```

**¿Por qué skeletons y no spinners?**
- Un spinner no da información sobre qué va a aparecer.
- Un skeleton "anticipa" la estructura → el usuario siente que la página cargó más rápido (performance percibida).
- Es un patrón usado por Facebook, YouTube, LinkedIn.

### 4.3 Sistema de Notificaciones — React Hot Toast

```javascript
// Configuración en NotificationContext.jsx
notify.success("Reserva confirmada!");     // Verde
notify.error("Error al procesar pago");    // Rojo
notify.warning("La reserva expira pronto"); // Ámbar
notify.info("Procesando tu solicitud...");  // Azul

// Configuración:
- Posición: top-center
- Duración: 3000-5000ms según tipo
- Máximo 3 toasts simultáneos
- Funciona FUERA de React (en interceptores de Axios) via notifyGlobal
```

**¿Por qué se necesita un `notifyGlobal`?** El interceptor de Axios corre fuera del árbol de React (no es un componente). Necesitamos una referencia global para mostrar notificaciones de error 500 desde ahí.

### 4.4 Identidad de Marca — ClaquetaPersonaje

El componente `ClaquetaPersonaje` es una mascota SVG animada (una claqueta de cine con ojos y piernas) que:
- Rota mensajes amigables cada 7 segundos
- Se posiciona en esquina inferior izquierda (fixed) o inline
- Refuerza la identidad visual "Cutzy Cinema"
- Usa gradientes oscuros púrpura (`via-purple-900`) para el tema cinematográfico

### 4.5 Countdown Timer

En el paso de pago, un **temporizador visual** muestra al usuario cuánto tiempo le queda antes de que su reserva expire:

```javascript
<CountdownTimer initialSeconds={900} onExpire={() => setExpired(true)} />
// 15 minutos = 900 segundos (configurable desde parámetros del sistema)
```

---

## 5. Filtrado y Paginación (Performance)

### 5.1 Debounce en búsquedas

```javascript
// Hook useDebounce (Frontend/src/utils/debounce.js)
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Uso: La búsqueda espera 500ms de inactividad antes de llamar a la API
const debouncedBusqueda = useDebounce(filtros.busqueda, 500);

useEffect(() => {
  // Solo busca cuando el usuario DEJÓ de escribir
  fetchPeliculas({ busqueda: debouncedBusqueda });
}, [debouncedBusqueda]);
```

**¿Qué problema resuelve?** Sin debounce, si el usuario escribe "Avengers", se dispararían 8 peticiones a la API: "A", "Av", "Ave", "Aven", "Aveng", "Avenge", "Avenger", "Avengers". Con debounce, solo se dispara una vez que paró de escribir.

### 5.2 Paginación del lado del servidor

```javascript
// Backend — Repository
async function getActive(page = 1, limit = 10) {
  return await prisma.funcion.findMany({
    where: { estado: { not: 'INACTIVA' } },
    skip: (page - 1) * limit,   // Saltar registros anteriores
    take: limit,                 // Traer solo N registros
    include: { sala: true, pelicula: true },
  });
}

// Frontend — Componente Pagination reutilizable
<Pagination
  currentPage={currentPage}
  totalItems={totalItems}
  itemsPerPage={10}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

**¿Por qué paginación del lado del servidor?**
- No traemos las 500 películas de golpe al frontend.
- El backend calcula el `skip` y `take` — solo trae los 10 registros de la página actual.
- Reduce ancho de banda, memoria del navegador y tiempo de respuesta.
- El componente `Pagination` muestra navegación con "..." para rangos grandes.

### 5.3 Filtros combinados

Las listas administrativas permiten filtrar por múltiples criterios simultáneamente:

```javascript
// Filtros de funciones: película, sala, fecha desde, fecha hasta, estado
<FuncionesInlineFilters
  filtros={filtros}
  onFiltroChange={handleFiltroChange}
/>

// Cada cambio de filtro reconstruye la query y la envía al backend
// Con debounce en campos de texto libre
```

---

## 6. Integraciones Externas

### 6.1 Mercado Pago — Pagos seguros con Webhooks

**Flujo completo:**

```
1. Usuario selecciona asientos → Se crea reserva PENDIENTE (transacción atómica)
2. Frontend crea "Preference" en MP → Se muestra el Wallet de Mercado Pago
3. Usuario paga en MP → MP redirige al front (success/failure/pending)
4. MP envía Webhook al backend → Backend verifica pago
5. Backend confirma reserva (PENDIENTE → ACTIVA)
6. Backend envía email con QR
```

**¿Por qué Webhooks y no solo la redirección?**

```javascript
// El webhook es la confirmación REAL del pago
export const handleWebhook = asyncHandler(async (req, res) => {
  if (type === 'payment') {
    const payment = new Payment(client);
    const result = await payment.get({ id: data.id });

    if (result.status === 'approved') {
      // Verificar que los montos coinciden (anti-tampering)
      const montoMP = parseFloat(result.transaction_amount);
      const montoDB = parseFloat(reservaDB.total);
      if (Math.abs(montoMP - montoDB) > 0.01) {
        logger.error('MISMATCH DE MONTO — posible fraude');
        return res.sendStatus(200);
      }

      // Confirmar reserva
      await confirmReservaRepo(subParams);

      // Enviar email con QR
      await sendReservaConfirmationEmail(emailData);
    }
  }
  res.sendStatus(200);
});
```

> **Respuesta preparada:** "No confiamos en la redirección del usuario porque puede ser manipulada (piensen en alguien que cierra la pestaña a mitad de pago, o modifica la URL manualmente). El Webhook es un request **servidor-a-servidor** que Mercado Pago envía directamente a nuestro backend. Es la única fuente confiable de que el pago se realizó. Además, verificamos que el monto pagado coincida con el monto en nuestra DB para prevenir ataques de tampering."

### 6.2 Cloudinary — Gestión de imágenes

```javascript
// Flujo: Multer (memoria) → Cloudinary → Solo guardamos URL
const uploadToCloudinary = async (file) => {
  return cloudinary.uploader.upload_stream({
    folder: 'cutzy/posters',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },     // Optimización automática
      { width: 500, height: 750, crop: 'fill' },      // Tamaño estándar poster
    ],
  });
};
```

**¿Por qué Cloudinary y no guardar en el servidor?**
- La DB solo guarda la URL y el `publicId` (liviana).
- Cloudinary optimiza automáticamente: formato WebP, calidad adaptativa, CDN global.
- Si el servidor se reinicia o cambia, las imágenes no se pierden.
- Límite de 5MB por archivo con validación de tipo MIME.

### 6.3 Mailjet — Emails transaccionales

Después de confirmar una reserva, se envía un **email HTML profesional** con:

- Nombre del usuario
- Película, sala, fecha/hora, asientos
- **Código QR encriptado** como imagen adjunta inline
- Total pagado
- Recomendaciones (llegar 15 min antes, presentar QR)

```javascript
// El QR se genera en el momento del envío
const qrBase64 = await generateReservaQR(reservaParams);

// Se embebe en el HTML del email
<img src="data:image/png;base64,${qrBase64}" alt="QR Code" />
```

El email usa un template HTML responsive con gradientes púrpura (consistente con la marca Cutzy).

---

## 7. Sistema de Validación QR

> **Este es un feature innovador.** No es un simple código numérico — es un sistema criptográfico completo.

### 7.1 Encriptación AES-256-CBC

Los datos del QR **no son un simple ID de reserva** que alguien podría adivinar o falsificar. Están encriptados con **AES-256-CBC** (el mismo algoritmo que usan los gobiernos):

```javascript
// qrEncryption.js
const ALGORITHM = 'aes-256-cbc';

export function encryptData(data) {
  const iv = crypto.randomBytes(16);      // Vector de inicialización ALEATORIO cada vez
  const key = getEncryptionKey();          // SHA-256 de la clave secreta (32 bytes)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const jsonString = JSON.stringify(data);
  let encrypted = cipher.update(jsonString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Formato: base64(IV_HEX:ENCRYPTED_HEX)
  return Buffer.from(iv.toString('hex') + ':' + encrypted).toString('base64');
}
```

**¿Qué va dentro del QR?**
```javascript
const qrData = {
  idSala: 1,
  fechaHoraFuncion: "2025-12-20T21:00:00.000Z",
  DNI: 12345678,
  fechaHoraReserva: "2025-12-19T15:30:00.000Z",
};
// Esto se encripta → el QR contiene un string base64 ilegible
```

**¿Por qué AES-256 y no un simple ID?**
- Si el QR fuera `reserva_id=123`, cualquiera podría generar QRs falsos iterando números.
- Con AES-256, sin la clave secreta (`QR_ENCRYPTION_KEY`) es **matemáticamente imposible** generar un QR válido.
- El IV aleatorio hace que **el mismo dato genera QRs diferentes** cada vez (previene ataques de análisis de patrones).

### 7.2 Validación en la entrada del cine

El personal del cine usa el **rol ESCANER** con una interfaz móvil simplificada:

```
1. Escáner abre ScannerPage en su celular
2. Apunta la cámara al QR del cliente (usa html5-qrcode, 10fps)
3. El frontend envía el string encriptado al backend: POST /qr/validate
4. Backend desencripta → Busca reserva → Ejecuta validaciones
5. Si todo OK → Marca reserva como ASISTIDA → Muestra datos al escáner
```

**Validaciones del backend al escanear:**

```javascript
export async function validateAndUseQR(encryptedData, user) {
  // 1. Desencriptar datos del QR
  const qrData = decryptData(encryptedData);

  // 2. Buscar reserva en la DB
  const reserva = await repository.getReservaWithDetails(params);
  if (!reserva) throw new Error('Reserva no encontrada');

  // 3. ¿Ya empezó la función? (Con 15 min de tolerancia de llegada temprana)
  const quinceMinAntes = new Date(reserva.funcion.fechaHoraFuncion);
  quinceMinAntes.setMinutes(quinceMinAntes.getMinutes() - 15);
  if (quinceMinAntes > ahora) throw new Error('Función aún no comenzó');

  // 4. ¿Ya terminó la función?
  const horaFin = new Date(reserva.funcion.fechaHoraFuncion);
  horaFin.setMinutes(horaFin.getMinutes() + reserva.funcion.pelicula.duracion);
  if (horaFin < ahora) throw new Error('Función ya finalizada');

  // 5. ¿Ya fue usada?
  if (reserva.estado === 'ASISTIDA') throw new Error('Ya fue utilizada');

  // 6. ¿Fue cancelada?
  if (reserva.estado === 'CANCELADA') throw new Error('Fue cancelada');

  // 7. ¿Está activa? (pagada)
  if (reserva.estado !== 'ACTIVA') throw new Error('No está activa');

  // 8. ✅ Marcar como ASISTIDA
  await repository.markReservaAsUsed(params);

  return {
    success: true,
    reserva: {
      pelicula: '...',
      sala: '...',
      cliente: '...',
      cantidadAsientos: N,
    }
  };
}
```

**Cooldown de escaneo:** 10 segundos entre escaneos para evitar lecturas duplicadas accidentales.

---

## 8. Calidad y Testing

### 8.1 Tests Backend — Jest + Supertest

**Configuración:**
- Entorno Node.js, ejecución secuencial (`maxWorkers: 1` para evitar conflictos de DB)
- Global teardown desconecta Prisma
- Timeout de 10 segundos por test

**Tests de integración (auth):**
```javascript
test('debe retornar cookies httpOnly y user en el body (no token)', async () => {
  const response = await request(app).post('/api/auth/login').send({
    email: 'admin_test@cutzy.com',
    password: '123456',
  });

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('user');
  expect(response.body).not.toHaveProperty('token');  // ← No expone token en body

  const cookies = response.headers['set-cookie'];
  const accessTokenCookie = cookies.find(c => c.startsWith('accessToken='));
  expect(accessTokenCookie).toContain('HttpOnly');     // ← Verifica httpOnly
});
```

**Tests de funciones:**
- CRUD completo (crear, listar, actualizar estado, eliminar)
- Filtros por película, sala, estado, rango de fechas
- Detección de solapamiento (dos funciones en la misma sala al mismo tiempo)
- Validación de permisos (solo ADMIN puede crear)

**Tests Yup (validación de esquemas):**
```javascript
test('falla si duración es negativa', async () => {
  const invalid = { nombrePelicula: 'Test', duracion: -5 };
  await expect(peliculaSchema.isValid(invalid)).resolves.toBe(false);
});
```

### 8.2 Tests E2E — Playwright

**Configuración:**
- Navegador: Chromium
- Timeout: 60 segundos, 15s por acción, 30s por navegación
- Screenshots en caso de fallo
- Traces en primer retry
- Reintentos: 2 en CI, 0 en local

**Tests E2E implementados:**

| Test | Qué simula |
|------|-----------|
| `auth.spec.js` | Login completo: home → click "Iniciar Sesión" → llenar credenciales → verificar dashboard |
| `cartelera.spec.js` | Listar películas, verificar carga, navegar a detalle |
| `funciones.spec.js` | Login como admin → Navegar a funciones → Crear nueva función con formulario completo |

```javascript
// Fixture para tests autenticados
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@cutzy.com');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
    await use(page); // El test recibe la página ya logueada
  },
});
```

### 8.3 Doble Validación — Yup (Front + Back)

| Dónde | Para qué |
|-------|----------|
| **Frontend** | Feedback inmediato al usuario. "El email es inválido" aparece mientras escribe. |
| **Backend** | Seguridad. El frontend puede ser bypasseado (Postman, cURL, DevTools). El backend valida SIEMPRE. |

```javascript
// Backend: Middleware que valida antes de llegar al controller
export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};

// Uso:
router.post('/Funcion', validateBody(funcionesSchema), asyncHandler(createFuncion));
```

**Esquemas existentes en el backend:**
- `AuthSchema.js` — Login y registro
- `ReservasSchema.js` — Creación de reserva, asientos, reserva atómica
- `PeliculasSchema.js` — CRUD películas
- `FuncionesSchema.js` — CRUD funciones con filtros
- `SalasSchema.js` — CRUD salas
- `TarifasSchema.js` — Tarifas
- `UsuariosSchema.js` — Registro de usuario
- `QRValidationSchema.js` — Validación de QR
- `CommonSchemas.js` — Filtros genéricos

### 8.4 Helpers de testing

```javascript
// helpers.js — Reutilizable en todos los tests
getAdminToken()   // Crea admin de test si no existe, hace login, cachea cookies
getUserToken()    // Crea usuario random, hace login, cachea cookies
cleanup()         // Borra datos de test
authHeaders()     // Devuelve headers con cookie
```

---

## 9. Preguntas Clave de Defensa

### Arquitectura

**P: ¿Por qué no usaron microservicios?**
> R: Para el alcance del proyecto, un monolito modular es la decisión correcta. Los microservicios agregan complejidad (comunicación entre servicios, orquestación, deploy independiente) sin beneficio real para una aplicación de este tamaño. Nuestra arquitectura por capas nos da la misma separación de preocupaciones sin la sobrecarga operativa. Si el proyecto creciera, el diseño modular facilita extraer un módulo a su propio servicio.

**P: ¿Qué pasa si la base de datos crece mucho?**
> R: Tenemos paginación del lado del servidor (skip/take en Prisma), índices en las columnas más consultadas, y el cron job limpia registros obsoletos cada 2 horas. Si necesitáramos más escala, Prisma soporta read replicas y connection pooling.

### Seguridad

**P: ¿Por qué cookies httpOnly y no localStorage?**
> R: localStorage es accesible por cualquier script JavaScript — vulnerable a XSS. Las cookies httpOnly no son accesibles desde `document.cookie`. Es el estándar de seguridad de aplicaciones financieras. Sumado a que usamos `secure: true` en producción (solo HTTPS) y `sameSite` para prevenir CSRF.

**P: ¿Qué pasa si roban el refresh token?**
> R: El refresh token se rota en cada uso (se borra el viejo y se genera uno nuevo). Si un atacante lo usa antes que el usuario legítimo, el usuario recibirá un 401 y sabrá que fue comprometido. Además, el token está en la DB así que podemos revocarlo manualmente con `/revoke-all-sessions`.

**P: ¿Cómo protegen de ataques de fuerza bruta?**
> R: Rate limiting por endpoint: login (5 intentos/minuto), registro (3/hora), refresh (10/hora), general (100/15min). Las contraseñas están hasheadas con bcrypt (salt rounds). Los mensajes de error no revelan si el email existe o no ("Usuario o contraseña incorrectos" en ambos casos).

### Reservas

**P: ¿Cómo evitan el overbooking?**
> R: Toda la lógica de reserva (verificar disponibilidad + crear reserva + bloquear asientos) se ejecuta dentro de una transacción atómica de Prisma (`$transaction`). Si dos usuarios intentan reservar el mismo asiento simultáneamente, uno de los dos fallará dentro de la transacción y se revertirá todo. Nunca quedan datos inconsistentes.

**P: ¿Qué pasa si el usuario no paga?**
> R: La reserva nace como PENDIENTE con asientos bloqueados. Hay un timeout configurable (por defecto 15 minutos). Cuando el timeout se cumple, la función de limpieza borra la reserva y los asientos se liberan automáticamente (cascade delete). La limpieza se ejecuta on-demand (al consultar asientos) y por cron job cada 2 horas.

**P: ¿Y si Mercado Pago falla o el webhook no llega?**
> R: La reserva queda como PENDIENTE y eventualmente se limpia por timeout. Mercado Pago tiene reintentos automáticos de webhooks. Si el webhook llega tarde pero dentro del timeout, la reserva se confirma normalmente. Si llega después del timeout, la reserva ya no existe — el usuario deberá contactar soporte.

### QR

**P: ¿Por qué encriptar el QR y no poner solo un ID?**
> R: Si el QR fuera "reserva_123", cualquiera podría generar QRs falsos probando números. Con AES-256-CBC, sin la clave secreta del servidor es imposible generar un QR válido. Además, cada QR usa un IV aleatorio, así que dos reservas producen QRs completamente diferentes incluso si tienen datos similares.

**P: ¿Qué validaciones hace el escaneo?**
> R: 6 validaciones: (1) desencriptar datos, (2) reserva existe, (3) función ya empezó (con 15 min de tolerancia), (4) función no terminó, (5) QR no fue usado antes, (6) reserva está activa (pagada). Si alguna falla, el escáner ve un mensaje de error específico.

### Testing

**P: ¿Por qué Playwright y no solo Jest?**
> R: Jest con jsdom simula un DOM pero no un navegador real. Playwright ejecuta un Chromium real donde podemos: hacer login, navegar entre páginas, llenar formularios, hacer clicks, y verificar que toda la cadena (front → API → backend → DB → respuesta → render) funciona. Es la diferencia entre testear componentes aislados vs testear el flujo completo del usuario.

**P: ¿Por qué la doble validación Yup front/back?**
> R: El frontend valida por UX (feedback instantáneo al usuario). El backend valida por SEGURIDAD (el frontend puede ser bypasseado con cURL/Postman/DevTools). Nunca se confía solo en la validación del frontend. Es el principio "Never Trust the Client".

### Performance

**P: ¿Qué pasa si muchos usuarios buscan películas al mismo tiempo?**
> R: Combinación de: (1) debounce de 500ms en el frontend reduce requests innecesarios, (2) paginación server-side limita la carga a N registros por request, (3) rate limiting protege contra abuso (200 requests/5min para consultas), (4) índices en la DB para búsquedas por nombre/género.

### Integraciones

**P: ¿Por qué no guardan las imágenes en el servidor?**
> R: Cloudinary es un CDN especializado en imágenes. Optimiza automáticamente (formato WebP, calidad adaptativa), distribuye globalmente (CDN), y persiste aunque el servidor se reinicie/cambie. Solo guardamos URL + publicId en la DB — la DB queda liviana. También aplicamos transformaciones estándar (500x750, crop fill) para consistencia visual.

**P: ¿Es seguro el flujo de pago con Mercado Pago?**
> R: Sí. Tres capas de seguridad: (1) el endpoint de crear preference requiere autenticación, (2) el webhook verifica que el monto pagado coincida con el monto en nuestra DB (anti-tampering), (3) la metadata que identifica la reserva viaja encapsulada dentro de la preference de MP, no en la URL del frontend.

---

## Stack Tecnológico — Resumen

| Componente | Tecnología |
|-----------|-----------|
| **Backend** | Node.js, Express |
| **Frontend** | React 18, Vite |
| **Base de Datos** | PostgreSQL |
| **ORM** | Prisma |
| **Autenticación** | JWT (Access + Refresh), bcrypt, Cookies httpOnly |
| **Pagos** | Mercado Pago SDK (Webhooks) |
| **Imágenes** | Cloudinary |
| **Emails** | Mailjet |
| **QR** | qrcode + AES-256-CBC (crypto nativo) |
| **Estilos** | Tailwind CSS, Flowbite |
| **Testing Backend** | Jest, Supertest |
| **Testing E2E** | Playwright (Chromium) |
| **Validación** | Yup (front + back) |
| **Cron Jobs** | node-cron |
| **Rate Limiting** | express-rate-limit |
| **Seguridad HTTP** | Helmet |
| **Logging** | Logger custom con redacción en producción |
| **Scanner QR** | html5-qrcode |
| **Notificaciones** | React Hot Toast |
| **Documentación API** | Swagger / OpenAPI 3.0 |
