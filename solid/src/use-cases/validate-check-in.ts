import { CheckInRepository } from '@/repositories/check-in-repository'
import { ResourceNotFound } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({ checkInId }: ValidateCheckInUseCaseRequest) {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFound()
    }

    const checkInValidateDate = new Date()

    const distanceInMinutesFromCheckInCreation = dayjs(
      checkInValidateDate,
    ).diff(checkIn.create_at, 'minutes')

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = checkInValidateDate

    return { checkIn }
  }
}
