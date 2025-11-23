import { loginService } from './auth.service.js';
import { handleRefreshToken, revokeRefreshToken, revokeAllSessions } from './refreshToken.service.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    const { token, user } = await loginService(email, password, res);
    console.log(`[AUTH] Login exitoso - Usuario: ${user.email}, IP: ${ip}, UA: ${userAgent}`);
    res.json({ token, user });
  } catch (error) {
    console.log(`[AUTH] Login fallido - Email: ${email}, IP: ${ip}, Reason: ${error.message}`);
    throw error;
  }
};

export const refresh = handleRefreshToken;
export const logout = revokeRefreshToken;
export const logoutAllSessions = revokeAllSessions;
