import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { getAdminToken } from './helpers.js';

describe('Peliculas API', () => {
  let adminToken;

  beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  describe('GET /Peliculas', () => {
    test('debe retornar lista de películas', async () => {
      const response = await request(app).get('/Peliculas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /Peliculas/search', () => {
    test('debe buscar por nombrePelicula con query param q', async () => {
      const response = await request(app).get('/Peliculas/search').query({
        q: 'john',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach((pelicula) => {
          expect(pelicula.nombrePelicula.toLowerCase()).toContain('john');
        });
      }
    });

    test('debe ser case-insensitive en la búsqueda', async () => {
      const responseLower = await request(app).get('/Peliculas/search').query({
        q: 'john',
      });
      
      const responseUpper = await request(app).get('/Peliculas/search').query({
        q: 'JOHN',
      });
      
      const responseMixed = await request(app).get('/Peliculas/search').query({
        q: 'JoHn',
      });

      expect(responseLower.status).toBe(200);
      expect(responseUpper.status).toBe(200);
      expect(responseMixed.status).toBe(200);
      
      expect(responseLower.body).toEqual(responseUpper.body);
      expect(responseLower.body).toEqual(responseMixed.body);
    });

    test('debe retornar array vacío si no hay coincidencias', async () => {
      const response = await request(app).get('/Peliculas/search').query({
        q: 'xyzabc123nonexistent',
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    test('debe limitar resultados con limit param', async () => {
      const response = await request(app).get('/Peliculas/search').query({
        q: '',
        limit: 3,
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(3);
    });

    test('debe buscar películas parcialmente por nombre', async () => {
      const allPeliculas = await request(app).get('/Peliculas');
      
      if (allPeliculas.body.length > 0) {
        const searchTerm = allPeliculas.body[0].nombrePelicula.slice(0, 3);
        
        const response = await request(app).get('/Peliculas/search').query({
          q: searchTerm,
        });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        
        if (response.body.length > 0) {
          response.body.forEach((pelicula) => {
            expect(
              pelicula.nombrePelicula.toLowerCase()
            ).toContain(searchTerm.toLowerCase());
          });
        }
      }
    });
  });

  describe('GET /Pelicula/:id', () => {
    test('debe retornar película por ID', async () => {
      const allPeliculas = await request(app).get('/Peliculas');
      
      if (allPeliculas.body.length > 0) {
        const idPelicula = allPeliculas.body[0].idPelicula;
        
        const response = await request(app).get(`/Pelicula/${idPelicula}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('idPelicula', idPelicula);
        expect(response.body).toHaveProperty('nombrePelicula');
      }
    });

    test('debe retornar 404 para ID inexistente', async () => {
      const response = await request(app).get('/Pelicula/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /Pelicula', () => {
    test('debe requerir autenticación de admin', async () => {
      const response = await request(app).post('/Pelicula').send({
        nombrePelicula: 'Película Test',
        duracion: 120,
      });

      expect(response.status).toBe(401);
    });

    test('debe validar campos requeridos', async () => {
      const response = await request(app)
        .post('/Pelicula')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombrePelicula: 'Película Incompleta',
        });

      expect(response.status).toBe(400);
    });
  });
});
