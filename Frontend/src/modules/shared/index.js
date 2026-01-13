/**
 * Modulo Compartido
 * 
 * Exporta componentes, hooks y utilidades compartidas entre admin y user.
 * NO duplica utils/constants globales, solo los re-exporta para conveniencia.
 */

// Components
export { default as ClaquetaPersonaje } from './components/ClaquetaPersonaje.jsx';
export { default as ErrorModal } from './components/ErrorModal.jsx';
export { default as FooterComp } from './components/FooterComp.jsx';
export { default as LoginForm } from './components/LoginForm.jsx';
export { Pagination } from './components/Pagination.jsx';
export { default as ProtectedRoute } from './components/ProtectedRoute.jsx';
export { PrivateRoute, RoleRoute, AdminRoute, ClientRoute, AuthenticatedRoute } from './components/ProtectedRoute.jsx';
export { ModalCierreSesion } from './components/ModalCierreSesion.jsx';
export { default as PeliculaCard } from '../user/components/PeliculaCard.jsx';
export { default as PublicNavbar } from './components/PublicNavbar.jsx';
export { default as RegisterForm } from './components/RegisterForm.jsx';
export { default as ScrollToTop } from './components/ScrollToTop.jsx';

// Hooks
export { useAuth, useRole, useIsAdmin } from './hooks/useAuth';
export { useErrorModal } from './hooks/useErrorModal';

// Utils (re-exportados desde src/utils/ global)
export { dateFormaterBackend, formatDate, formatDateTime } from '../../utils/dateFormater.js';
export { debounce } from '../../utils/debounce.js';
export { formatearPrecio } from '../../utils/formatearPrecio.js';

// Constants (re-exportados desde src/constants/ global)
export { ERROR_CODES, getErrorMetadata } from '../../constants/errorCodes.js';


