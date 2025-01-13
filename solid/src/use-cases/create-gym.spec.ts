import { describe, expect, it } from 'vitest'

import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { CreateGymUseCase } from './create-gym'

describe('Create Gym Use Case', () => {
  it('should be able to create a gym', async () => {
    const gymRepository = new InMemoryGymRepository()
    const sut = new CreateGymUseCase(gymRepository)

    const { gym } = await sut.execute({
      phone: '',
      description: '',
      title: 'Gym Test',
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
