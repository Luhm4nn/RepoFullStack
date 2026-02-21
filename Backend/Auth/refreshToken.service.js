import jwt from 'jsonwebtoken';
import { findRefreshToken, deleteRefreshToken, saveRefreshToken, deleteAllTokensForUser } from './refreshToken.repository.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be configured in environment variables');
}

export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export async function handleRefreshToken(req, res) {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  const tokenInDb = await findRefreshToken(oldRefreshToken);
  if (!tokenInDb) {
    return res.status(401).json({ message: 'Refresh token inválido' });
  }

  try {
    const payload = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
    });

    const newRefreshToken = generateRefreshToken({
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
    });

    await deleteRefreshToken(oldRefreshToken);
    await saveRefreshToken(payload.id, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000,
    });
    
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    await deleteRefreshToken(oldRefreshToken);
    return res.status(403).json({ message: 'Refresh token expirado o inválido' });
  }
}

export async function revokeRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });
  await deleteRefreshToken(refreshToken);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
  res.json({ message: 'Sesión cerrada' });
}

export async function revokeAllSessions(req, res) {
  const userId = req.user.id;
  await deleteAllTokensForUser(userId);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.clearCookie('refreshToken', cookieOptions)
    .clearCookie('accessToken', cookieOptions)
    .json({ message: 'Todas las sesiones cerradas exitosamente' });
}
