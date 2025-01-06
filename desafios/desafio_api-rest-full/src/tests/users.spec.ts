import request from "supertest";
import { execSync } from "node:child_process";
import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";

import { app } from "../app";

describe("Users Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create new user", async () => {
    const createUserBody = { name: "Hector", email: "hector@email.com" };

    await request(app.server).post("/users").send(createUserBody).expect(201);
  });
});
