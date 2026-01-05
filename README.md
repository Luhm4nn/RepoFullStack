# Cutzy Cinema - Sistema de Reserva de Entradas

Sistema completo de gestión y reserva de entradas de cine con integración de pagos mediante Mercado Pago. Permite a los usuarios explorar películas en cartelera, seleccionar funciones, elegir asientos y completar reservas con pago online.

Integrantes: Diego Lezcano y Emiliano Luhmann
Desarrollo de Software (Adrián Meca - Lucas Luna)
Comisión 301 - Ingeniería en Sistemas de Información - UTN FRRO - 2025

## Contenido Extra

- [Propuesta actualizada](https://github.com/Luhm4nn/TP-DSW-lez-Luh/blob/main/proposal.md)
- [Minutas de reuniones](/docs/minutas.md)
- [Tracking de tareas y bugs](https://github.com/users/Luhm4nn/projects/1)
- [Documentación de la API](/docs/api.md)

---

## Metodología utilizada

Para la gestión del proyecto se adoptó una **metodología ágil adaptada**, basada en elementos de Scrum y XP, ajustada al tamaño del equipo (2 integrantes).

- **Iteraciones cada 2 semanas (ajustable según los tiempos de cada uno)** con definición de tareas y revisión de avances.
- **Uso de GitHub Projects** como tablero Kanban para gestionar features, bugs e issues.
- **Programación en pareja** en tareas complejas y revisión cruzada de código (code review).
- Registro de reuniones y acuerdos en `minutas.md`.

---

## Características

### Para Usuarios

- **Explorar Cartelera**: Navega por las películas en exhibición con información detallada
- **Selección de Funciones**: Elige fecha, hora y sala para tu película favorita
- **Mapa de Asientos**: Selector visual interactivo con asientos normales y VIP
- **Pago Seguro**: Integración completa con Mercado Pago
- **Diseño Responsivo**: Experiencia optimizada en móviles, tablets y desktop con el enfoque Mobile-First
- **Gestión de Reservas**: Crea, visualiza y cancela tus reservas

### Para Administradores

- **Gestión de Películas**: CRUD completo con carga de imágenes (Cloudinary)
- **Gestión de Salas**: Crear y configurar salas con asientos VIP
- **Programación de Funciones**: Asignar películas a salas y horarios
- **Gestión de Tarifas**: Configurar precios para asientos normales y VIP

## Tecnologías

### Frontend

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework de estilos
- **Flowbite React** - Componentes UI
- **Lucide React** - Iconos

### Backend

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Prisma ORM** - Base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **Bcrypt** - Hashing de contraseñas
- **Cookie-Parser** - Manejo de cookies seguras
- **Yup** - Validación de schemas
- **Mercado Pago SDK** - Integración de pagos
- **Cloudinary** - Almacenamiento de imágenes

## Seguridad y Autenticación

El sistema implementa un robusto mecanismo de autenticación basado en **JWT (JSON Web Tokens)** con las siguientes características de seguridad:

### 🔒 Cookies httpOnly

A diferencia del almacenamiento tradicional en `localStorage`, los tokens de acceso (`accessToken`) y refresco (`refreshToken`) se almacenan exclusivamente en **cookies httpOnly**.

- **Protección XSS**: Las cookies httpOnly no pueden ser leídas ni manipuladas por JavaScript, protegiendo contra ataques de Cross-Site Scripting.
- **Transparencia**: El navegador envía automáticamente las credenciales en cada petición al backend.
- **Refresh Automático**: El sistema maneja transparentemente la expiración del token mediante un interceptor que renueva las credenciales sin afectar la experiencia del usuario.

### 🛡️ Medidas Adicionales

- **SameSite**: Configurado como `Strict` o `Lax` para prevenir CSRF.
- **Secure**: Las cookies solo se envían por HTTPS en producción.
- **Rotación de Refresh Tokens**: Cada vez que se usa un refresh token, se invalida y se emite uno nuevo para detectar robos de sesión.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **PostgreSQL** (versión 14 o superior)
- **npm** o **yarn**
- **Git**

### Cuentas Necesarias

- **Cuenta de Mercado Pago** (para pagos)
- **Cuenta de Cloudinary** (para imágenes)
- **ngrok** (para webhooks de Mercado Pago en desarrollo)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd cutzy-cinema
```

### 2. Instalar Dependencias del Backend

```bash
cd Backend
npm install
```

### 3. Instalar Dependencias del Frontend

```bash
cd ../Frontend
npm install
```

## Configuración

### Backend - Variables de Entorno

Crea un archivo `.env` en la carpeta `Backend/` con las siguientes variables:

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/cutzy_cinema?schema=public"

# JWT
JWT_SECRET="tu_secreto_jwt_super_seguro_aqui"
JWT_REFRESH_SECRET="tu_secreto_refresh_jwt_super_seguro_aqui"

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"

#URL del Frontend
FRONTEND_URL="https://localhost:5173"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="tu_access_token_de_mercadopago"
NGROK_URL="https://tu-subdominio.ngrok.io"

# Puerto del servidor
PORT=4000
```

### Frontend - Variables de Entorno

Crea un archivo `.env` en la carpeta `Frontend/` con:

```env
VITE_API_URL=http://localhost:4000
```

### Configuración de la Base de Datos

1. **Crear la base de datos en PostgreSQL:**

```bash
# Acceder a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE cutzy_cinema;

# Salir de psql
\q
```

2. **Ejecutar migraciones de Prisma:**

```bash
cd Backend
npx prisma migrate dev --name init
```

3. **Generar el cliente de Prisma:**

```bash
npx prisma generate
```

4. **Crear las tarifas y parámetros iniciales:**

```bash
npm run seed
```

### Configuración de Mercado Pago (Webhooks)

1. **Instalar ngrok:**

```bash
npm install -g ngrok
```

2. **Iniciar ngrok:**

```bash
ngrok http 4000
```

3. **Copiar la URL de ngrok** y actualizarla en el archivo `.env` del backend en `NGROK_URL`

## Ejecución

### Modo Desarrollo

#### 1. Iniciar el Backend

```bash
cd Backend
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

#### 2. Iniciar el Frontend

En otra terminal:

```bash
cd Frontend
npm run dev
```

El frontend estará disponible en `https://localhost:5173`

> **Nota**: El frontend usa HTTPS en desarrollo para Mercado Pago. Acepta el certificado autofirmado en tu navegador a la hora de ejecutar el Frontend.

#### 3. Iniciar ngrok (para webhooks)

En otra terminal:

```bash
ngrok http 4000
```

### Modo Producción

#### Backend

```bash
cd Backend
npm start
```

#### Frontend

```bash
cd Frontend
npm run build
npm run preview
```

## Usuarios de Prueba

### Administrador

```
Email: admin@cutzy.com
Contraseña: 123456
```

### Usuario Regular

```
Email: cliente@cutzy.com
Contraseña: 123456
```

### Error con Prisma

```bash
# Regenerar el cliente de Prisma
npx prisma generate

```

### Webhooks de Mercado Pago no funcionan

```bash
# Asegúrate de que ngrok esté corriendo
ngrok http 4000

# Actualiza la URL en .env con la nueva URL de ngrok
NGROK_URL="https://nuevo-subdominio.ngrok.io"

# Reinicia el backend
```

### Error de CORS

Verifica que `VITE_API_URL` en el frontend apunte correctamente al backend.

### Imágenes no se cargan

Verifica las credenciales de Cloudinary en el archivo `.env` del backend.

## Notas Adicionales

- **Seguridad**: Los archivos `.env` están en `.gitignore` y NO deben compartirse
- **Tarifas**: Asegúrate de ejecutar `seed` antes de crear salas o reservar
- **HTTPS Local**: El frontend usa HTTPS en desarrollo para Mercado Pago
- **Webhooks**: ngrok es necesario solo en desarrollo para testing de webhooks
- **PostgreSQL**: Se recomienda usar timestamp(0) para compatibilidad

## Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el repositorio.

## Licencia

Este proyecto es privado y de uso académico.

---

**Desarrollado por Diego Lezcano y Emiliano Luhmann**
