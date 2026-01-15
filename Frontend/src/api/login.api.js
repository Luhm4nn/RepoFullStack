import api from "./axiosInstance.js";

export const authAPI = {
  // Login
  login: async (email, password) => {
    try {
      // ...existing code...
      const response = await api.post("/auth/login", { email, password });
      // ...existing code...
      const { user } = response.data;
      return { user };
    } catch (error) {
      console.error("[authAPI] login: error", error);
      throw new Error(error.response?.data?.message || "Error en el login");
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      const { accessToken } = response.data;
      return accessToken;
    } catch (error) {
      throw new Error("Error al refrescar token");
    }
  },

  // Verificar si hay sesión activa
  checkAuth: async () => {
    try {
      // ...existing code...
      const response = await api.get("/auth/me");
      // ...existing code...
      if (response.data) {
        return {
          user: response.data
        };
      }
      return null;
    } catch (error) {
      console.error("[authAPI] checkAuth: error", error);
      return null;
    }
  },
};

export default api;
