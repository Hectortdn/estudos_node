import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const authenticateData = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute(authenticateData)

    const token = await reply.jwtSign({}, { sign: { sub: user.id } })

    return reply.status(201).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
