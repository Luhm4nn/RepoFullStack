import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, rol: payload.rol };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
