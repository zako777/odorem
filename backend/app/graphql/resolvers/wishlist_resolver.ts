import User from '#models/user'
import {
  Arg,
  Authorized,
  CurrentUser,
  Field,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@foadonis/graphql'

import { AddToWishlist } from '#wishlist/application/add_to_wishlist'
import { ListWishlist } from '#wishlist/application/list_wishlist'
import { MoveWishlistToCollection } from '#wishlist/application/move_wishlist_to_collection'
import { RemoveFromWishlist } from '#wishlist/application/remove_from_wishlist'
import { LucidWishlistRepository } from '#wishlist/infrastructure/persistence/lucid_wishlist_repository'
import { LucidCatalogueRepository } from '#catalogue/infrastructure/persistence/lucid_catalogue_repository'

@ObjectType()
class WishlistItemType {
  @Field(() => ID)
  id!: number

  @Field(() => ID)
  productId!: number
}

@ObjectType()
class WishlistEntryType {
  @Field(() => ID)
  id!: number

  @Field(() => ID)
  productId!: number

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
class WishlistPage {
  @Field(() => [WishlistEntryType])
  items!: WishlistEntryType[]

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  perPage!: number
}

@Resolver(() => WishlistEntryType)
@Authorized()
export default class WishlistResolver {
  private readonly wishlistRepository = new LucidWishlistRepository()
  private readonly catalogueRepository = new LucidCatalogueRepository()
  private readonly addToWishlistUseCase = new AddToWishlist(
    this.wishlistRepository,
    this.catalogueRepository
  )
  private readonly listWishlistUseCase = new ListWishlist(this.wishlistRepository)
  private readonly removeFromWishlistUseCase = new RemoveFromWishlist(this.wishlistRepository)
  private readonly moveWishlistToCollectionUseCase = new MoveWishlistToCollection(
    this.wishlistRepository
  )

  @Query(() => WishlistPage)
  async myWishlist(
    @CurrentUser() user: User,
    @Arg('page', () => Int, { nullable: true }) page?: number | null,
    @Arg('perPage', () => Int, { nullable: true }) perPage?: number | null
  ) {
    return this.listWishlistUseCase.execute({ userId: user.id, page, perPage })
  }

  @Mutation(() => WishlistItemType)
  async addToWishlist(@CurrentUser() user: User, @Arg('productId', () => Int) productId: number) {
    return this.addToWishlistUseCase.execute({ userId: user.id, productId })
  }

  @Mutation(() => Boolean)
  async removeFromWishlist(@CurrentUser() user: User, @Arg('itemId', () => Int) itemId: number) {
    await this.removeFromWishlistUseCase.execute({ userId: user.id, itemId })
    return true
  }

  @Mutation(() => Boolean)
  async moveWishlistToCollection(
    @CurrentUser() user: User,
    @Arg('itemId', () => Int) itemId: number
  ) {
    await this.moveWishlistToCollectionUseCase.execute({ userId: user.id, itemId })
    return true
  }
}
