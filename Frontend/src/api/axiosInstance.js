import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Instancia centralizada de axios con configuración base
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Obtener token CSRF inicial al cargar la aplicación
const initCsrfToken = async () => {
  try {
    await axios.get(`${API_URL}/auth/csrf-token`, {
      withCredentials: true,
    });
  } catch (error) {
    console.warn('No se pudo obtener token CSRF:', error.message);
  }
};

// Inicializar token CSRF
initCsrfToken();

// Interceptor para inyectar token CSRF en requests
api.interceptors.request.use(
  (config) => {
    // Leer el token CSRF de la cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    // Agregar token al header si existe
    if (csrfToken) {
      config.headers['x-csrf-token'] = csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores y refresh automático del token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
