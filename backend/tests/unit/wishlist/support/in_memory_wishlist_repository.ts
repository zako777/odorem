import type { WishlistRepository, WishlistEntry } from '#wishlist/domain/wishlist_repository'
import { WishlistItemEntity } from '#wishlist/domain/wishlist_item'

export default class InMemoryWishlistRepository implements WishlistRepository {
  items: WishlistItemEntity[] = []
  nextId = 1

  async listWishlist(userId: number, page: number, perPage: number) {
    const owned = this.items.filter((item) => item.userId === userId)
    const start = (page - 1) * perPage
    const items: WishlistEntry[] = owned.slice(start, start + perPage).map((item) => ({
      id: item.id,
      productId: item.productId,
      perfumeName: 'Test',
      brand: 'Brand',
      concentrationCode: 'edp',
      volumeMl: 100,
    }))
    return { items, total: owned.length }
  }

  async add(userId: number, productId: number) {
    const existing = this.items.find(
      (item) => item.userId === userId && item.productId === productId
    )
    if (existing) {
      return existing
    }

    const item = new WishlistItemEntity(this.nextId++, userId, productId)
    this.items.push(item)
    return item
  }

  async remove(userId: number, itemId: number) {
    const index = this.items.findIndex((item) => item.id === itemId && item.userId === userId)
    if (index === -1) {
      return false
    }
    this.items.splice(index, 1)
    return true
  }

  // Test double only: the real transfer into the collection is covered by functional tests.
  async moveToCollection(userId: number, itemId: number) {
    return this.remove(userId, itemId)
  }
}
