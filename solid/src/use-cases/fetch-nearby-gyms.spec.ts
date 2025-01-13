import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymRepository: InMemoryGymRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new FetchNearbyGymsUseCase(gymRepository)
  })
  it('should be able to fetch nearby gyms', async () => {
    await Promise.all([
      gymRepository.create({
        phone: null,
        title: 'Nearby gym',
        description: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      }),
      gymRepository.create({
        phone: null,
        title: 'Far Gym',
        description: null,
        latitude: -27.0610928,
        longitude: -49.5229501,
      }),
    ])

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Nearby gym' })])
  })
})
