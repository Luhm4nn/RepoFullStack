import { useAuth } from '../hooks/useAuth.js';

// Componente para rutas que requieren autenticación
const PrivateRoute = ({ children, redirectTo = '/login', fallback = null }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para acceder a esta página</p>
          <button
            onClick={() => window.location.href = redirectTo}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Componente para rutas que requieren un rol específico
const RoleRoute = ({ children, allowedRoles = [], redirectTo = '/unauthorized', fallback = null }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para acceder a esta página</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user?.rol)) {
    return fallback || (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400 mb-2">No tienes permisos para acceder a esta página</p>
          <p className="text-sm text-gray-500 mb-6">
            Rol actual: <span className="font-medium text-gray-300">{user?.rol || 'Desconocido'}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all"
            >
              Volver
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

// Componente para rutas solo para administradores
const AdminRoute = ({ children, ...props }) => {
  return (
    <RoleRoute allowedRoles={['ADMIN']} {...props}>
      {children}
    </RoleRoute>
  );
};

// Componente para rutas solo para clientes
const ClientRoute = ({ children, ...props }) => {
  return (
    <RoleRoute allowedRoles={['CLIENTE']} {...props}>
      {children}
    </RoleRoute>
  );
};

// Componente para rutas que requieren estar autenticado pero permiten cualquier rol
const AuthenticatedRoute = ({ children, ...props }) => {
  return (
    <RoleRoute allowedRoles={['ADMIN', 'CLIENTE']} {...props}>
      {children}
    </RoleRoute>
  );
};

// Exportar todos los componentes
export { PrivateRoute, RoleRoute, AdminRoute, ClientRoute, AuthenticatedRoute };
export default PrivateRoute;