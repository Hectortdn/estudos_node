import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in.repository'
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym.repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const checkInRepository = new PrismaCheckInRepository()
  const gymRepository = new PrismaGymRepository()
  const useCase = new CheckInUseCase(checkInRepository, gymRepository)

  return useCase
}
