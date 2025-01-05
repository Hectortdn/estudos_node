import { Knex, knex as setupKnex } from 'knex'
import { env } from '../env'

const databaseConnection =
  env.DATABASE_CLIENT === 'pg'
    ? env.DATABASE_URL
    : { filename: env.DATABASE_URL }

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: databaseConnection,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
