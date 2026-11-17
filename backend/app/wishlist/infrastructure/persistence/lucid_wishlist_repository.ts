import db from '@adonisjs/lucid/services/db'

import WishlistItem from '#models/wishlist_item'
import { upsertPossession } from '#collection/infrastructure/persistence/possession_upsert'
import type { WishlistRepository, WishlistEntry } from '#wishlist/domain/wishlist_repository'
import { WishlistItemEntity } from '#wishlist/domain/wishlist_item'

export class LucidWishlistRepository implements WishlistRepository {
  async listWishlist(userId: number, page: number, perPage: number) {
    const paginated = await WishlistItem.query()
      .where('userId', userId)
      .preload('product', (query) => {
        query.preload('perfume').preload('concentration')
      })
      .orderBy('createdAt', 'desc')
      .paginate(page, perPage)

    const items: WishlistEntry[] = paginated.all().map((item) => ({
      id: item.id,
      productId: item.productId,
      perfumeName: item.product.perfume.name,
      brand: item.product.perfume.brand,
      concentrationCode: item.product.concentration.code,
      volumeMl: item.product.volumeMl,
    }))

    return { items, total: paginated.total }
  }

  async add(userId: number, productId: number): Promise<WishlistItemEntity> {
    // Idempotent: a repeated add keeps a single wishlist entry.
    await db
      .table('wishlist_items')
      .insert({ user_id: userId, product_id: productId, created_at: new Date() })
      .onConflict(['user_id', 'product_id'])
      .ignore()

    const item = await WishlistItem.query()
      .where('userId', userId)
      .where('productId', productId)
      .firstOrFail()
    return toEntity(item)
  }

  async remove(userId: number, itemId: number): Promise<boolean> {
    const item = await WishlistItem.query().where('id', itemId).where('userId', userId).first()
    if (!item) {
      return false
    }
    await item.delete()
    return true
  }

  async moveToCollection(userId: number, itemId: number): Promise<boolean> {
    return db.transaction(async (trx) => {
      const item = await WishlistItem.query({ client: trx })
        .where('id', itemId)
        .where('userId', userId)
        .first()
      if (!item) {
        return false
      }

      await upsertPossession(trx, userId, item.productId)
      await item.delete()
      return true
    })
  }
}

const toEntity = (item: WishlistItem) =>
  WishlistItemEntity.fromPersistence({
    id: item.id,
    userId: item.userId,
    productId: item.productId,
  })
