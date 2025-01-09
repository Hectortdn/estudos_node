import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user.repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists.error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const createUserData = createUserBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    registerUseCase.execute(createUserData)
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  reply.status(201).send()
}
