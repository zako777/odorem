import type { CollectionRepository } from '../domain/collection_repository.js'
import { PossessionNotFoundError } from '../domain/errors.js'

export type RemovePossessionInput = {
  userId: number
  possessionId: number
}

export class RemovePossession {
  constructor(private readonly repository: CollectionRepository) {}

  async execute({ userId, possessionId }: RemovePossessionInput): Promise<void> {
    const removed = await this.repository.remove(userId, possessionId)
    if (!removed) {
      throw new PossessionNotFoundError(possessionId)
    }
  }
}
