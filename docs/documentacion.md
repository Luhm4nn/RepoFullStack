# Documentación Técnica - Cutzy Cinema

Este directorio contiene la documentación generada durante el desarrollo del sistema Cutzy para cines.  
El objetivo de esta documentación es dejar registro del alcance del proyecto, metodología de trabajo, seguimiento de tareas, minutas de reuniones y aspectos técnicos necesarios para la instalación y uso del sistema.

## Arquitectura del Sistema

### Frontend (React + Vite)

- **Puerto**: `https://localhost:5173` (HTTPS en desarrollo)
- **Framework**: React 18 con Vite como build tool
- **Estado Global**: Context API para autenticación y notificaciones
- **Enrutamiento**: React Router v6
- **Comunicación API**: Axios con interceptores automáticos
- **Estilos**: Tailwind CSS + Flowbite React
- **Notificaciones**: React Hot Toast + Modales personalizados

### Backend (Node.js + Express)

- **Puerto**: `http://localhost:4000` (HTTP en desarrollo)
- **Framework**: Express.js
- **ORM**: Prisma con PostgreSQL
- **Autenticación**: JWT con cookies httpOnly
- **Validación**: Yup schemas
- **Integración Pagos**: Mercado Pago SDK
- **Almacenamiento**: Cloudinary para imágenes

### Comunicación Frontend-Backend

El sistema implementa un proxy de Vite para permitir la comunicación entre el frontend HTTPS y el backend HTTP:

```javascript
// vite.config.js
server: {
  https: true,
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

**Funcionamiento**:
1. Frontend hace peticiones a `/api/Funcion`, `/api/Pelicula`, etc.
2. Vite proxy reescribe a `/Funcion`, `/Pelicula` y envía a `http://localhost:4000`
3. Las cookies se comparten como same-origin gracias al proxy
4. No hay conflictos entre rutas del frontend (`/Funciones`) y API (`/api/Funcion`)

## Sistema de Autenticación

### Flujo de Login

1. Usuario envía credenciales a `POST /api/auth/login`
2. Backend valida y genera dos tokens JWT:
   - `accessToken`: Duración 1 hora
   - `refreshToken`: Duración 7 días
3. Tokens se almacenan en cookies httpOnly:
   ```javascript
   res.cookie('accessToken', token, {
     httpOnly: true,      // No accesible desde JavaScript
     secure: true,        // Solo HTTPS en producción
     sameSite: 'lax',     // Protección CSRF básica
     maxAge: 3600000      // 1 hora
   });
   ```

### Interceptor de Axios

El frontend incluye un interceptor que maneja automáticamente:

```javascript
// Request Interceptor
- Extrae token CSRF de cookie XSRF-TOKEN
- Agrega header x-csrf-token a todas las peticiones mutantes

// Response Interceptor
- Detecta 401 Unauthorized
- Intenta renovar con /api/auth/refresh
- Si falla, redirige a /login
- Si funciona, reintenta petición original
```

### Protección CSRF

**Backend**:
- Usa librería `csrf-csrf`
- Cookie `XSRF-TOKEN` con `httpOnly: false` (accesible por JS)
- Rutas GET y `/auth/*` excluidas de validación
- POST/PUT/DELETE requieren header `x-csrf-token`

**Frontend**:
- Interceptor lee cookie `XSRF-TOKEN` automáticamente
- Añade a header `x-csrf-token` en cada petición
- Transparente para el desarrollador

## Sistema de Notificaciones

### Arquitectura

El sistema usa un enfoque híbrido:
- **React Hot Toast**: Para notificaciones simples (éxito, error, advertencia)
- **Modales Personalizados**: Para errores de lógica de negocio con códigos específicos

### Uso del Hook useNotification

```javascript
import { useNotification } from '../context/NotificationContext';

function MyComponent() {
  const notify = useNotification();
  
  // Notificación de éxito
  notify.success('Operación completada');
  
  // Notificación de error simple
  notify.error('No se pudo completar la operación');
  
  // Advertencia
  notify.warning('Revisa los datos ingresados');
  
  // Información
  notify.info('Se enviará un email de confirmación');
  
  // Manejo automático de errores API
  try {
    await api.deleteItem(id);
  } catch (error) {
    notify.handleError(error); // Muestra modal o toast según el error
  }
}
```

### Errores Estandarizados

Los errores de lógica de negocio están estandarizados con códigos únicos:

| Código | Descripción | Tipo Modal |
|--------|-------------|------------|
| `SOLAPAMIENTO_FUNCIONES` | Conflicto de horarios entre funciones | ⚠️ Conflicto de Horarios |
| `FECHA_ESTRENO_INVALIDA` | Función antes del estreno de la película | ⚠️ Fecha Inválida |
| `FECHA_ESTRENO` | Estreno inválido por funciones programadas | ⚠️ Fecha Inválida |

**Backend Response**:
```javascript
res.status(400).json({
  errorCode: 'SOLAPAMIENTO_FUNCIONES',
  message: 'La sala ya tiene una función en ese horario'
});
```

**Frontend Detection**:
- `notify.handleError()` detecta `errorCode` en la respuesta
- Si el código está en `ERROR_CODES`, muestra modal personalizado
- Si no, muestra toast de error simple

### Modales vs Toast

**Usar Modal cuando**:
- Error de validación de negocio con solución clara
- Usuario necesita entender la causa y cómo corregirla
- Ejemplo: Conflicto de horarios, validación de fechas

**Usar Toast cuando**:
- Error técnico (red, servidor, timeout)
- Confirmación de acción exitosa
- Advertencia simple
- Ejemplo: "Eliminado exitosamente", "Error de conexión"

## Seguridad Implementada

### Cookies httpOnly

- Tokens JWT no accesibles desde JavaScript
- Protección contra XSS
- Navegador envía automáticamente en cada request

### CSRF Protection

- Token CSRF en cookie `XSRF-TOKEN` (httpOnly: false)
- Validación en backend para POST/PUT/DELETE
- GET requests excluidas

### Validación de Schemas

- Yup schemas en frontend (validación previa)
- Yup schemas en backend (validación definitiva)
- Mensajes de error estandarizados

### Proxy de Desarrollo

- Evita problemas de CORS
- Permite cookies entre HTTPS y HTTP
- Separa rutas frontend de API

## Consideraciones de Producción

### Variables de Entorno Requeridas

**Backend (.env)**:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CSRF_SECRET=...
CLOUDINARY_CLOUD_NAME=...
FRONTEND_URL=https://tudominio.com
NODE_ENV=production
```

**Frontend**:
- No requiere .env en producción
- Configurar proxy en servidor web (nginx/apache)
- Usar HTTPS obligatorio

### Configuración Nginx (Ejemplo)

```nginx
server {
  listen 443 ssl;
  server_name tudominio.com;
  
  # Frontend estático
  location / {
    root /var/www/cutzy/dist;
    try_files $uri $uri/ /index.html;
  }
  
  # Proxy a backend
  location /api/ {
    proxy_pass http://localhost:4000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_cookie_path / /api/;
  }
}
```

### Checklist de Seguridad

- [ ] Variables de entorno configuradas
- [ ] HTTPS en frontend y backend
- [ ] CORS configurado con dominio específico (no *)
- [ ] Rate limiting activado
- [ ] Logs de auditoría habilitados
- [ ] Backups automáticos de BD
- [ ] Secretos JWT/CSRF rotados regularmente
- [ ] Cloudinary con restricciones de upload

