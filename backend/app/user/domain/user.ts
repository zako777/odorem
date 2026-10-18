export type UserRecord = {
  id: number
  email: string
  fullName: string | null
  passwordHash: string
}

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly fullName: string | null,
    public readonly passwordHash: string
  ) {}

  static fromPersistence(record: UserRecord) {
    return new UserEntity(record.id, record.email, record.fullName, record.passwordHash)
  }

  toPublic() {
    return {
      id: this.id,
      email: this.email,
      fullName: this.fullName,
    }
  }
}
