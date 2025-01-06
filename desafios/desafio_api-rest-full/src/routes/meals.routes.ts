import { z } from "zod";
import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";

import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { knex } from "../database";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", checkSessionIdExists);

  app.post("/", async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
      description: z.string(),
    });

    const { date, description, isOnDiet, name } = createMealsBodySchema.parse(
      request.body
    );

    await knex("meals").insert({
      date,
      name,
      description,
      id: randomUUID(),
      is_on_diet: isOnDiet,
      user_id: request.user?.id,
    });

    return reply.status(201).send();
  });

  app.get("/", async (request) => {
    const user = request.user;

    const meals = await knex("meals").where("user_id", user?.id).select('*')

    return { meals };
  });

  app.get("/:id", async (request, reply) => {
    const user = request.user;

    const getMealParamsSchema = z.object({ id: z.string().uuid() });

    const { id } = getMealParamsSchema.parse(request.params);

    const meal = await knex("meals").where({ user_id: user?.id, id }).first();

    if (!meal) {
      return reply.status(404).send({ error: "Meal not found" });
    }

    return { meal };
  });

  app.delete("/:id", async (request, reply) => {
    const user = request.user;

    const deleteParamsSchema = z.object({ id: z.string().uuid() });

    const { id } = deleteParamsSchema.parse(request.params);

    const meal = await knex("meals").where({ user_id: user?.id, id }).first();

    if (!meal) {
      return reply.status(404).send({ error: "Meal not found" });
    }

    await knex("meals").where("id", id).delete();

    return reply.status(204).send();
  });

  app.patch("/:id", async (request, reply) => {
    const updateParamsSchema = z.object({ id: z.string().uuid() });

    const updateBodySchema = z.object({
      name: z.string().optional(),
      date: z.coerce.date().optional(),
      isOnDiet: z.boolean().optional(),
      description: z.string().optional(),
    });

    const { date, description, isOnDiet, name } = updateBodySchema.parse(
      request.body
    );

    const { id } = updateParamsSchema.parse(request.params);

    const user = request.user;
    const meal = await knex("meals").where({ user_id: user?.id, id }).first();

    if (!meal) {
      return reply.status(404).send({ error: "Meal not found" });
    }

    await knex("meals").where("id", id).update({
      date,
      name,
      description,
      is_on_diet: isOnDiet,
    });

    return reply.status(204).send();
  });

  app.get("/metrics", async (request) => {
    const user = request.user;

    const meals = await knex("meals")
      .where({ user_id: user?.id })
      .orderBy("created_at");

    let totalMealsOnDiet = 0;
    let totalMealsOffDiet = 0;
    let bestOnDietSequence = 0;
    const totalMeals = meals.length;

    let currentSequence = 0;
    meals.forEach((meal) => {
      if (meal.is_on_diet) {
        totalMealsOnDiet++;
        currentSequence++;
      } else {
        totalMealsOffDiet++;
        currentSequence = 0;
      }

      if (currentSequence > bestOnDietSequence) {
        bestOnDietSequence = currentSequence;
      }
    });

    return {
      totalMeals,
      totalMealsOnDiet,
      totalMealsOffDiet,
      bestOnDietSequence,
    };
  });
}
