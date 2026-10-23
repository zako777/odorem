import type {
  CatalogueRepository,
  SearchPerfumesQuery,
} from '#catalogue/domain/catalogue_repository'
import { ConcentrationEntity } from '#catalogue/domain/concentration'
import { PerfumeEntity } from '#catalogue/domain/perfume'
import { ProductEntity } from '#catalogue/domain/product'

const DEFAULT_CONCENTRATION = new ConcentrationEntity(1, 'edp', 'Eau de parfum')

export default class InMemoryCatalogueRepository implements CatalogueRepository {
  perfumes: PerfumeEntity[] = []
  products: ProductEntity[] = []
  lastSearchQuery: SearchPerfumesQuery | null = null

  async searchPerfumes(query: SearchPerfumesQuery) {
    this.lastSearchQuery = query
    return { items: this.perfumes, total: this.perfumes.length }
  }

  async findPerfumeById(id: number) {
    return this.perfumes.find((perfume) => perfume.id === id) ?? null
  }

  async listProductsByPerfume(perfumeId: number) {
    return this.products.filter((product) => product.perfumeId === perfumeId)
  }

  addPerfume(id: number, name: string, brand: string, description: string | null = null) {
    const perfume = new PerfumeEntity(id, name, brand, description)
    this.perfumes.push(perfume)
    return perfume
  }

  addProduct(id: number, perfumeId: number, volumeMl: number) {
    const product = new ProductEntity(id, perfumeId, volumeMl, DEFAULT_CONCENTRATION)
    this.products.push(product)
    return product
  }
}
