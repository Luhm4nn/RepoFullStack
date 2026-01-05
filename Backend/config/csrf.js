import 'dotenv/config';
import { doubleCsrf } from 'csrf-csrf';

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'default-secret',
  cookieName: 'XSRF-TOKEN',
  cookieOptions: {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
  getSessionIdentifier: (req) => req.sessionID || '',
});

export { doubleCsrfProtection, generateCsrfToken };
