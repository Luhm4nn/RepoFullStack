
import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { getAdminToken } from './helpers.js';

describe('Auth Integration', () => {
  let adminCookie;

  beforeAll(async () => {
    // Esto asegura que podemos conectar a la DB y loguearnos
    // getAdminToken ya fue parcheado para devolver cookies
    adminCookie = await getAdminToken();
  });

  describe('POST /auth/login', () => {
    test('debe retornar cookies httpOnly y user en el body (no token)', async () => {
      // Login con credenciales de admin conocidas
      const response = await request(app).post('/auth/login').send({
        email: 'admin@cutzy.com',
        password: '123456',
      });

      expect(response.status).toBe(200);
      
      // Validar Body
      expect(response.body).toHaveProperty('user');
      expect(response.body).not.toHaveProperty('token'); // NO debe devolver token
      
      // Validar Cookies
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(Array.isArray(cookies)).toBe(true);

      const accessTokenCookie = cookies.find(c => c.startsWith('accessToken='));
      const refreshTokenCookie = cookies.find(c => c.startsWith('refreshToken='));

      expect(accessTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toBeDefined();
      
      expect(accessTokenCookie).toContain('HttpOnly');
    });
  });

  describe('POST /auth/logout', () => {
    test('debe limpiar las cookies', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set('Cookie', adminCookie); // Enviar cookies de sesión

      expect(response.status).toBe(200);

      const cookies = response.headers['set-cookie'];
      // Verificar que las cookies se setean para expirar
      const accessTokenCookie = cookies.find(c => c.startsWith('accessToken='));
      // Express res.clearCookie suele setear Expires a fecha pasada o Max-Age: 0
      expect(accessTokenCookie).toMatch(/Expires=|Max-Age=0/);
    });
  });
});
