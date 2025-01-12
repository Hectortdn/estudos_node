import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInRepository {
  countByUserId: (userId: string) => Promise<number>
  findManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>
  findByUserIdOnDate: (userId: string, data: Date) => Promise<CheckIn | null>
}
