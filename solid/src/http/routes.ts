import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { verifyJwt } from './middlewares/verify-jwt'
import { Profile } from './controllers/profile'

export function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/session', authenticate)

  app.get('/me', { onRequest: [verifyJwt] }, Profile)
}
