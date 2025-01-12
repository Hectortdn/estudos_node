import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { CheckInUseCase } from './check-in'

let checkInRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      phone: '',
      id: 'gym-Id',
      description: '',
      title: 'Academia Teste',
      latitude: new Decimal(-23.42236),
      longitude: new Decimal(46.8519952),
    })
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
      userLatitude: -23.4223609,
      userLongitude: 46.8519952,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 7, 0, 0))

    await sut.execute({
      gymId: 'gym-Id',
      userId: 'user-Id',
      userLatitude: -23.4223609,
      userLongitude: 46.8519952,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-Id',
        userId: 'user-Id',
        userLatitude: -23.4223609,
        userLongitude: 46.8519952,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 7, 0, 0))

    await sut.execute({
      gymId: 'gym-Id',
      userId: 'user-Id',
      userLatitude: -23.4223609,
      userLongitude: 46.8519952,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 7, 0, 0))

    await expect(
      sut.execute({
        gymId: 'gym-Id',
        userId: 'user-Id',
        userLatitude: -23.4223609,
        userLongitude: 46.8519952,
      }),
    ).resolves.toBeTruthy()
  })

  it('should not be able to check in distance gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
