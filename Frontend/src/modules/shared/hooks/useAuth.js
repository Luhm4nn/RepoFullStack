import { useContext } from 'react';
import AuthContext from '../../../context/AuthContext.jsx';

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};

// Hook para verificar si el usuario tiene un rol específico
export const useRole = (requiredRole) => {
  const { user, isAuthenticated } = useAuth();
  
  return {
    hasRole: isAuthenticated && user?.rol === requiredRole,
    userRole: user?.rol,
    isAuthenticated
  };
};

// Hook para verificar si es admin
export const useIsAdmin = () => {
  const { hasRole } = useRole('ADMIN');
  return hasRole;
};

// Hook para verificar si es cliente
export const useIsClient = () => {
  const { hasRole } = useRole('CLIENTE');
  return hasRole;
};

// Hook para obtener información del usuario actual
export const useCurrentUser = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.rol === 'ADMIN',
    isClient: user?.rol === 'CLIENTE',
    fullName: user ? `${user.nombreUsuario} ${user.apellidoUsuario}` : '',
    initials: user ? `${user.nombreUsuario.charAt(0)}${user.apellidoUsuario.charAt(0)}` : ''
  };
};

// Hook para manejar logout con confirmación
export const useLogout = () => {
  const { logout } = useAuth();
  
  const handleLogout = async (showConfirm = true) => {
    if (showConfirm) {
      const confirmed = window.confirm('¿Estás seguro que quieres cerrar sesión?');
      if (!confirmed) return false;
    }
    
    try {
      await logout();
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return false;
    }
  };
  
  return handleLogout;
};
