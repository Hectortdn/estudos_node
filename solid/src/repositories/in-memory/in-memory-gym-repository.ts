import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'

import { GymRepository } from '../gym-repository'

export class InMemoryGymRepository implements GymRepository {
  public gyms: Gym[] = []

  async findById(gymId: string) {
    const gym = this.gyms.find((gym) => gym.id === gymId)

    return gym ?? null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      title: data.title,
      id: data.id ?? randomUUID(),
      phone: data.phone ?? null,
      description: data.description ?? null,
      longitude: new Prisma.Decimal(data.longitude.toString()),
      latitude: new Prisma.Decimal(data.latitude.toString()),
    }

    this.gyms.push(gym)

    return gym
  }
}
