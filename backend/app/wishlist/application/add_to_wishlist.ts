import type { WishlistRepository } from '../domain/wishlist_repository.js'
import type { WishlistItemEntity } from '../domain/wishlist_item.js'
import type { CatalogueRepository } from '#catalogue/domain/catalogue_repository'
import { ProductNotFoundError } from '#catalogue/domain/errors'

export type AddToWishlistInput = {
  userId: number
  productId: number
}

export class AddToWishlist {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly catalogueRepository: CatalogueRepository
  ) {}

  async execute({ userId, productId }: AddToWishlistInput): Promise<WishlistItemEntity> {
    const product = await this.catalogueRepository.findProductById(productId)
    if (!product) {
      throw new ProductNotFoundError(productId)
    }

    return this.wishlistRepository.add(userId, productId)
  }
}
