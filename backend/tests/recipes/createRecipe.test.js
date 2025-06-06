// tests/recipes/createRecipe.test.js
import request from "supertest";
import { app } from "../../server.js";
import db from "../../config/db.js";
import bcrypt from "bcryptjs";

let token;
const testUser = {
  email: "creator@example.com",
  username: "creatoruser",
  password: "Sicher123!",
};

// Login, um Token zu bekommen
async function loginAndGetToken() {
  const res = await request(app).post("/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });

  console.log("Login-Status:", res.statusCode);
  console.log("Login-Body:", res.body);

  if (!res.body.token) {
    throw new Error(`Login failed: ${res.statusCode} - ${JSON.stringify(res.body)}`);
  }

  return res.body.token;
}

beforeAll(async () => {
  const conn = await db.getConnection();
  await conn.query("DELETE FROM user WHERE email = ?", [testUser.email]);

  const hashedPassword = await bcrypt.hash(testUser.password, 10);
  await conn.query(
    "INSERT INTO user (email, username, password) VALUES (?, ?, ?)",
    [testUser.email, testUser.username, hashedPassword]
  );
  conn.end();

  token = await loginAndGetToken();
  console.log("Token:", token);
});

afterAll(async () => {
  const conn = await db.getConnection();
  await conn.query("DELETE FROM user WHERE email = ?", [testUser.email]);
  await conn.query("DELETE FROM recipe WHERE title = ?", ["Testrezept"]);
  conn.end();

  // WICHTIG: Pool schließen, um offene TCP-Handles zu vermeiden
  await db.end();
});

describe("POST /recipes", () => {
  it("should create a new recipe", async () => {
    const res = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Testrezept")
      .field("ingredients", "Zutatenliste")
      .field("instructions", "Anleitung");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("recipeId");
  });

  it("should fail if fields are missing", async () => {
    const res = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});
