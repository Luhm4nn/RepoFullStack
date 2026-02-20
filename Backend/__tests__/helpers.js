import request from 'supertest';
import app from '../app.js';
import prisma from '../prisma/prisma.js';
import bcrypt from 'bcryptjs';

/**
 * Test helpers
 */

let adminToken = null;
let userToken = null;
let testUser = null;

/**
 * Obtiene un token de admin para testing
 * @returns {Promise<Array>} Cookies de autenticación de admin
 */
export const getAdminToken = async () => {
  if (adminToken) return adminToken;

  const adminEmail = 'admin_test@cutzy.com';
  const adminPassword = '123456';
  const adminDNI = 99999999;

  // Asegurar que el admin existe en la DB de test con la contraseña correcta
  const existingAdmin = await prisma.usuario.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.usuario.create({
      data: {
        DNI: adminDNI,
        nombreUsuario: 'Admin',
        apellidoUsuario: 'System',
        email: adminEmail,
        contrasena: hashedPassword,
        rol: 'ADMIN',
        telefono: '11111111',
      },
    });
  }

  // Hacer login para obtener cookies
  const response = await request(app).post('/api/auth/login').send({
    email: adminEmail,
    password: adminPassword,
  });

  if (response.status === 200) {
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      adminToken = cookies;
      return adminToken;
    }
  }

  console.error('ERROR EN LOGIN ADMIN TEST:', response.status, response.body);
  throw new Error('No se pudo obtener token de admin (Cookies).');
};

/**
 * Obtiene un token de usuario normal para testing
 * @returns {Promise<Array>} Cookies de autenticación de usuario
 */
export const getUserToken = async () => {
  if (userToken) return userToken;

  const dniRand = Math.floor(10000000 + Math.random() * 90000000)
    .toString()
    .slice(0, 8);
  const userData = {
    nombreUsuario: 'Test User',
    apellidoUsuario: 'Testing',
    DNI: dniRand,
    email: `test${Date.now()}@example.com`,
    contrasena: 'password123',
    telefono: '1234567890',
  };

  const createResponse = await request(app).post('/api/Usuario').send(userData);

  if (createResponse.status === 201) {
    testUser = createResponse.body;

    // Login con el usuario creado
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: userData.email,
      password: userData.contrasena,
    });

    if (loginResponse.status === 200) {
      const cookies = loginResponse.headers['set-cookie'];
      if (cookies) {
        userToken = cookies;
        return userToken;
      }
    }
  }

  throw new Error('No se pudo crear usuario de prueba');
};

/**
 * Limpia datos de prueba después de los tests
 */
export const cleanup = async () => {
  if (testUser && adminToken) {
    await request(app).delete(`/api/Usuario/${testUser.DNI}`).set('Cookie', adminToken);
  }

  adminToken = null;
  userToken = null;
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
