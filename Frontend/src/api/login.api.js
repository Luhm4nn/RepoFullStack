import api from './axiosInstance.js';

// Auth API functions
export const authAPI = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Guardar token y usuario
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      throw new Error('Error al refrescar token');
    }
  },

  // Verificar si hay sesión activa
  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        return {
          token,
          user: JSON.parse(user),
        };
      } catch (error) {
        // Si hay error parseando el usuario, limpiar todo
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        return null;
      }
    }

    return null;
  },
};

// Exportar la instancia de axios configurada para usar en otros lugares
export default api;