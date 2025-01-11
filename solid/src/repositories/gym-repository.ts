import { Gym } from '@prisma/client'

export interface GymRepository {
  findById: (gymId: string) => Promise<Gym | null>
}
