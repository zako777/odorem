import User from '#models/user'

import type { UserEntity } from '../../domain/user.js'
import { UserEntity as UserDomainEntity } from '../../domain/user.js'
import type { UserRepository } from '../../domain/user_repository.js'

export class LucidUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await User.query()
      .whereRaw('LOWER(email) = ?', [email.trim().toLowerCase()])
      .first()

    if (!user) {
      return null
    }

    return UserDomainEntity.fromPersistence({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.password,
    })
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await User.find(id)

    if (!user) {
      return null
    }

    return UserDomainEntity.fromPersistence({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.password,
    })
  }

  async save(data: {
    email: string
    fullName: string | null
    password: string
  }): Promise<UserEntity> {
    const user = await User.create({
      email: data.email,
      fullName: data.fullName,
      password: data.password,
    })

    return UserDomainEntity.fromPersistence({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      passwordHash: user.password,
    })
  }
}
