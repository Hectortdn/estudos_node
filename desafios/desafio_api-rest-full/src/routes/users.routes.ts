import { z } from "zod";
import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";

import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { email, name } = createUserBodySchema.parse(request.body);

    const userAlreadyExists = await knex("users").where("email", email).first();

    if (userAlreadyExists) {
      return reply.status(409).send({ message: "User already exists" });
    }

    const sessionId = randomUUID();

    reply.setCookie("sessionId", sessionId, {
      path: "./",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });

  app.get("/", async () => {
    const users = await knex("users").select();

    return { users };
  });
}
