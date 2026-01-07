import api from "./axiosInstance.js";

export const authAPI = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user } = response.data;
      localStorage.setItem("user", JSON.stringify(user));

      return { user };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error en el login");
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("user");
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
  checkAuth: () => {
    const user = localStorage.getItem("user");

    if (user) {
      try {
        return {
          user: JSON.parse(user),
        };
      } catch (error) {
        localStorage.removeItem("user");
        return null;
      }
    }

    return null;
  },
};

export default api;
