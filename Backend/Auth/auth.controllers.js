import { loginService } from './auth.service.js';
import { handleRefreshToken, revokeRefreshToken, revokeAllSessions } from './refreshToken.service.js';
import logger from '../utils/logger.js';
import { generateCsrfToken } from '../config/csrf.js';

/**
 * Inicia sesión de usuario
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { token, user } = await loginService(email, password, res);
    
    logger.security('Login successful', {
      action: 'login',
      success: true,
      userRole: user.rol,
    });
    
    res.json({ token, user });
  } catch (error) {
    logger.security('Login failed', {
      action: 'login',
      success: false,
      reason: 'Invalid credentials',
    });
    
    throw error;
  }
};

/**
 * Obtiene el token CSRF para el cliente
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const getCsrfToken = (req, res) => {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
};

export const refresh = handleRefreshToken;
export const logout = revokeRefreshToken;
export const logoutAllSessions = revokeAllSessions;
