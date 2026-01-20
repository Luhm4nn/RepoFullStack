# Minutas de Reuniones y Avances

Este documento contiene un registro de las reuniones realizadas para la planificación y seguimiento del proyecto.

---

## 📅 Reunión 1 - 01/07/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Definir alcance mínimo para la primera versión (MVP).
- Decidir tecnologías y estructura del backend.

**Decisiones tomadas:**

- Usar **Express + Node.js** para el backend.
- Base de datos **MySQL** gestionada con **Prisma ORM**.
- Endpoints iniciales: películas, funciones y reservas.
- Crear repositorio y configurar entorno compartido.

**Próximas tareas:**

- Emiliano: configurar proyecto base Express y conexión a MySQL.
- Diego: preparar script `BD.sql` para crear tablas iniciales.

---

## 📅 Reunión 2 - 14/07/2025

**Participantes:** Emiliano, Diego  
**Objetivos:**

- Revisar avances del backend y definir siguientes pasos para el frontend.

**Decisiones tomadas:**

- Se asignará a cada uno la creación de los endpoints de todas las entidades.
- Se implementará validación básica con middleware.
- Frontend será desarrollado en React en la siguiente iteración.

**Próximas tareas:**

- Emiliano: implementar endpoints asignados en GitHub Projects.
- Diego: implementar endpoints asignados en GitHub Projects.

---

## 📅 Reunión 3 - 01/08/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Planificar conexión frontend-backend.
- Organizar tareas en GitHub Projects.

**Decisiones tomadas:**

- Usar Axios para consumir la API.
- Usar Tailwind para la estética.
- Crear documentación.
- Una vez comprendido como encarar el Front definir tareas individuales para cada uno.

**Próximas tareas:**

- Emiliano, Diego: Iniciar Creación de FrontEnd con la perspectiva del admin.

---

## 📅 Reunión 4 - 02/08/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Planificar desarrollo Frontend.
- Determinar estética de la página.

**Decisiones tomadas:**

- Se acordó la paleta de colores para la página.
- Se utilizará la librería de componentes de Flowbite.
- Se utilizará la libreria de iconos de HeroIcons.

**Próximas tareas:**

- Diego: Gestionar Peliculas Front, Footer.
- Emiliano: Gestionar Salas Front, Navbar.

---

## 📅 Reunión 5 - 09/08/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Planificar la continuacion del desarrollo Frontend.
- Tratar de cerrar las ideas para la parte del admin.

**Decisiones tomadas:**

- Se acordó continuar con Tarifas y Popiedades Pages.
- Se acordó hacer las secciones informativas.
- Se acordó dejar para lo último por comodida la sección de Funciones.

**Próximas tareas:**

- Diego: Tarifas y Propiedades Front.
- Emiliano: Terminos y condiciones, informativas y secciones secundarias.
- Emiliano, Diego: Funciones Page (dejamos para lo último para poder utilizar la info de las otras Pages)

---

## 📅 Reunión 6 - 06/09/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Planificar la continuacion del desarrollo Frontend.
- Tratar de cerrar la parte del admin (validaciones y dashboard inicial).

**Decisiones tomadas:**

- Se acordó continuar con validaciones.
- Se acordó continuar con Funciones.
- Se acordó implementar Cloudinary para las imagenes.
- Se acordó implementar valibot en el back

**Próximas tareas:**

- Crear ramas desde validaciones.
- Diego: Cerrar validaciones de Salas, implementar cloudinary en peliculas, arrancar con dashboard.
- Emiliano: Cerrar validaciones de Funciones, reporte de funciones que no están activas, filtrado por funciones.
- Emiliano, Diego: Implementar Valibot.

---

## 📅 Reunión 7 - 28/09/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Planificar inicio de sesion.
- Implemnetar primeras vistas del modelo para Cliente.
- Definir issues para proximos pasos pendientes en la parte Admin.

**Decisiones tomadas:**

- Se acordó implementar el inicio de sesión para proteger rutas.
- Se utilizará JWT como mecanismo de autenticación.
- Se construirán los archivos y estructura necesaria para Auth en el backend.

**Próximas tareas:**

🔐 Backend (Node.js + Express + Prisma)

- Crear modelo Usuario en Prisma (con campos: id, nombre, email, password, rol).
- Implementar registro de usuario (hash de contraseña con bcrypt).
- Implementar login de usuario (verificar credenciales y generar JWT).
- Crear middleware de autenticación que valide el token JWT en rutas protegidas.
- Crear middleware de autorización por rol (ej: admin, cliente).
- Proteger rutas del administrador (/peliculas, /funciones, /salas, etc.).
- Proteger ruta de reservas (solo accesible a usuarios logueados).

