// tests/auth/login.test.js
import request from 'supertest';
import { app } from '../../server.js';
import db from '../../config/db.js';
import bcrypt from 'bcryptjs';

const testUser = {
  email: 'loginuser@example.com',
  username: 'loginuser',
  password: 'Sicher123!'
};

describe('POST /auth/login', () => {
  // Vor dem Test: Testnutzer erstellen
  beforeAll(async () => {
    const conn = await db.getConnection();

    // Vorherige Einträge löschen
    await conn.query('DELETE FROM user WHERE email = ?', [testUser.email]);

    // Passwort hashen und neuen User anlegen
    const hashedPassword = bcrypt.hashSync(testUser.password, 10);
    await conn.query(
      'INSERT INTO user (email, username, password) VALUES (?, ?, ?)',
      [testUser.email, testUser.username, hashedPassword]
    );

    conn.end();
  });

  // Nach dem Test: Cleanup
  afterAll(async () => {
    const conn = await db.getConnection();
    await conn.query('DELETE FROM user WHERE email = ?', [testUser.email]);
    conn.end();
  });

  it('should return a valid token for correct credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail with incorrect password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  it('should fail with missing email', async () => {
    const res = await request(app).post('/auth/login').send({
      password: testUser.password
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});
