// tests/recipes/deleteRecipe.test.js
import request from "supertest";
import { app } from "../../server.js";
import db from "../../config/db.js";
import bcrypt from "bcryptjs";

let token;
let recipeId;
const testUser = {
  email: "deleteuser@example.com",
  username: "deleteuser",
  password: "Sicher123!",
};

beforeAll(async () => {
  const conn = await db.getConnection();
  await conn.query("DELETE FROM user WHERE email = ?", [testUser.email]);
  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await conn.query(
    "INSERT INTO user (email, username, password) VALUES (?, ?, ?)",
    [testUser.email, testUser.username, hashedPassword]
  );
  conn.end();

  const loginRes = await request(app).post("/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });
  token = loginRes.body.token;

  const createRes = await request(app)
    .post("/recipes")
    .set("Authorization", `Bearer ${token}`)
    .field("title", "Löschbares Rezept")
    .field("ingredients", "Zutaten")
    .field("instructions", "Anleitung");

  recipeId = createRes.body.recipeId;
});

afterAll(async () => {
  const conn = await db.getConnection();
  await conn.query("DELETE FROM user WHERE email = ?", [testUser.email]);
  conn.end();
  await db.end();
});

describe("DELETE /recipes/:id", () => {
  it("should delete the recipe", async () => {
    const res = await request(app)
      .delete(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it("should reject deletion without token", async () => {
    const res = await request(app).delete(`/recipes/${recipeId}`);
    expect(res.statusCode).toBe(401);
  });

  it("should return 404 if recipe was already deleted", async () => {
    const res = await request(app)
      .delete(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
