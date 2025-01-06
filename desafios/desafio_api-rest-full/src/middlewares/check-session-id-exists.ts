import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../database";

export async function checkSessionIdExists(
  request: FastifyRequest,
  replay: FastifyReply
) {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    return replay.status(401).send({ message: "unauthorized" });
  }

  const user = await knex("users").where("session_id", sessionId).first();

  if (!user) {
    return replay.status(401).send({ message: "unauthorized user" });
  }

  request.user = user;
}
