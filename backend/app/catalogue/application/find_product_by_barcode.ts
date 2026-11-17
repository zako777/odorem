import type { CatalogueRepository } from '../domain/catalogue_repository.js'
import type { ScannedProduct } from '../domain/catalogue_repository.js'

export class FindProductByBarcode {
  constructor(private readonly repository: CatalogueRepository) {}

  execute(code: string): Promise<ScannedProduct | null> {
    return this.repository.findProductByBarcode(code)
  }
}
