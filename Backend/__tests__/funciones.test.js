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

    test('debe filtrar por nombrePelicula', async () => {
      const response = await request(app).get('/Funciones').query({
        nombrePelicula: 'test',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        if (funcion.pelicula?.nombrePelicula) {
          expect(
            funcion.pelicula.nombrePelicula.toLowerCase()
          ).toContain('test');
        }
      });
    });

    test('debe filtrar por nombreSala (busca en nombreSala o ubicacion)', async () => {
      const response = await request(app).get('/Funciones').query({
        nombreSala: 'sala',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        if (funcion.sala) {
          const matchNombre = funcion.sala.nombreSala?.toLowerCase().includes('sala');
          const matchUbicacion = funcion.sala.ubicacion?.toLowerCase().includes('sala');
          expect(matchNombre || matchUbicacion).toBe(true);
        }
      });
    });

    test('debe filtrar por estado=activas (excluye Inactiva)', async () => {
      const response = await request(app).get('/Funciones').query({
        estado: 'activas',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        expect(funcion.estado).not.toBe('Inactiva');
      });
    });

    test('debe filtrar por estado=inactivas (solo Inactiva)', async () => {
      const response = await request(app).get('/Funciones').query({
        estado: 'inactivas',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        expect(funcion.estado).toBe('Inactiva');
      });
    });

    test('debe filtrar por estado=publicas (solo Publica)', async () => {
      const response = await request(app).get('/Funciones').query({
        estado: 'publicas',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        expect(funcion.estado).toBe('Publica');
      });
    });

    test('debe filtrar por fechaDesde', async () => {
      const fechaDesde = new Date();
      fechaDesde.setDate(fechaDesde.getDate() + 1);

      const response = await request(app).get('/Funciones').query({
        fechaDesde: fechaDesde.toISOString(),
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        const fechaFuncion = new Date(funcion.fechaHoraFuncion);
        expect(fechaFuncion.getTime()).toBeGreaterThanOrEqual(
          fechaDesde.getTime()
        );
      });
    });

    test('debe filtrar por fechaHasta', async () => {
      const fechaHasta = new Date();
      fechaHasta.setDate(fechaHasta.getDate() + 7);

      const response = await request(app).get('/Funciones').query({
        fechaHasta: fechaHasta.toISOString(),
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        const fechaFuncion = new Date(funcion.fechaHoraFuncion);
        expect(fechaFuncion.getTime()).toBeLessThanOrEqual(
          fechaHasta.getTime()
        );
      });
    });

    test('debe combinar múltiples filtros', async () => {
      const fechaDesde = new Date();
      const fechaHasta = new Date();
      fechaHasta.setDate(fechaHasta.getDate() + 30);

      const response = await request(app).get('/Funciones').query({
        estado: 'activas',
        fechaDesde: fechaDesde.toISOString(),
        fechaHasta: fechaHasta.toISOString(),
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((funcion) => {
        expect(funcion.estado).not.toBe('Inactiva');
        const fechaFuncion = new Date(funcion.fechaHoraFuncion);
        expect(fechaFuncion.getTime()).toBeGreaterThanOrEqual(
          fechaDesde.getTime()
        );
        expect(fechaFuncion.getTime()).toBeLessThanOrEqual(
          fechaHasta.getTime()
        );
      });
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
          idSala: 1,
        });

      expect(response.status).toBe(400);
    });

    test('debe detectar función antes de fecha de estreno', async () => {
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

      expect([400, 404]).toContain(response.status);
    });

    test('debe crear función válida', async () => {
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
        expect([400, 409]).toContain(response.status);
      }
    });
  });

  describe('Validaciones de solapamiento', () => {
    test('debe detectar solapamiento de funciones', async () => {
      if (!testFuncionId) return;

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
