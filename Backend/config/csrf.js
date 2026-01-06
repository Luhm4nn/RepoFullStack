import 'dotenv/config';
import { doubleCsrf } from 'csrf-csrf';

const csrfSecret = process.env.CSRF_SECRET;
if (!csrfSecret) {
  throw new Error('CSRF_SECRET is required in environment variables');
}

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => csrfSecret,
  cookieName: 'XSRF-TOKEN',
  cookieOptions: {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
  getSessionIdentifier: () => 'csrf-session',
});

export { doubleCsrfProtection, generateCsrfToken };
