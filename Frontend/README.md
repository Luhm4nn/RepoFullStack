# Cinema App Frontend

Este es el frontend de la aplicación web de cines, desarrollado con React y TypeScript.

## Tecnologías Utilizadas

- **React 19.1.1** - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** - Superset de JavaScript que añade tipado estático
- **Material-UI (MUI)** - Biblioteca de componentes React para un diseño moderno
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para realizar peticiones al backend
- **Create React App** - Herramienta de configuración y construcción

## Estructura del Proyecto

```
src/
├── components/         # Componentes React reutilizables
│   ├── Home.tsx       # Página principal
│   └── Movies.tsx     # Página de cartelera de películas
├── App.tsx            # Componente principal de la aplicación
├── App.css            # Estilos principales
└── index.tsx          # Punto de entrada de la aplicación
```

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm (incluido con Node.js)

### Instalación

```bash
cd Frontend/cinema-app
npm install
```

### Ejecución en Desarrollo

```bash
npm start
```

La aplicación se ejecutará en `http://localhost:3000`

### Construcción para Producción

```bash
npm run build
```

### Ejecución de Pruebas

```bash
npm test
```

## Características Implementadas

- ✅ **Página de Inicio**: Portal principal con navegación a diferentes secciones
- ✅ **Cartelera de Películas**: Visualización de películas disponibles
- ✅ **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- ✅ **Integración con Backend**: Preparado para conectar con la API del backend
- ✅ **Datos de Ejemplo**: Funciona con datos mock cuando el backend no está disponible
- ✅ **Navegación**: Sistema de rutas entre páginas
- ✅ **Componentes Reutilizables**: Estructura modular y escalable

## Próximas Características

- 🔄 Reserva de boletos
- 🔄 Selección de asientos
- 🔄 Sistema de usuarios
- 🔄 Gestión de funciones y horarios
- 🔄 Carrito de compras
- 🔄 Pasarela de pagos

## Conexión con Backend

La aplicación está configurada para conectarse con el backend en `http://localhost:3001`. Cuando el backend no está disponible, utiliza datos de ejemplo para demostración.

## Scripts Disponibles

- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expone la configuración de Webpack (irreversible)

## Contribución

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y añade tests si es necesario
4. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
5. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
6. Abre un Pull Request