import Perfume from '#models/perfume'
import Product from '#models/product'
import type {
  CatalogueRepository,
  SearchPerfumesQuery,
} from '#catalogue/domain/catalogue_repository'
import { PerfumeEntity } from '#catalogue/domain/perfume'
import { ProductEntity } from '#catalogue/domain/product'

export class LucidCatalogueRepository implements CatalogueRepository {
  async searchPerfumes({ search, page, perPage }: SearchPerfumesQuery) {
    const query = Perfume.query().orderBy('name', 'asc')
    if (search) {
      query.where((builder) => {
        builder.whereILike('name', `%${search}%`).orWhereILike('brand', `%${search}%`)
      })
    }

    const paginated = await query.paginate(page, perPage)

    return {
      items: paginated.all().map((perfume) => PerfumeEntity.fromPersistence(perfume)),
      total: paginated.total,
    }
  }

  async findPerfumeById(id: number): Promise<PerfumeEntity | null> {
    const perfume = await Perfume.find(id)
    return perfume ? PerfumeEntity.fromPersistence(perfume) : null
  }

  async listProductsByPerfume(perfumeId: number): Promise<ProductEntity[]> {
    const products = await Product.query()
      .where('perfumeId', perfumeId)
      .preload('concentration')
      .orderBy('volumeMl', 'asc')

    return products.map((product) => ProductEntity.fromPersistence(product))
  }
}
