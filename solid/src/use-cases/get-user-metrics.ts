import { CheckInRepository } from '@/repositories/check-in-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

export class GetUserMetricsUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({ userId }: GetUserMetricsUseCaseRequest) {
    const checkInCount = await this.checkInRepository.countByUserId(userId)

    return { checkInCount }
  }
}
