import {
  Arg,
  Authorized,
  Field,
  FieldResolver,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
  Root,
} from '@foadonis/graphql'

import { GetPerfume } from '#catalogue/application/get_perfume'
import { FindProductByBarcode } from '#catalogue/application/find_product_by_barcode'
import { ListProductsByPerfume } from '#catalogue/application/list_products_by_perfume'
import { SearchPerfumes } from '#catalogue/application/search_perfumes'
import { LucidCatalogueRepository } from '#catalogue/infrastructure/persistence/lucid_catalogue_repository'
import { barcodeValidator } from '#validators/barcode'

@ObjectType()
class ConcentrationType {
  @Field(() => ID)
  id!: number

  @Field()
  code!: string

  @Field()
  label!: string
}

@ObjectType()
class ProductType {
  @Field(() => ID)
  id!: number

  @Field(() => Int)
  volumeMl!: number

  @Field(() => ConcentrationType)
  concentration!: ConcentrationType
}

@ObjectType()
class PerfumeType {
  @Field(() => ID)
  id!: number

  @Field()
  name!: string

  @Field()
  brand!: string

  @Field(() => String, { nullable: true })
  description!: string | null
}

@ObjectType()
class PerfumesPage {
  @Field(() => [PerfumeType])
  items!: PerfumeType[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number
}

@ObjectType()
class ScannedProductType {
  @Field(() => ID)
  productId!: number

  @Field(() => Int)
  volumeMl!: number

  @Field()
  concentrationCode!: string

  @Field()
  concentrationLabel!: string

  @Field(() => ID)
  perfumeId!: number

  @Field()
  perfumeName!: string

  @Field()
  brand!: string
}

@Resolver(() => PerfumeType)
@Authorized()
export default class CatalogueResolver {
  private readonly repository = new LucidCatalogueRepository()
  private readonly searchPerfumes = new SearchPerfumes(this.repository)
  private readonly getPerfume = new GetPerfume(this.repository)
  private readonly findProductByBarcode = new FindProductByBarcode(this.repository)
  private readonly listProductsByPerfume = new ListProductsByPerfume(this.repository)

  @Query(() => PerfumesPage)
  async perfumes(
    @Arg('search', () => String, { nullable: true }) search?: string | null,
    @Arg('page', () => Int, { nullable: true }) page?: number | null,
    @Arg('perPage', () => Int, { nullable: true }) perPage?: number | null
  ) {
    return this.searchPerfumes.execute({ search, page, perPage })
  }

  @Query(() => PerfumeType)
  async perfume(@Arg('id', () => Int) id: number) {
    return this.getPerfume.execute(id)
  }

  @Query(() => ScannedProductType, { nullable: true })
  async productByBarcode(@Arg('code', () => String) code: string) {
    const { code: normalized } = await barcodeValidator.validate({ code })
    return this.findProductByBarcode.execute(normalized)
  }

  @FieldResolver(() => [ProductType])
  async products(@Root() perfume: PerfumeType) {
    return this.listProductsByPerfume.execute(perfume.id)
  }
}
