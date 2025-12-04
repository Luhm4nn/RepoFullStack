import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

describe('Debug Login', () => {
  test('debe poder hacer login con admin', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'admin@cutzy.com',
      password: '123456',
    });

    console.log('Status:', response.status);
    console.log('Body:', response.body);
    console.log('Headers:', response.headers);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
