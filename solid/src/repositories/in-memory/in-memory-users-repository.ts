import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      create_at: new Date(),
      password_hash: data.password_hash,
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    const _user = this.users.find((user) => user.email === email)

    return _user ?? null
  }

  async findById(id: string) {
    const _user = this.users.find((user) => user.id === id)

    return _user ?? null
  }
}
