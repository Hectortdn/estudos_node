import { CheckInRepository } from '@/repositories/check-in-repository'

interface FetchUserCheckInHistoricUserCaseRequest {
  userId: string
  page: number
}

export class FetchUserCheckInHistoricUserCase {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({ userId, page }: FetchUserCheckInHistoricUserCaseRequest) {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
