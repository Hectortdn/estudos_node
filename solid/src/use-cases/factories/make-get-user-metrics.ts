import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-in.repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const checkInRepository = new PrismaCheckInRepository()
  const useCase = new GetUserMetricsUseCase(checkInRepository)

  return useCase
}
