import axios from 'axios';
import { notifyGlobal } from '../context/NotificationContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh', {});
        return api(originalRequest);
      } catch (refreshError) {
        // Solo redirigir si NO estamos ya en el login para evitar bucles
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    // Manejo global de errores 500
    if (error.response?.status === 500) {
      notifyGlobal.error('Error de conexión con el servidor');
    }

    return Promise.reject(error);
  }
);

export default api;
