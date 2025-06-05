// tests/auth/register.test.js
import request from 'supertest';
import { app } from '../../server.js';
import db from '../../config/db.js';

const testUser = {
  email: 'registeruser@example.com',
  username: 'registeruser',
  password: 'TestPassword123!'
};

describe('POST /auth/register', () => {
  // Vor jedem Test: Benutzer ggf. löschen
  beforeAll(async () => {
    const conn = await db.getConnection();
    await conn.query('DELETE FROM user WHERE email = ?', [testUser.email]);
    conn.end();
  });

  // Nach allen Tests: Benutzer wieder entfernen
  afterAll(async () => {
    const conn = await db.getConnection();
    await conn.query('DELETE FROM user WHERE email = ?', [testUser.email]);
    conn.end();
  });

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/auth/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should reject duplicate registration', async () => {
    const res = await request(app).post('/auth/register').send(testUser);

    expect(res.statusCode).toBe(409); // 409 = Conflict
    expect(res.body.message).toBeDefined();
  });

  it('should fail with missing fields', async () => {
    const res = await request(app).post('/auth/register').send({
      email: '',
      password: ''
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});
