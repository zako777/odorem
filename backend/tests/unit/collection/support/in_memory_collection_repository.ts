import type {
  CollectionRepository,
  UpdatePossessionChanges,
} from '#collection/domain/collection_repository'
import { PossessionEntity } from '#collection/domain/possession'

export default class InMemoryCollectionRepository implements CollectionRepository {
  possessions: PossessionEntity[] = []
  nextId = 1

  async listCollection(userId: number, page: number, perPage: number) {
    const owned = this.possessions.filter((possession) => possession.userId === userId)
    const start = (page - 1) * perPage
    return {
      items: owned.slice(start, start + perPage).map((possession) => ({
        possession,
        perfumeName: 'Test',
        brand: 'Brand',
        concentrationCode: 'edp',
        volumeMl: 100,
      })),
      total: owned.length,
    }
  }

  async addOrIncrement(userId: number, productId: number) {
    const existing = await this.findByUserAndProduct(userId, productId)
    return existing ? this.incrementQuantity(existing) : this.add(userId, productId)
  }

  async findByUserAndProduct(userId: number, productId: number) {
    return (
      this.possessions.find(
        (possession) => possession.userId === userId && possession.productId === productId
      ) ?? null
    )
  }

  async add(userId: number, productId: number) {
    const possession = new PossessionEntity(this.nextId++, userId, productId, 1, 'new', null, null)
    this.possessions.push(possession)
    return possession
  }

  async incrementQuantity(possession: PossessionEntity) {
    const index = this.possessions.findIndex((entry) => entry.id === possession.id)
    const incremented = new PossessionEntity(
      possession.id,
      possession.userId,
      possession.productId,
      possession.quantity + 1,
      possession.condition,
      possession.rating,
      possession.comment
    )
    this.possessions[index] = incremented
    return incremented
  }

  async update(userId: number, possessionId: number, changes: UpdatePossessionChanges) {
    const index = this.possessions.findIndex(
      (possession) => possession.id === possessionId && possession.userId === userId
    )
    if (index === -1) {
      return null
    }
    const current = this.possessions[index]
    const updated = new PossessionEntity(
      current.id,
      current.userId,
      current.productId,
      changes.quantity ?? current.quantity,
      changes.condition ?? current.condition,
      changes.rating === undefined ? current.rating : changes.rating,
      changes.comment === undefined ? current.comment : changes.comment
    )
    this.possessions[index] = updated
    return updated
  }

  async remove(userId: number, possessionId: number) {
    const index = this.possessions.findIndex(
      (possession) => possession.id === possessionId && possession.userId === userId
    )
    if (index === -1) {
      return false
    }
    this.possessions.splice(index, 1)
    return true
  }
}
