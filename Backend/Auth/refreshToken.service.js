import jwt from "jsonwebtoken";
import { findRefreshToken, deleteRefreshToken } from "./refreshToken.repository.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";

export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export async function handleRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  const tokenInDb = await findRefreshToken(refreshToken);
  if (!tokenInDb) return res.status(401).json({ message: "Refresh token inválido" });

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({ id: payload.id, email: payload.email, rol: payload.rol });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token inválido o expirado" });
  }
}

export async function revokeRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(400).json({ message: "No refresh token" });
  await deleteRefreshToken(refreshToken);
  res.clearCookie("refreshToken").json({ message: "Sesión cerrada" });
}
