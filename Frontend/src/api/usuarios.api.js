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

  // Actualizar perfil del usuario actual
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/Usuario/me', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  },

  // Cambiar contraseña del usuario actual
  changePassword: async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      const response = await api.patch('/Usuario/me/password', {
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar contraseña');
    }
  },
    }
;