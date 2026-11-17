import type { CollectionRepository } from '../domain/collection_repository.js'
import type { PossessionEntity } from '../domain/possession.js'
import type { CatalogueRepository } from '#catalogue/domain/catalogue_repository'
import { ProductNotFoundError } from '#catalogue/domain/errors'

export type AddToCollectionInput = {
  userId: number
  productId: number
}

export class AddToCollection {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly catalogueRepository: CatalogueRepository
  ) {}

  async execute({ userId, productId }: AddToCollectionInput): Promise<PossessionEntity> {
    const product = await this.catalogueRepository.findProductById(productId)
    if (!product) {
      throw new ProductNotFoundError(productId)
    }

    return this.collectionRepository.addOrIncrement(userId, productId)
  }
}
