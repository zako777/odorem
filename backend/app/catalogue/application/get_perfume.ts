import type { CatalogueRepository } from '../domain/catalogue_repository.js'
import { PerfumeNotFoundError } from '../domain/errors.js'
import type { PerfumeEntity } from '../domain/perfume.js'

export class GetPerfume {
  constructor(private readonly repository: CatalogueRepository) {}

  async execute(id: number): Promise<PerfumeEntity> {
    const perfume = await this.repository.findPerfumeById(id)
    if (!perfume) {
      throw new PerfumeNotFoundError(id)
    }
    return perfume
  }
}
