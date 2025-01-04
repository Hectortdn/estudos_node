import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'
import { env } from '../env'

const app = fastify()

app.post('/transactions/create', async (req) => {
  const { title, amount } = req.body

  await knex('transactions')
    .insert({
      id: randomUUID(),
      title,
      amount,
    })
    .returning('*')
})

app.get('/transactions', async () => {
  const transactions = await knex('transactions').select('*')

  return transactions
})

app.get('/transactions/:id', async (req) => {
  const { id } = req.params
  const transaction = await knex('transactions').where('id', id).select('*')

  return transaction
})

app.listen({
  port: env.PORT,
})
