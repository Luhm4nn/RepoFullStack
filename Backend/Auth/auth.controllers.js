import { loginService } from "./auth.service.js";
import { handleRefreshToken, revokeRefreshToken } from "./refreshToken.service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginService(email, password, res);
  res.json({ token, user });
};

export const refresh = handleRefreshToken;
export const logout = revokeRefreshToken;
