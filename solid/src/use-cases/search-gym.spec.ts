import { describe, beforeEach, expect, it } from 'vitest'

import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { SearchGymUseCase } from './search-gym'

let gymRepository: InMemoryGymRepository
let sut: SearchGymUseCase

describe('Sear Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new SearchGymUseCase(gymRepository)
  })

  it('Should be able to search gym', async () => {
    await Promise.all([
      gymRepository.create({
        phone: null,
        title: 'Gym Test 1',
        description: null,
        latitude: -27.0747279,
        longitude: -49.4889672,
      }),
      gymRepository.create({
        phone: null,
        title: 'Gym Test 2',
        description: null,
        latitude: -27.0747279,
        longitude: -49.4889672,
      }),
      gymRepository.create({
        phone: null,
        title: 'Gym Test 1',
        description: null,
        latitude: -27.0747279,
        longitude: -49.4889672,
      }),
    ])

    const { gyms } = await sut.execute({ query: 'Gym Test 1', page: 1 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym Test 1' }),
      expect.objectContaining({ title: 'Gym Test 1' }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        phone: null,
        title: `Gym Test ${i}`,
        description: null,
        latitude: -27.0747279,
        longitude: -49.4889672,
      })
    }

    const { gyms } = await sut.execute({ query: 'Gym Test', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym Test 21' }),
      expect.objectContaining({ title: 'Gym Test 22' }),
    ])
  })
})
