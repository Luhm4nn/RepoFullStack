import prisma from '../prisma/prisma.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from './refreshToken.service.js';
import { saveRefreshToken } from './refreshToken.repository.js';

export const loginService = async (email, password, res) => {
  // Buscar usuario por email
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.status = 401;
    throw error;
  }
  // Comparar password
  const valid = await bcrypt.compare(password, user.contrasena);
  if (!valid) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.status = 401;
    throw error;
  }
  // Generar tokens
  const accessToken = generateAccessToken({ id: user.DNI, email: user.email, rol: user.rol });
  const refreshToken = generateRefreshToken({ id: user.DNI, email: user.email, rol: user.rol });
  await saveRefreshToken(user.DNI, refreshToken);
  // No enviar la contraseña al front
  const { contrasena, ...userSafe } = user;
  // Enviar refresh token en cookie httpOnly
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return { token: accessToken, user: userSafe };
};
