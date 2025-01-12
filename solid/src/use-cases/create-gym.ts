import { GymRepository } from '@/repositories/gym-repository'

interface CreateGymUseCaseRequest {
  id?: string
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute(data: CreateGymUseCaseRequest) {
    const gym = await this.gymRepository.create(data)

    return { gym }
  }
}
