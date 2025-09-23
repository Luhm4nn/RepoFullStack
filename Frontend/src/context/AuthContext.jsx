import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/login.api.js';
import { usuariosAPI } from '../api/usuarios.api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authData = authAPI.checkAuth();
      if (authData) {
        setUser(authData.user);
        setToken(authData.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
  // Error verificando autenticación
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { token: newToken, user: userData } = await authAPI.login(email, password);
      
      setUser(userData);
      setToken(newToken);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
  // Error en login
      return { 
        success: false, 
        error: error.message || 'Error en el login' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
  // Error en logout
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
      setToken(result.token);
      setIsAuthenticated(true);
      return { success: true, ...result };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error en el registro'
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    updateUser,
    hasRole,
    isAdmin,
    isClient,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;