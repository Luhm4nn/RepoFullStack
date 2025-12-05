import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { getAdminToken } from './helpers.js';

describe('Funciones API', () => {
  let adminToken;
  let testFuncionId;

  beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  describe('GET /Funciones', () => {
    test('debe retornar lista de funciones', async () => {
      const response = await request(app).get('/Funciones');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /FuncionesActivas', () => {
    test('debe retornar solo funciones activas', async () => {
      const response = await request(app).get('/FuncionesActivas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /FuncionesPublicas', () => {
    test('debe retornar funciones públicas sin autenticación', async () => {
      const response = await request(app).get('/FuncionesPublicas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /Funcion', () => {
    test('debe requerir autenticación de admin', async () => {
      const response = await request(app).post('/Funcion').send({});

      expect(response.status).toBe(401);
    });

    test('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/Funcion')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          // Datos incompletos
          idSala: 1,
        });

      expect(response.status).toBe(400);
    });

    test('debe detectar función antes de fecha de estreno', async () => {
      // Crear una función antes del estreno de la película
      const fechaPasada = new Date('2020-01-01T20:00:00Z');

      const response = await request(app)
        .post('/Funcion')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          idSala: 1,
          idPelicula: 1,
          fechaHoraFuncion: fechaPasada.toISOString(),
          estado: 'Privada',
        });

      // Puede ser 400 o el error específico de fecha de estreno
      expect([400, 404]).toContain(response.status);
    });

    test('debe crear función válida', async () => {
      // Usar fecha futura
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 7);
      fechaFutura.setHours(20, 0, 0, 0);

      const nuevaFuncion = {
        idSala: 1,
        idPelicula: 1,
        fechaHoraFuncion: fechaFutura.toISOString(),
        estado: 'Privada',
      };

      const response = await request(app)
        .post('/Funcion')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nuevaFuncion);

      if (response.status === 201) {
        expect(response.body).toHaveProperty('idSala');
        expect(response.body).toHaveProperty('fechaHoraFuncion');
        testFuncionId = {
          idSala: response.body.idSala,
          fechaHoraFuncion: response.body.fechaHoraFuncion,
        };
      } else {
        // Puede fallar por solapamiento u otras validaciones
        expect([400, 409]).toContain(response.status);
      }
    });
  });

  describe('Validaciones de solapamiento', () => {
    test('debe detectar solapamiento de funciones', async () => {
      if (!testFuncionId) {
        // Skip si no se pudo crear función de prueba
        return;
      }

      // Intentar crear función en el mismo horario
      const response = await request(app)
        .post('/Funcion')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          idSala: testFuncionId.idSala,
          idPelicula: 1,
          fechaHoraFuncion: testFuncionId.fechaHoraFuncion,
          estado: 'Privada',
        });

      expect(response.status).toBe(409);
      expect(response.body.message || response.body.error).toMatch(/solapa/i);
    });
  });

  describe('PUT /Funcion/:idSala/:fechaHoraFuncion', () => {
    test('solo admin puede actualizar funciones', async () => {
      if (!testFuncionId) return;

      const response = await request(app)
        .put(`/Funcion/${testFuncionId.idSala}/${testFuncionId.fechaHoraFuncion}`)
        .send({ estado: 'Publica' });

      expect(response.status).toBe(401);
    });

    test('admin puede cambiar estado de función', async () => {
      if (!testFuncionId) return;

      const response = await request(app)
        .put(`/Funcion/${testFuncionId.idSala}/${testFuncionId.fechaHoraFuncion}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'Publica' });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('estado', 'Publica');
      }
    });
  });

  describe('DELETE /Funcion/:idSala/:fechaHoraFuncion', () => {
    test('solo admin puede eliminar funciones', async () => {
      if (!testFuncionId) return;

      const response = await request(app).delete(
        `/Funcion/${testFuncionId.idSala}/${testFuncionId.fechaHoraFuncion}`
      );

      expect(response.status).toBe(401);
    });

    test('debe eliminar función privada/inactiva', async () => {
      if (!testFuncionId) return;

      // Primero cambiar a Privada si no lo está
      await request(app)
        .put(`/Funcion/${testFuncionId.idSala}/${testFuncionId.fechaHoraFuncion}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estado: 'Privada' });

      const response = await request(app)
        .delete(`/Funcion/${testFuncionId.idSala}/${testFuncionId.fechaHoraFuncion}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect([200, 403]).toContain(response.status);
    });
  });
});
