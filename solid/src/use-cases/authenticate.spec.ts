import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials.error'
import { AuthenticateUseCase } from './authenticate'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authentication', async () => {
    const password_hash = await hash('user@123', 6)

    await userRepository.create({
      email: 'user@email.com',
      name: 'User Test',
      password_hash,
    })

    const { user } = await sut.execute({
      email: 'user@email.com',
      password: 'user@123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({ email: 'user@email.com', password: 'user@123' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const password_hash = await hash('user@123', 6)

    await userRepository.create({
      email: 'user@email.com',
      name: 'User Test',
      password_hash,
    })

    await expect(() =>
      sut.execute({ email: 'user@email.com', password: 'user@125' }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
