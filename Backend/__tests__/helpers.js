import request from 'supertest';
import app from '../app.js';

/**
 * Test helpers
 */

let adminToken = null;
let userToken = null;
let testUser = null;

/**
 * Obtiene un token de admin para testing
 * @returns {Promise<string>} Token de autenticación de admin
 */
export const getAdminToken = async () => {
  if (adminToken) return adminToken;

  // Asumiendo que existe un usuario admin en la BD
  const response = await request(app).post('/auth/login').send({
    email: 'admin@cutzy.com',
    password: '123456',
  });

  if (response.status === 200) {
    adminToken = response.body.token;
    return adminToken;
  }

  throw new Error('No se pudo obtener token de admin. Asegúrate de tener un usuario admin en la BD.');
};

/**
 * Obtiene un token de usuario normal para testing
 * @returns {Promise<string>} Token de autenticación de usuario
 */
export const getUserToken = async () => {
  if (userToken) return userToken;

  // Crear un usuario de prueba
  const userData = {
    nombre: 'Test User',
    apellido: 'Testing',
    DNI: Math.floor(Math.random() * 100000000),
    email: `test${Date.now()}@example.com`,
    contrasena: 'password123',
    telefono: '1234567890',
  };

  const createResponse = await request(app).post('/Usuario').send(userData);

  if (createResponse.status === 201) {
    testUser = createResponse.body;

    // Login con el usuario creado
    const loginResponse = await request(app).post('/auth/login').send({
      email: userData.email,
      password: userData.contrasena,
    });

    if (loginResponse.status === 200) {
      userToken = loginResponse.body.token;
      return userToken;
    }
  }

  throw new Error('No se pudo crear usuario de prueba');
};

/**
 * Limpia datos de prueba después de los tests
 */
export const cleanup = async () => {
  adminToken = null;
  userToken = null;

  // Aquí puedes agregar lógica para limpiar la BD de test
  // Por ejemplo, eliminar el usuario de prueba creado
  if (testUser && adminToken) {
    await request(app)
      .delete(`/Usuario/${testUser.DNI}`)
      .set('Authorization', `Bearer ${adminToken}`);
  }

  testUser = null;
};

/**
 * Crea headers con autenticación
 * @param {string} token - Token de autenticación
 * @returns {Object} Headers con Authorization
 */
export const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export default {
  getAdminToken,
  getUserToken,
  cleanup,
  authHeaders,
};
