import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { getAdminToken } from './helpers.js';

describe('Salas API', () => {
  let adminToken;

  beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  describe('GET /Salas', () => {
    test('debe retornar lista de salas', async () => {
      const response = await request(app).get('/Salas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /Salas/search', () => {
    test('debe buscar por nombreSala', async () => {
      const response = await request(app).get('/Salas/search').query({
        q: 'sala',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach((sala) => {
          const matchNombre = sala.nombreSala?.toLowerCase().includes('sala');
          const matchUbicacion = sala.ubicacion?.toLowerCase().includes('sala');
          expect(matchNombre || matchUbicacion).toBe(true);
        });
      }
    });

    test('debe buscar por ubicacion (OR con nombreSala)', async () => {
      const allSalas = await request(app).get('/Salas');
      
      if (allSalas.body.length > 0 && allSalas.body[0].ubicacion) {
        const searchTerm = allSalas.body[0].ubicacion.slice(0, 3);
        
        const response = await request(app).get('/Salas/search').query({
          q: searchTerm,
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        
        if (response.body.length > 0) {
          response.body.forEach((sala) => {
            const matchNombre = sala.nombreSala?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchUbicacion = sala.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase());
            expect(matchNombre || matchUbicacion).toBe(true);
          });
        }
      }
    });

    test('debe retornar array vacío si no hay coincidencias', async () => {
      const response = await request(app).get('/Salas/search').query({
        q: 'xyzabc123nonexistent',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('debe ser case-insensitive en la búsqueda', async () => {
      const responseLower = await request(app).get('/Salas/search').query({
        q: 'sala',
      });
      
      const responseUpper = await request(app).get('/Salas/search').query({
        q: 'SALA',
      });
      
      const responseMixed = await request(app).get('/Salas/search').query({
        q: 'SaLa',
      });

      expect(responseLower.status).toBe(200);
      expect(responseUpper.status).toBe(200);
      expect(responseMixed.status).toBe(200);
      
      expect(responseLower.body).toEqual(responseUpper.body);
      expect(responseLower.body).toEqual(responseMixed.body);
    });

    test('debe limitar resultados con limit param', async () => {
      const response = await request(app).get('/Salas/search').query({
        q: '',
        limit: 2,
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });
  });

  describe('POST /Sala', () => {
    test('debe requerir autenticación de admin', async () => {
      const response = await request(app).post('/Sala').send({
        nombreSala: 'Sala Test',
        ubicacion: 'Ubicación Test',
        capacidad: 50,
      });

      expect(response.status).toBe(401);
    });

    test('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/Sala')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombreSala: 'Sala Incompleta',
        });

      expect(response.status).toBe(400);
    });
  });
});
