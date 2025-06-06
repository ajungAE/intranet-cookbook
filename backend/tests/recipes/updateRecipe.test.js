// tests/recipes/updateRecipe.test.js
import request from 'supertest';
import { app } from '../../server.js';
import db from '../../config/db.js';
import bcrypt from 'bcryptjs';

let token;
let recipeId;
const testUser = {
  email: 'edituser@example.com',
  username: 'edituser',
  password: 'Passwort123!',
};

beforeAll(async () => {
  const conn = await db.getConnection();
  await conn.query('DELETE FROM user WHERE email = ?', [testUser.email]);
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await conn.query(
    'INSERT INTO user (email, username, password) VALUES (?, ?, ?)',
    [testUser.email, testUser.username, hashedPassword]
  );
  conn.end();

  const loginRes = await request(app).post('/auth/login').send({
    email: testUser.email,
    password: testUser.password,
  });
  token = loginRes.body.token;

  const createRes = await request(app)
    .post('/recipes')
    .set('Authorization', `Bearer ${token}`)
    .field('title', 'Ursprünglicher Titel')
    .field('ingredients', 'Ursprüngliche Zutaten')
    .field('instructions', 'Ursprüngliche Anleitung');

  recipeId = createRes.body.recipeId;
});

afterAll(async () => {
  const conn = await db.getConnection();
  await conn.query('DELETE FROM user WHERE email = ?', [testUser.email]);
  await conn.query('DELETE FROM recipe WHERE id = ?', [recipeId]);
  conn.end();
  await db.end();
});

describe('PUT /recipes/:id', () => {
  it('should update the recipe', async () => {
    const res = await request(app)
      .put(`/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Neuer Titel',
        ingredients: 'Neue Zutaten',
        instructions: 'Neue Anleitung',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch("Rezept erfolgreich aktualisiert");
  });

  it('should reject update without token', async () => {
    const res = await request(app)
      .put(`/recipes/${recipeId}`)
      .send({ title: 'No Auth Update' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBeDefined();
  });
});
