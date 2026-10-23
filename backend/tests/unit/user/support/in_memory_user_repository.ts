import { UserEntity } from '#user/domain/user'
import type { UserPersistenceInput, UserRepository } from '#user/domain/user_repository'

export default class InMemoryUserRepository implements UserRepository {
  users: UserEntity[] = []
  lastSavedInput: UserPersistenceInput | null = null
  private nextId = 1

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null
  }

  async findById(id: number) {
    return this.users.find((user) => user.id === id) ?? null
  }

  async save(data: UserPersistenceInput) {
    this.lastSavedInput = data
    const user = new UserEntity(this.nextId++, data.email, data.fullName, data.password)
    this.users.push(user)
    return user
  }
}
