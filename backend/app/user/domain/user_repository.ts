import type { UserEntity } from './user.js'

export type UserPersistenceInput = {
  email: string
  fullName: string | null
  password: string
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: number): Promise<UserEntity | null>
  save(data: UserPersistenceInput): Promise<UserEntity>
}
