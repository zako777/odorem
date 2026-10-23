import type { PerfumeEntity } from './perfume.js'
import type { ProductEntity } from './product.js'

export type SearchPerfumesQuery = {
  search: string | null
  page: number
  perPage: number
}

export type PerfumesPage = {
  items: PerfumeEntity[]
  total: number
  page: number
  perPage: number
}

export interface CatalogueRepository {
  searchPerfumes(query: SearchPerfumesQuery): Promise<{ items: PerfumeEntity[]; total: number }>
  findPerfumeById(id: number): Promise<PerfumeEntity | null>
  listProductsByPerfume(perfumeId: number): Promise<ProductEntity[]>
}
