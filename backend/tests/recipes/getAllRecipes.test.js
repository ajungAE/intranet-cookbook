// tests/recipes/getAllRecipes.test.js
import request from 'supertest';
import { app } from '../../server.js';

describe('GET /recipes', () => {
  // Test: Sollte ein Array mit Rezepten zurückgeben
  it('should return an array of recipes', async () => {
    const res = await request(app).get('/recipes');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: Jedes Rezept sollte erwartete Eigenschaften enthalten
  it('each recipe should contain expected properties', async () => {
    const res = await request(app).get('/recipes');

    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      const recipe = res.body[0];
      expect(recipe).toHaveProperty('id');
      expect(recipe).toHaveProperty('title');
      expect(recipe).toHaveProperty('ingredients');
      expect(recipe).toHaveProperty('instructions');
      expect(recipe).toHaveProperty('categories'); // Array of strings
    }
  });
});
