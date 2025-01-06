import request from "supertest";
import { execSync } from "child_process";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../app";

const createMealData = {
  isOnDiet: false,
  date: new Date(),
  name: "Refeição Teste",
  description: "Um almoço saudável com legumes.",
};

const getCookies = async () => {
  const userCreateResponse = await request(app.server)
    .post("/users")
    .send({ name: "Hector", email: "hector@email.com" })
    .expect(201);

  const cookies = userCreateResponse.get("Set-Cookie") || [];

  return cookies;
};

describe("Meals Routes", () => {
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

  it("should be able to create meal", async () => {
    const cookies = await getCookies();

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send(createMealData)
      .expect(201);
  });

  it("should be able to get list all meals", async () => {
    const cookies = await getCookies();

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send(createMealData);

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send(createMealData);

    const listMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200);

    expect(listMealsResponse.body.meals).toHaveLength(2);
  });

  it("should be able to  get a  specific meal", async () => {
    const cookies = await getCookies();

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send(createMealData);

    const listMeals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies);

    const mealId = listMeals.body.meals[0].id;

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(200);

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({ id: mealId })
    );
  });

  it("should be able to delete specific meal", async () => {
    const cookies = await getCookies();

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send(createMealData);

    const listMeals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies);

    const mealId = listMeals.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(204);
  });

  it("should be able to update specific meal", async () => {
    const cookies = await getCookies();

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send(createMealData);

    const listMeals = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies);

    const mealId = listMeals.body.meals[0].id;

    await request(app.server)
      .patch(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .send({
        isOnDiet: true,
        date: new Date(),
        name: "Refeição Teste Atualizada",
        description: "Um almoço saudável com legumes atualizada",
      })
      .expect(204);
  });

  it("should be able to get metrics", async () => {
    const cookies = await getCookies();

    await Promise.all([
      request(app.server).post("/meals").set("Cookie", cookies).send({
        isOnDiet: false,
        date: new Date(),
        name: "Refeição Teste 1",
        description: "Um almoço saudável com legumes.",
      }),
      request(app.server).post("/meals").set("Cookie", cookies).send({
        isOnDiet: true,
        date: new Date(),
        name: "Refeição Teste 2",
        description: "Um almoço saudável com legumes.",
      }),
      request(app.server).post("/meals").set("Cookie", cookies).send({
        isOnDiet: true,
        date: new Date(),
        name: "Refeição Teste 3",
        description: "Um almoço saudável com legumes.",
      }),
    ]);

    const mealMetrics = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", cookies)
      .expect(200);

    expect(mealMetrics.body).toEqual({
      totalMeals: 3,
      totalMealsOnDiet: 2,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 2,
    });
  });
});
