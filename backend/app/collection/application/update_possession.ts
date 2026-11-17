import type { CollectionRepository } from '../domain/collection_repository.js'
import type { UpdatePossessionChanges } from '../domain/collection_repository.js'
import type { PossessionEntity } from '../domain/possession.js'
import { PossessionNotFoundError } from '../domain/errors.js'

export type UpdatePossessionInput = {
  userId: number
  possessionId: number
  changes: UpdatePossessionChanges
}

export class UpdatePossession {
  constructor(private readonly repository: CollectionRepository) {}

  async execute({
    userId,
    possessionId,
    changes,
  }: UpdatePossessionInput): Promise<PossessionEntity> {
    const updated = await this.repository.update(userId, possessionId, changes)
    if (!updated) {
      throw new PossessionNotFoundError(possessionId)
    }
    return updated
  }
}
