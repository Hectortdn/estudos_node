import { Knex, knex as setupKnex } from "knex";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db'
  }
};

export const knex = setupKnex(config);
