import { Gym } from '@prisma/client'
import { GymRepository } from '../gym-repository'

export class InMemoryGymRepository implements GymRepository {
  public gyms: Gym[] = []

  async findById(gymId: string) {
    const gym = this.gyms.find((gym) => gym.id === gymId)

    return gym ?? null
  }
}
