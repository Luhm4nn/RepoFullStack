import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

describe('Auth API', () => {
  describe('POST /auth/login', () => {
    test('debe retornar 401 con credenciales inválidas', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'noexiste@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('debe retornar token con credenciales válidas de admin', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'admin@cutzy.com',
        password: '123456',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'admin@cutzy.com');
    });

    test('no debe retornar la contraseña en la respuesta', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'admin@cutzy.com',
        password: '123456',
      });

      expect(response.status).toBe(200);
      expect(response.body.user).not.toHaveProperty('contrasena');
    });

    test('debe setear cookie httpOnly para refresh token', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'admin@cutzy.com',
        password: '123456',
      });

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
      
      const cookies = response.headers['set-cookie'];
      const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));
      
      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toContain('HttpOnly');
    });
  });

  describe('POST /auth/refresh', () => {
    test('debe retornar 401 sin refresh token', async () => {
      const response = await request(app).post('/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('debe retornar nuevo access token con refresh token válido', async () => {
      // Primero hacer login para obtener refresh token
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'admin@cutzy.com',
        password: '123456',
      });

      const cookies = loginResponse.headers['set-cookie'];

      // Usar el refresh token para obtener nuevo access token
      const refreshResponse = await request(app)
        .post('/auth/refresh')
        .set('Cookie', cookies);

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body).toHaveProperty('accessToken');
    });
  });

  describe('POST /auth/logout', () => {
    test('debe cerrar sesión y limpiar cookie', async () => {
      // Login primero
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'admin@cutzy.com',
        password: '123456',
      });

      const cookies = loginResponse.headers['set-cookie'];

      // Logout
      const logoutResponse = await request(app)
        .post('/auth/logout')
        .set('Cookie', cookies);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body).toHaveProperty('message');
    });

    test('debe retornar 400 sin refresh token', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(400);
    });
  });
});
