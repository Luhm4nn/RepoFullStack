import { loginService } from './auth.service.js';
import { handleRefreshToken, revokeRefreshToken, revokeAllSessions } from './refreshToken.service.js';
import logger from '../utils/logger.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    const { token, user } = await loginService(email, password, res);
    
    // Log de seguridad SIN datos sensibles
    logger.security('Login successful', {
      action: 'login',
      success: true,
      userRole: user.rol,
    });
    
    res.json({ token, user });
  } catch (error) {
    // Log de seguridad para intentos fallidos
    logger.security('Login failed', {
      action: 'login',
      success: false,
      reason: 'Invalid credentials',
    });
    
    throw error;
  }
};

export const refresh = handleRefreshToken;
export const logout = revokeRefreshToken;
export const logoutAllSessions = revokeAllSessions;
