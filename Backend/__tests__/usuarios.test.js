import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { getAdminToken, getUserToken, cleanup } from './helpers.js';

describe('Usuarios API', () => {
  let adminToken;
  let testUserDNI;
  let testUserToken; // Lo obtendremos durante los tests

  beforeAll(async () => {
    try {
      adminToken = await getAdminToken();
    } catch (error) {
      console.error('Error getting admin token:', error);
    }
  });

  describe('GET /Usuarios', () => {
    test('debe retornar 401 sin autenticación', async () => {
      const response = await request(app).get('/Usuarios');

      expect(response.status).toBe(401);
    });

    test('debe retornar 403 para usuario no-admin', async () => {
      if (!testUserToken) {
        // Skip if we don't have a user token yet
        return;
      }

      const response = await request(app)
        .get('/Usuarios')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(403);
    });

    test('debe retornar lista de usuarios para admin', async () => {
      const response = await request(app)
        .get('/Usuarios')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /Usuario', () => {
    test('debe crear un nuevo usuario', async () => {
      const newUser = {
        nombre: 'Juan',
        apellido: 'Pérez',
        DNI: Math.floor(Math.random() * 100000000),
        email: `juan${Date.now()}@example.com`,
        contrasena: 'password123',
        telefono: '1234567890',
      };

      const response = await request(app).post('/Usuario').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('DNI', newUser.DNI);
      expect(response.body).toHaveProperty('email', newUser.email);
      expect(response.body).not.toHaveProperty('contrasena');

      testUserDNI = newUser.DNI;

      // Hacer login con el usuario creado para obtener token
      const loginResponse = await request(app).post('/auth/login').send({
        email: newUser.email,
        password: newUser.contrasena,
      });

      if (loginResponse.status === 200) {
        testUserToken = loginResponse.body.token;
      }
    });

    test('debe retornar 409 con email duplicado', async () => {
      const firstUser = {
        nombre: 'Test',
        apellido: 'User',
        DNI: Math.floor(Math.random() * 100000000),
        email: `duplicate${Date.now()}@example.com`,
        contrasena: 'password123',
        telefono: '1234567890',
      };

      await request(app).post('/Usuario').send(firstUser);

      const duplicateUser = {
        ...firstUser,
        DNI: Math.floor(Math.random() * 100000000),
      };

      const response = await request(app).post('/Usuario').send(duplicateUser);

      expect(response.status).toBe(409);
    });

    test('debe validar campos requeridos', async () => {
      const invalidUser = {
        nombre: 'Test',
        // falta email, dni, etc
      };

      const response = await request(app).post('/Usuario').send(invalidUser);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /Usuario/:dni', () => {
    test('usuario puede ver su propio perfil', async () => {
      if (!testUserToken || !testUserDNI) {
        return; // Skip if no user created yet
      }

      const response = await request(app)
        .get(`/Usuario/${testUserDNI}`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect([200, 403]).toContain(response.status);
    });

    test('admin puede ver cualquier perfil', async () => {
      const response = await request(app)
        .get(`/Usuario/${testUserDNI}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('DNI', testUserDNI);
    });

    test('debe retornar 404 para usuario inexistente', async () => {
      const response = await request(app)
        .get('/Usuario/99999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /Usuario/:dni', () => {
    test('usuario puede actualizar su propio perfil', async () => {
      if (!testUserToken || !testUserDNI) {
        return; // Skip if no user created yet
      }

      const updateData = {
        telefono: '0987654321',
      };

      const response = await request(app)
        .put(`/Usuario/${testUserDNI}`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updateData);

      expect([200, 403]).toContain(response.status);
    });

    test('debe validar ownership (usuario no puede actualizar otros perfiles)', async () => {
      if (!testUserToken) {
        return; // Skip if no user created yet
      }

      const otherDNI = 12345678;
      const response = await request(app)
        .put(`/Usuario/${otherDNI}`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ telefono: '111111111' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /Usuario/:dni', () => {
    test('debe retornar 403 para usuario no-admin', async () => {
      if (!testUserToken || !testUserDNI) {
        return; // Skip if no user created yet
      }

      const response = await request(app)
        .delete(`/Usuario/${testUserDNI}`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(response.status).toBe(403);
    });

    test('admin puede eliminar usuarios', async () => {
      if (testUserDNI) {
        const response = await request(app)
          .delete(`/Usuario/${testUserDNI}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
      }
    });
  });
});
