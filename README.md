# Cutzy Cinema - Sistema de Reserva de Entradas

Sistema integral de gestión y reserva de entradas de cine. Permite a los usuarios explorar la cartelera, seleccionar funciones, elegir asientos y completar pagos de forma segura mediante Mercado Pago.

## 🚀 Acceso Rápido
- **[Documentación Técnica](/docs/documentacion.md)**: Contiene la arquitectura detallada, flujos de autenticación, interceptores de Axios y patrones de diseño utilizados.
- **[Minutas de reuniones](/docs/minutas.md)**: Historial de acuerdos y seguimiento del desarrollo.
- **[API Docs (Swagger)](https://repofullstack.onrender.com/api-docs)**:  documentación detallada de la API mediante Swagger.
- **[Propuesta actualizada](https://github.com/Luhm4nn/TP-DSW-lez-Luh/blob/main/proposal.md)**

---

## ✨ Características Principales

### Para Usuarios 🍿
- **Cartelera Dinámica**:Explora películas en exhibición con detalles y tráilers.
- **Selector de Asientos**: Mapa interactivo con soporte para asientos Normales y VIP.
- **Pagos con Mercado Pago**: Integración completa para transacciones seguras.
- **Gestión de Reservas**: Visualización y cancelación de reservas desde el perfil.

### Para Administradores 🛠️
- **Panel de Control**: CRUD de películas, salas, funciones, además de Dashboard y Reportes.
- **Carga de Imágenes**: Integración con Cloudinary para posters de películas.
- **Filtros Avanzados**: Búsqueda por géneros, directores, salas y fechas.
- **Gestión de Stock**: Control automático de disponibilidad de asientos.

### Para Personal de Cine (Escáner) 🔍
- **Validación de Entradas**: Acceso a la interfaz de escaneo de códigos QR.
- **Control de Acceso**: Validación en tiempo real del estado de la reserva y marca de "Asistida".

---

## � Estructura del Sistema

```text
├── Backend/          # Servidor de API, lógica de negocio y controladores.
├── Frontend/         # Aplicación de cliente (SPA) en React 19.
├── docs/             # Manuales técnicos, minutas y guías complementarias.
│   ├── documentacion.md # -> Deep-dive técnico y guías de arquitectura.
│   └── minutas.md       # -> Seguimiento de reuniones.
└── prisma/           # Esquemas y configuraciones de la base de datos.
```

---

## 🔐 Seguridad y Autenticación

El sistema implementa múltiples capas de protección:
- **JWT en cookies httpOnly**: Protección contra ataques XSS.
- **Protección CSRF**: Validación de tokens en todas las operaciones mutables.
- **Refresh Token Rotation**: Detección de uso indebido de sesiones.
- **Rate Limiting**: Protección contra ataques de fuerza bruta en el backend.
- **Validación con Yup**: Esquemas de validación estrictos tanto en frontend como en backend.

---

## 🧪 Testing

El proyecto cuenta con una suite de pruebas para asegurar la estabilidad:

- **Backend (Jest)**: Unitarias e integración para servicios, rutas y controladores.
  ```bash
  cd Backend && npm test
  ```
- **Frontend (Playwright & Jest)**: Pruebas de componentes y flujos de usuario (E2E).
  ```bash
  cd Frontend && npm test        # Componentes
  cd Frontend && npm run test:e2e # End-to-End
  ```

---

## �🛠️ Stack Tecnológico

| Componente | Tecnologías |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Tailwind CSS 4, Flowbite React, Lucide Icons. |
| **Backend** | Node.js, Express.js, Prisma ORM, JWT, Bcrypt, Yup. |
| **Servicios** | PostgreSQL, Mercado Pago SDK, Cloudinary, Node-Cron. |

---

## ⚙️ Configuración y Ejecución

### 1. Requisitos Previos
- **Node.js**: v18+
- **PostgreSQL**: v14+
- **Cuentas**: Mercado Pago, Cloudinary y `ngrok` (para webhooks).

### 2. Instalación
```bash
# Instalar Backend
cd Backend && npm install

# Instalar Frontend
cd ../Frontend && npm install
```

### 3. Variables de Entorno (.env)
Configura un `.env` en la carpeta `Backend/` basándote en el archivo `.env.example` incluido.

### 4. Base de Datos
```bash
cd Backend
npx prisma migrate dev
```

### 5. Iniciar Proyecto
- **Backend**: `npm run dev` (disponible en `http://localhost:4000`)
- **Frontend**: `npm run dev` (disponible en `http://localhost:5173`)
- **Webhooks**: `ngrok http 4000`

---

## 👤 Usuarios de Prueba

| Rol | Email | Contraseña |
| :--- | :--- | :--- |
| **Admin** | `admin@cutzy.com` | `123456` |
| **Escáner** | `escaner@cutzy.com` | `123456` |
| **Usuario** | `cliente@cutzy.com` | `123456` |

---

## 👥 Equipo y Licencia
**Integrantes**: Diego Lezcano y Emiliano Luhmann - UTN FRRO 2025.
Este proyecto es de uso exclusivamente académico.

