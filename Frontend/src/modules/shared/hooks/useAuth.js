import { useContext } from 'react';
import AuthContext from '../../../context/AuthContext.jsx';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};

export const useRole = (requiredRole) => {
  const { user, isAuthenticated } = useAuth();
  return {
    hasRole: isAuthenticated && user?.rol === requiredRole,
    userRole: user?.rol,
    isAuthenticated
  };
};

export const useIsAdmin = () => {
  const { hasRole } = useRole('ADMIN');
  return hasRole;
};

export const useIsClient = () => {
  const { hasRole } = useRole('CLIENTE');
  return hasRole;
};

export const useCurrentUser = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: user?.rol === 'ADMIN',
    isClient: user?.rol === 'CLIENTE',
    fullName: user ? `${user.nombreUsuario} ${user.apellidoUsuario}` : '',
    initials: user ? `${user.nombreUsuario.charAt(0)}${user.apellidoUsuario.charAt(0)}`.toUpperCase() : ''
  };
};

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
      return false;
    }
  };
  
  return handleLogout;
};
