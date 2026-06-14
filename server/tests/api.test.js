import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.DATABASE_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../data/test.db"
);

if (fs.existsSync(process.env.DATABASE_PATH)) {
  fs.unlinkSync(process.env.DATABASE_PATH);
}

const { default: app } = await import("../src/server.js");

test("GET /api/health returns service status", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(response.body.service, "WellTrack API");
});

test("POST /api/auth/register and login flow works", async () => {
  const email = `user-${Date.now()}@example.com`;
  const registerResponse = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email,
    password: "password123",
  });

  assert.equal(registerResponse.status, 201);
  assert.equal(registerResponse.body.user.email, email);

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password: "password123",
  });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.token);
  assert.equal(loginResponse.body.user.email, email);
});
