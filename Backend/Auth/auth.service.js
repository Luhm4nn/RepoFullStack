import prisma from '../prisma/prisma.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from './refreshToken.service.js';
import { saveRefreshToken } from './refreshToken.repository.js';

export const loginService = async (email, password, res) => {

  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.status = 401;
    throw error;
  }
  
  const valid = await bcrypt.compare(password, user.contrasena);
  if (!valid) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.status = 401;
    throw error;
  }
  const accessToken = generateAccessToken({ id: user.DNI, email: user.email, rol: user.rol });
  const refreshToken = generateRefreshToken({ id: user.DNI, email: user.email, rol: user.rol });
  await saveRefreshToken(user.DNI, refreshToken);
  const { contrasena, ...userSafe } = user;
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return { token: accessToken, user: userSafe };
};
