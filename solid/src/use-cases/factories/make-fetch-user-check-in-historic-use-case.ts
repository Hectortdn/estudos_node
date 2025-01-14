import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in.repository'
import { FetchUserCheckInHistoricUserCase } from '../fetch-user-check-in-historic'

export function makeFetchUserCheckInHistoricUseCase() {
  const checkInRepository = new PrismaCheckInRepository()
  const useCase = new FetchUserCheckInHistoricUserCase(checkInRepository)

  return useCase
}
