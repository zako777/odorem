import type { WishlistRepository } from '../domain/wishlist_repository.js'
import { WishlistItemNotFoundError } from '../domain/errors.js'

export type RemoveFromWishlistInput = {
  userId: number
  itemId: number
}

export class RemoveFromWishlist {
  constructor(private readonly repository: WishlistRepository) {}

  async execute({ userId, itemId }: RemoveFromWishlistInput): Promise<void> {
    const removed = await this.repository.remove(userId, itemId)
    if (!removed) {
      throw new WishlistItemNotFoundError(itemId)
    }
  }
}
