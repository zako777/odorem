import type { CatalogueRepository } from '../domain/catalogue_repository.js'
import type { ProductEntity } from '../domain/product.js'

export class ListProductsByPerfume {
  constructor(private readonly repository: CatalogueRepository) {}

  execute(perfumeId: number): Promise<ProductEntity[]> {
    return this.repository.listProductsByPerfume(perfumeId)
  }
}
