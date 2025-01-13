import { GymRepository } from '@/repositories/gym-repository'

interface SearchGymUseCaseRequest {
  page: number
  query: string
}

export class SearchGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({ query, page }: SearchGymUseCaseRequest) {
    const gyms = await this.gymRepository.searchMany(query, page)

    return { gyms }
  }
}
