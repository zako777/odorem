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

  async findProductById(id: number) {
    return this.products.find((product) => product.id === id) ?? null
  }

  barcodes = new Map<string, number>()

  async findProductByBarcode(code: string) {
    const productId = this.barcodes.get(code)
    if (!productId) {
      return null
    }
    const product = this.products.find((entry) => entry.id === productId)
    const perfume = product && this.perfumes.find((entry) => entry.id === product.perfumeId)
    if (!product || !perfume) {
      return null
    }

    return {
      productId: product.id,
      volumeMl: product.volumeMl,
      concentrationCode: product.concentration.code,
      concentrationLabel: product.concentration.label,
      perfumeId: perfume.id,
      perfumeName: perfume.name,
      brand: perfume.brand,
    }
  }

  addBarcode(code: string, productId: number) {
    this.barcodes.set(code, productId)
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
