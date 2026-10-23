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
import { ListProductsByPerfume } from '#catalogue/application/list_products_by_perfume'
import { SearchPerfumes } from '#catalogue/application/search_perfumes'
import { LucidCatalogueRepository } from '#catalogue/infrastructure/persistence/lucid_catalogue_repository'

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

@Resolver(() => PerfumeType)
@Authorized()
export default class CatalogueResolver {
  private readonly repository = new LucidCatalogueRepository()
  private readonly searchPerfumes = new SearchPerfumes(this.repository)
  private readonly getPerfume = new GetPerfume(this.repository)
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

  @FieldResolver(() => [ProductType])
  async products(@Root() perfume: PerfumeType) {
    return this.listProductsByPerfume.execute(perfume.id)
  }
}
