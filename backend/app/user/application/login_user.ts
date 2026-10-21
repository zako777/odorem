import hash from '@adonisjs/core/services/hash'

import { InvalidCredentialsError } from '../domain/errors.js'
import type { UserEntity } from '../domain/user.js'
import type { UserRepository } from '../domain/user_repository.js'

export type LoginUserInput = {
  email: string
  password: string
}

export class LoginUser {
  constructor(private readonly repository: UserRepository) {}

  async execute({ email, password }: LoginUserInput): Promise<UserEntity> {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await this.repository.findByEmail(normalizedEmail)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await hash.verify(user.passwordHash, password)
    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    return user
  }
}
