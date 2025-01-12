import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })
  it('should be able to get user check ins count from metrics', async () => {
    await Promise.all([
      checkInRepository.create({ gym_Id: 'gymId-1', user_id: 'userId-1' }),
      checkInRepository.create({ gym_Id: 'gymId-2', user_id: 'userId-1' }),
      checkInRepository.create({ gym_Id: 'gymId-3', user_id: 'userId-1' }),
    ])

    const { checkInCount } = await sut.execute({ userId: 'userId-1' })

    expect(checkInCount).toBe(3)
  })
})
