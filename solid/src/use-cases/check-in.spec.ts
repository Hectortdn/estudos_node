import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { CheckInUseCase } from './check-in'

let checkInRepository: InMemoryCheckInRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new CheckInUseCase(checkInRepository)
  })

  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able to create a check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-Id',
      userId: 'user-Id',
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 7, 0, 0))

    await sut.execute({
      gymId: 'gym-Id',
      userId: 'user-Id',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-Id',
        userId: 'user-Id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 7, 0, 0))

    await sut.execute({
      gymId: 'gym-Id',
      userId: 'user-Id',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 7, 0, 0))

    await expect(
      sut.execute({
        gymId: 'gym-Id',
        userId: 'user-Id',
      }),
    ).resolves.toBeTruthy()
  })
})
