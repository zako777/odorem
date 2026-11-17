import db from '@adonisjs/lucid/services/db'

import Possession from '#models/possession'
import type {
  CollectionRepository,
  CollectionEntry,
  UpdatePossessionChanges,
} from '#collection/domain/collection_repository'
import { PossessionEntity } from '#collection/domain/possession'
import type { PossessionCondition } from '#collection/domain/possession'
import { upsertPossession } from '#collection/infrastructure/persistence/possession_upsert'

export class LucidCollectionRepository implements CollectionRepository {
  async listCollection(userId: number, page: number, perPage: number) {
    const paginated = await Possession.query()
      .where('userId', userId)
      .preload('product', (query) => {
        query.preload('perfume').preload('concentration')
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    const items: CollectionEntry[] = paginated.all().map((possession) => ({
      possession: toEntity(possession),
      perfumeName: possession.product.perfume.name,
      brand: possession.product.perfume.brand,
      concentrationCode: possession.product.concentration.code,
      volumeMl: possession.product.volumeMl,
    }))

    return { items, total: paginated.total }
  }

  async addOrIncrement(userId: number, productId: number): Promise<PossessionEntity> {
    await upsertPossession(db, userId, productId)

    const possession = await Possession.query()
      .where('userId', userId)
      .where('productId', productId)
      .firstOrFail()
    return toEntity(possession)
  }

  async update(
    userId: number,
    possessionId: number,
    changes: UpdatePossessionChanges
  ): Promise<PossessionEntity | null> {
    const possession = await Possession.query()
      .where('id', possessionId)
      .where('userId', userId)
      .first()
    if (!possession) {
      return null
    }
    possession.merge(changes)
    await possession.save()
    return toEntity(possession)
  }

  async remove(userId: number, possessionId: number): Promise<boolean> {
    const possession = await Possession.query()
      .where('id', possessionId)
      .where('userId', userId)
      .first()
    if (!possession) {
      return false
    }
    await possession.delete()
    return true
  }
}

const toEntity = (possession: Possession) =>
  PossessionEntity.fromPersistence({
    id: possession.id,
    userId: possession.userId,
    productId: possession.productId,
    quantity: possession.quantity,
    condition: possession.condition as PossessionCondition,
    rating: possession.rating,
    comment: possession.comment,
  })
