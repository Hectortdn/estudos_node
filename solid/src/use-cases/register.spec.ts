import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'

describe('Register User Case', () => {
  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
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
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'user01@email.com'

    await registerUseCase.execute({
      email,
      name: 'user1',
      password: 'user@123',
    })

    await expect(() =>
      registerUseCase.execute({
        email,
        name: 'user1',
        password: 'user@123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should to register user', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUserCase = new RegisterUseCase(userRepository)

    const { user } = await registerUserCase.execute({
      name: 'user',
      email: 'user@email.com',
      password: 'user@123',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
