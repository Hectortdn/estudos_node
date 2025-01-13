import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyParams, GymRepository } from '../gym-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

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

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = this.gyms.filter((gym) => {
      const distanceBetween = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distanceBetween <= 10
    })

    return gyms
  }
}
