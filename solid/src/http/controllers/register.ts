import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists.error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const createUserData = createUserBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute(createUserData)

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
