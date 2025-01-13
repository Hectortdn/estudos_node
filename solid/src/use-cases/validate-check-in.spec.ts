import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFound } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation.error'

let checkInRepository: InMemoryCheckInRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)
  })

  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })
  it('should be able to validate check in', async () => {
    const checkInCreated = await checkInRepository.create({
      gym_Id: 'gymId-01',
      user_id: 'gymId-01',
    })

    await expect(
      sut.execute({ checkInId: checkInCreated.id }),
    ).resolves.toBeTruthy()
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(
      sut.execute({ checkInId: 'inexistent-check-in-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation ', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const checkInCreated = await checkInRepository.create({
      gym_Id: 'gymId-01',
      user_id: 'userId-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21 // 21 minutes

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({ checkInId: checkInCreated.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
