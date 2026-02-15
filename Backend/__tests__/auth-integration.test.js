
import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { getAdminToken } from './helpers.js';

describe('Auth Integration', () => {
  let adminCookie;

  beforeAll(async () => {
    adminCookie = await getAdminToken();
  });

  describe('POST /auth/login', () => {
    test('debe retornar cookies httpOnly y user en el body (no token)', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'admin@cutzy.com',
        password: '123456',
      });

      expect(response.status).toBe(200);
      
      expect(response.body).toHaveProperty('user');
      expect(response.body).not.toHaveProperty('token');
      
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
        .set('Cookie', adminCookie);

      expect(response.status).toBe(200);

      const cookies = response.headers['set-cookie'];
      const accessTokenCookie = cookies.find(c => c.startsWith('accessToken='));
      expect(accessTokenCookie).toMatch(/Expires=|Max-Age=0/);
    });
  });
});
