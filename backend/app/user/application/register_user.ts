import { UserAlreadyExistsError } from '../domain/errors.js'
import { type UserEntity } from '../domain/user.js'
import type { UserRepository } from '../domain/user_repository.js'

export type RegisterUserInput = {
  email: string
  password: string
  fullName?: string | null
}

export class RegisterUser {
  constructor(private readonly repository: UserRepository) {}

  async execute({ email, password, fullName }: RegisterUserInput): Promise<UserEntity> {
    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || normalizedEmail.length > 254) {
      throw new Error('A valid email is required.')
    }

    if (password.length < 8 || password.length > 32) {
      throw new Error('Password must contain between 8 and 32 characters.')
    }

    const existingUser = await this.repository.findByEmail(normalizedEmail)
    if (existingUser) {
      throw new UserAlreadyExistsError(normalizedEmail)
    }

    return this.repository.save({
      email: normalizedEmail,
      fullName: fullName?.trim() || null,
      password,
    })
  }
}
