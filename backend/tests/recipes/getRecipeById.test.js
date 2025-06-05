// tests/recipes/getRecipeById.test.js
import request from 'supertest';
import { app } from '../../server.js';

describe('GET /recipes/:id', () => {
  let recipeId;

  beforeAll(async () => {
    // Hole alle Rezepte, um eine gültige ID zu testen
    const res = await request(app).get('/recipes');
    if (res.body.length > 0) {
      recipeId = res.body[0].id;
    }
  });

  it('should return a recipe with the given ID', async () => {
    if (!recipeId) {
      return console.warn('No recipes available for testing.');
    }

    const res = await request(app).get(`/recipes/${recipeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', recipeId);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('ingredients');
    expect(res.body).toHaveProperty('instructions');
  });

  it('should return 404 for non-existing recipe ID', async () => {
    const res = await request(app).get('/recipes/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBeDefined();
  });
});
