import { test } from '@japa/runner'

import { AddToWishlist } from '#wishlist/application/add_to_wishlist'
import { ListWishlist } from '#wishlist/application/list_wishlist'
import { RemoveFromWishlist } from '#wishlist/application/remove_from_wishlist'
import InMemoryCatalogueRepository from '../catalogue/support/in_memory_catalogue_repository.js'
import InMemoryWishlistRepository from './support/in_memory_wishlist_repository.js'

test.group('Wishlist use cases', () => {
  test('adds a known product once even when repeated', async ({ assert }) => {
    const catalogue = new InMemoryCatalogueRepository()
    catalogue.addProduct(10, 1, 100)
    const wishlist = new InMemoryWishlistRepository()
    const useCase = new AddToWishlist(wishlist, catalogue)

    const first = await useCase.execute({ userId: 1, productId: 10 })
    const second = await useCase.execute({ userId: 1, productId: 10 })

    assert.equal(first.id, second.id)
    assert.lengthOf(wishlist.items, 1)
  })

  test('rejects an unknown product', async ({ assert }) => {
    const catalogue = new InMemoryCatalogueRepository()
    const wishlist = new InMemoryWishlistRepository()
    const useCase = new AddToWishlist(wishlist, catalogue)

    await assert.rejects(() => useCase.execute({ userId: 1, productId: 999 }))
    assert.lengthOf(wishlist.items, 0)
  })

  test('keeps wishlists isolated between users', async ({ assert }) => {
    const wishlist = new InMemoryWishlistRepository()
    await wishlist.add(1, 10)
    await wishlist.add(2, 10)
    const useCase = new ListWishlist(wishlist)

    const result = await useCase.execute({ userId: 1, page: null, perPage: null })

    assert.equal(result.total, 1)
    assert.equal(result.items[0].productId, 10)
  })

  test('removes an owned item only', async ({ assert }) => {
    const wishlist = new InMemoryWishlistRepository()
    const owned = await wishlist.add(1, 10)
    const foreign = await wishlist.add(2, 20)
    const useCase = new RemoveFromWishlist(wishlist)

    await useCase.execute({ userId: 1, itemId: owned.id })
    assert.lengthOf(wishlist.items, 1)

    await assert.rejects(() => useCase.execute({ userId: 1, itemId: foreign.id }))
    assert.lengthOf(wishlist.items, 1)
  })
})
