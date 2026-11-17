import type { WishlistItemEntity } from './wishlist_item.js'

export type WishlistEntry = {
  id: number
  productId: number
  perfumeName: string
  brand: string
  concentrationCode: string
  volumeMl: number
}

export interface WishlistRepository {
  listWishlist(
    userId: number,
    page: number,
    perPage: number
  ): Promise<{ items: WishlistEntry[]; total: number }>
  add(userId: number, productId: number): Promise<WishlistItemEntity>
  remove(userId: number, itemId: number): Promise<boolean>
  moveToCollection(userId: number, itemId: number): Promise<boolean>
}
