import type { WishlistRepository } from '../domain/wishlist_repository.js'
import { WishlistItemNotFoundError } from '../domain/errors.js'

export type MoveWishlistToCollectionInput = {
  userId: number
  itemId: number
}

export class MoveWishlistToCollection {
  constructor(private readonly repository: WishlistRepository) {}

  async execute({ userId, itemId }: MoveWishlistToCollectionInput): Promise<void> {
    const moved = await this.repository.moveToCollection(userId, itemId)
    if (!moved) {
      throw new WishlistItemNotFoundError(itemId)
    }
  }
}
