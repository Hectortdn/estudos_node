import fastify from 'fastify'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'

import { appRoutes } from './http/routes'
import { env } from './env'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_AUTH_SECRET,
})

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send('Internal server error.')
})