🖥️ Frontend (React + Vite + Tailwind + Valibot)

- Crear formulario de login con Formik + Yup/Valibot.
- Crear formulario de registro de cliente.
- Guardar el JWT en localStorage o cookies seguras al iniciar sesión.
- Implementar un Auth Context / hook useAuth para manejar estado de autenticación en el front.
- Redirigir al usuario a /login si intenta acceder a rutas protegidas.
- Implementar layout diferente según rol:
  Usuario no logueado → puede ver cartelera.
  Cliente logueado → puede reservar funciones.
  Admin → accede al dashboard con gestión de películas, funciones, etc.

---

## 📅 Reunión 8 - 20/10/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Iniciar el desarrollo del Dashboard administrativo.
- Implementar la cartelera pública dinámica para los clientes.

**Decisiones tomadas:**

- Se utilizará un layout de dashboard con métricas rápidas (ventas del día, funciones activas).
- La cartelera filtrará películas que tengan funciones vigentes.
- Se implementará un buscador por título de película.

**Próximas tareas:**

- Diego: Crear estructura del Dashboard y componentes de estadísticas.
- Diego: Implementar Grid de películas en el home.
- Emiliano: Crear endpoints de estadísticas (ventas totales, ocupación).
- Emiliano: Optimizar búsqueda de películas en el backend.

---

## 📅 Reunión 9 - 12/11/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Desarrollar el sistema interactivo de selección de asientos.
- Definir el flujo de pre-reserva antes del pago.

**Decisiones tomadas:**

- Se representará la sala mediante un mapa de asientos reactivo (SVG/Divs).
- Los asientos cambiarán de color según disponibilidad (Libre, Ocupado, Seleccionado).
- Al seleccionar, se bloqueará temporalmente el asiento para evitar duplicidad.

**Próximas tareas:**

- Diego: Implementar interfaz del mapa de asientos en el frontend.
- Emiliano: Crear lógica de validación de disponibilidad de asientos en tiempo real.
- Emiliano: Implementar temporizador de reserva temporal (10-15 min).

---

## 📅 Reunión 10 - 05/12/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Integrar pasarela de pagos con Mercado Pago.
- Manejar la confirmación de la reserva y estados de pago.

**Decisiones tomadas:**

- Se utilizará la integración de Checkout Pro.
- Se implementará un Webhook para recibir notificaciones de Mercado Pago y actualizar el estado de la reserva de forma asíncrona.
- Al confirmar el pago, se generará un código único para la entrada.

**Próximas tareas:**

- Emiliano: Integrar SDK de Mercado Pago en el backend y configurar el webhook.
- Emiliano: Crear lógica de actualización automática de reservas (`PAGADA`, `CANCELADA`).
- Diego: Crear página de éxito/error de pago y resumen de reserva.

---

## 📅 Reunión 11 - 23/12/2025

**Participantes:** Emiliano, Diego
**Objetivos:**

- Reforzar la seguridad y robustez del sistema de reservas (Transacciones Atómicas).
- Cierre de funcionalidades del MVP para el fin de año.

**Decisiones tomadas:**

- Utilizar transacciones de Prisma para asegurar que el pago y la creación de asientos sean una operación única.
- Endurecer el Webhook de Mercado Pago para evitar recreación de reservas duplicadas.
- Limpieza de `localStorage` y manejo de sesiones de reserva.

**Próximas tareas:**

- Emiliano: Implementar `prisma.$transaction` en el repositorio de reservas.
- Emiliano: Hardening del Webhook (validación estricta de IDs).
- Diego: Pulir estética de botones, dropdowns y transiciones visuales.

---

## 📅 Reunión 12 - 10/01/2026

**Participantes:** Emiliano, Diego
**Objetivos:**

- Implementar el escáner de QR para validación de entradas.
- Revisión final de la UI de administración y correcciones menores.

**Decisiones tomadas:**

- El personal del cine podrá escanear el QR desde el usuario Escaner.
- Se usará una librería de escaneo de cámara en el navegador.
- El escaneo marcará la reserva como "UTILIZADA".

**Próximas tareas:**

- Diego: Integrar escáner QR en la sección de administración.
- Emiliano: Crear endpoint de validación de token QR con firma de seguridad.
- Emiliano, Diego: Ajustes finales de estilo y documentación completa del sistema.
