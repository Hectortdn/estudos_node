import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { FetchUserCheckInHistoricUserCase } from './fetch-user-check-in-historic'

let checkInRepository: InMemoryCheckInRepository
let sut: FetchUserCheckInHistoricUserCase

describe('Fetch User Check In repository Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new FetchUserCheckInHistoricUserCase(checkInRepository)
  })
  it('should be able to fetch check in repository', async () => {
    await Promise.all([
      checkInRepository.create({ gym_Id: 'gymId-1', user_id: 'userId-1' }),
      checkInRepository.create({ gym_Id: 'gymId-2', user_id: 'userId-1' }),
    ])

    const { checkIns } = await sut.execute({ userId: 'userId-1', page: 1 })

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_Id: 'gymId-1' }),
      expect.objectContaining({ gym_Id: 'gymId-2' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_Id: `gymId-${i}`,
        user_id: 'userId-1',
      })
    }

    const { checkIns } = await sut.execute({ userId: 'userId-1', page: 2 })

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_Id: 'gymId-21' }),
      expect.objectContaining({ gym_Id: 'gymId-22' }),
    ])
  })
})
