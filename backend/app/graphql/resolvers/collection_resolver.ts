import User from '#models/user'
import {
  Arg,
  Authorized,
  CurrentUser,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@foadonis/graphql'

import { ListCollection } from '#collection/application/list_collection'
import { AddToCollection } from '#collection/application/add_to_collection'
import { UpdatePossession } from '#collection/application/update_possession'
import { RemovePossession } from '#collection/application/remove_possession'
import { LucidCollectionRepository } from '#collection/infrastructure/persistence/lucid_collection_repository'
import { LucidCatalogueRepository } from '#catalogue/infrastructure/persistence/lucid_catalogue_repository'
import { updatePossessionValidator } from '#validators/possession'

@ObjectType()
class PossessionType {
  @Field(() => ID)
  id!: number

  @Field(() => ID)
  productId!: number

  @Field(() => Int)
  quantity!: number

  @Field()
  condition!: string

  @Field(() => Int, { nullable: true })
  rating!: number | null

  @Field(() => String, { nullable: true })
  comment!: string | null
}

@ObjectType()
class CollectionEntryType {
  @Field(() => PossessionType)
  possession!: PossessionType

  @Field()
  perfumeName!: string

  @Field()
  brand!: string

  @Field()
  concentrationCode!: string

  @Field(() => Int)
  volumeMl!: number
}

@ObjectType()
class CollectionPage {
  @Field(() => [CollectionEntryType])
  items!: CollectionEntryType[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number
}

@InputType()
class UpdatePossessionInput {
  @Field(() => Int, { nullable: true })
  quantity?: number

  @Field(() => String, { nullable: true })
  condition?: string

  @Field(() => Int, { nullable: true })
  rating?: number | null

  @Field(() => String, { nullable: true })
  comment?: string | null
}

@Resolver(() => PossessionType)
@Authorized()
export default class CollectionResolver {
  private readonly collectionRepository = new LucidCollectionRepository()
  private readonly catalogueRepository = new LucidCatalogueRepository()
  private readonly listCollectionUseCase = new ListCollection(this.collectionRepository)
  private readonly addToCollectionUseCase = new AddToCollection(
    this.collectionRepository,
    this.catalogueRepository
  )
  private readonly updatePossessionUseCase = new UpdatePossession(this.collectionRepository)
  private readonly removePossessionUseCase = new RemovePossession(this.collectionRepository)

  @Query(() => CollectionPage)
  async myCollection(
    @CurrentUser() user: User,
    @Arg('page', () => Int, { nullable: true }) page?: number | null,
    @Arg('perPage', () => Int, { nullable: true }) perPage?: number | null
  ) {
    return this.listCollectionUseCase.execute({ userId: user.id, page, perPage })
  }

  @Mutation(() => PossessionType)
  async addToCollection(@CurrentUser() user: User, @Arg('productId', () => Int) productId: number) {
    return this.addToCollectionUseCase.execute({ userId: user.id, productId })
  }

  @Mutation(() => PossessionType)
  async updatePossession(
    @CurrentUser() user: User,
    @Arg('possessionId', () => Int) possessionId: number,
    @Arg('input', () => UpdatePossessionInput) input: UpdatePossessionInput
  ) {
    const changes = await updatePossessionValidator.validate(input)
    return this.updatePossessionUseCase.execute({ userId: user.id, possessionId, changes })
  }

  @Mutation(() => Boolean)
  async removePossession(
    @CurrentUser() user: User,
    @Arg('possessionId', () => Int) possessionId: number
  ) {
    await this.removePossessionUseCase.execute({ userId: user.id, possessionId })
    return true
  }
}
