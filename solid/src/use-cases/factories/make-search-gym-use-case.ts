import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym.repository'
import { SearchGymUseCase } from '../search-gym'

export function makeCheckInUseCase() {
  const gymRepository = new PrismaGymRepository()
  const useCase = new SearchGymUseCase(gymRepository)

  return useCase
}
