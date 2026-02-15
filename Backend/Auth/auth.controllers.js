import { loginService } from './auth.service.js';
import {
  handleRefreshToken,
  revokeRefreshToken,
  revokeAllSessions,
} from './refreshToken.service.js';
import logger from '../utils/logger.js';
import prisma from '../prisma/prisma.js';

/**
 * Inicia sesión de usuario
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user } = await loginService(email, password, res);

    logger.security('Login successful', {
      action: 'login',
      success: true,
      userRole: user.rol,
    });

    res.json({ user });
  } catch (error) {
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

export const getUsuarioLoggedIn = async (req, res) => {
  const user = await prisma.usuario.findUnique({
    where: { DNI: req.user.id },
    select: {
      DNI: true,
      nombreUsuario: true,
      apellidoUsuario: true,
      email: true,
      rol: true,
      telefono: true,
    }
  });
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json(user);
};
