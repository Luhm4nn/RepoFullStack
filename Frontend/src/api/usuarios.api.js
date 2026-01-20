import api from './axiosInstance.js';

// API para manejo de usuarios
export const usuariosAPI = {
  // Registrar nuevo cliente (solo rol CLIENTE) - usando POST /Usuario
  register: async (userData) => {
    try {
      const response = await api.post('/Usuario', {
        ...userData,
        rol: 'CLIENTE' // Forzar rol cliente para registro público
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/Usuarios');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  getUser: async (dni) => {
    try {
      const response = await api.get(`/Usuario/${dni}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/Usuario', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  updateUser: async (dni, userData) => {
    try {
      const response = await api.put(`/Usuario/${dni}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  deleteUser: async (dni) => {
    try {
      const response = await api.delete(`/Usuario/${dni}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  },

  // Métodos adicionales para funcionalidades específicas (si las implementas en el backend)
  
  // Obtener perfil del usuario actual (necesitarías implementar en backend)
  getProfile: async () => {
    try {
      // Asumiendo que implementarás GET /usuarios/profile en el backend
      const response = await api.get('/usuarios/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener perfil');
    }
  },

  // Actualizar perfil del usuario actual (necesitarías implementar en backend)
  updateProfile: async (userData) => {
    try {
      // Asumiendo que implementarás PUT /usuarios/profile en el backend
      const response = await api.put('/usuarios/profile', userData);
      
      const updatedUser = response.data;      
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  },

  // Cambiar contraseña (necesitarías implementar en backend)
  changePassword: async (currentPassword, newPassword) => {
    try {
      // Asumiendo que implementarás PUT /usuarios/change-password en el backend
      const response = await api.put('/usuarios/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  }
};