// Entry point for shared module



// Components
export { default as AdminNavbar } from '../admin/components/AdminNavbar.jsx';
export { default as ClaquetaPersonaje } from './components/ClaquetaPersonaje.jsx';
export { default as ErrorModal } from './components/ErrorModal.jsx';
export { default as FooterComp } from './components/FooterComp.jsx';
export { default as FuncionesReservaCard } from '../user/components/FuncionesReservaCard.jsx';
export { default as LoginForm } from './components/LoginForm.jsx';
export { default as PeliculaCard } from '../user/components/PeliculaCard.jsx';
export { default as ProtectedRoute } from './components/ProtectedRoute.jsx';
export { PrivateRoute, RoleRoute, AdminRoute, ClientRoute, AuthenticatedRoute } from './components/ProtectedRoute.jsx';
export { default as PublicNavbar } from './components/PublicNavbar.jsx';
export { default as RegisterForm } from './components/RegisterForm.jsx';
export { default as ScrollToTop } from './components/ScrollToTop.jsx';

// Hooks
export { default as useErrorModal } from './hooks/useErrorModal';

// Utils
export * from './utils/dateFormater.js';
export * from './utils/debounce.js';
export * from './utils/formatearPrecio.js';

// Constants
export * from './constants/errorCodes.js';


