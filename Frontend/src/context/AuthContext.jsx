import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/login.api.js';
import { usuariosAPI } from '../api/usuarios.api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Verificar autenticación
      const authData = await authAPI.checkAuth();
      if (authData) {
        let userPlano = authData.user;
        if (userPlano && userPlano.user) {
          userPlano = userPlano.user;
        }
        setUser(userPlano);
        setIsAuthenticated(!!userPlano);
      }
    } catch (error) {
      console.error('[AuthContext] Error initializing auth:', error);
      const isNetworkError =
        error.code === 'ERR_NETWORK' || error.code === 'ERR_INTERNET_DISCONNECTED';
      const isAuthError = error.response?.status === 401 || error.response?.status === 403;
      if (!isNetworkError || isAuthError) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { user: userData } = await authAPI.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      console.error('[AuthContext] login: error en login', error);
      return {
        success: false,
        error: error.message || 'Error en el login',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const res = await authAPI.logout();
      if (res && res.status === 200) {
        localStorage.removeItem('reserva_step3');
        localStorage.removeItem('countdown_expiry');
      }
    } catch (error) {
      // Error en logout
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const hasRole = (role) => {
    return user?.rol === role;
  };

  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  const isClient = () => {
    return hasRole('CLIENTE');
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await usuariosAPI.register(userData);
      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true, ...result };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error en el registro',
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    hasRole,
    isAdmin,
    isClient,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
