import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'
import { RegisterUseCase } from './register'

let userRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register User Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'user1',
      password: 'user@123',
      email: 'user01@email.com',
    })

    const isPasswordCorrectlyHashed = await compare(
      'user@123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'user01@email.com'

    await sut.execute({
      email,
      name: 'user1',
      password: 'user@123',
    })

    await expect(() =>
      sut.execute({
        email,
        name: 'user1',
        password: 'user@123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should to register user', async () => {
    const { user } = await sut.execute({
      name: 'user',
      email: 'user@email.com',
      password: 'user@123',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
