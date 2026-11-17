import { test } from '@japa/runner'

import { AddToCollection } from '#collection/application/add_to_collection'
import { ListCollection } from '#collection/application/list_collection'
import { RemovePossession } from '#collection/application/remove_possession'
import { UpdatePossession } from '#collection/application/update_possession'
import InMemoryCatalogueRepository from '../catalogue/support/in_memory_catalogue_repository.js'
import InMemoryCollectionRepository from './support/in_memory_collection_repository.js'

test.group('Collection use cases', () => {
  test('adds a known product to the collection', async ({ assert }) => {
    const catalogue = new InMemoryCatalogueRepository()
    catalogue.addProduct(10, 1, 100)
    const collection = new InMemoryCollectionRepository()
    const useCase = new AddToCollection(collection, catalogue)

    const possession = await useCase.execute({ userId: 1, productId: 10 })

    assert.equal(possession.productId, 10)
    assert.equal(possession.quantity, 1)
    assert.equal(possession.condition, 'new')
  })

  test('increments the quantity when adding the same product twice', async ({ assert }) => {
    const catalogue = new InMemoryCatalogueRepository()
    catalogue.addProduct(10, 1, 100)
    const collection = new InMemoryCollectionRepository()
    const useCase = new AddToCollection(collection, catalogue)

    await useCase.execute({ userId: 1, productId: 10 })
    const second = await useCase.execute({ userId: 1, productId: 10 })

    assert.lengthOf(collection.possessions, 1)
    assert.equal(second.quantity, 2)
  })

  test('rejects an unknown product', async ({ assert }) => {
    const catalogue = new InMemoryCatalogueRepository()
    const collection = new InMemoryCollectionRepository()
    const useCase = new AddToCollection(collection, catalogue)

    await assert.rejects(() => useCase.execute({ userId: 1, productId: 999 }))
    assert.lengthOf(collection.possessions, 0)
  })

  test('keeps collections isolated between users', async ({ assert }) => {
    const collection = new InMemoryCollectionRepository()
    await collection.add(1, 10)
    await collection.add(2, 10)
    const useCase = new ListCollection(collection)

    const result = await useCase.execute({ userId: 1, page: null, perPage: null })

    assert.equal(result.total, 1)
    assert.equal(result.items[0].possession.userId, 1)
  })

  test('updates personal data of an owned possession only', async ({ assert }) => {
    const collection = new InMemoryCollectionRepository()
    const owned = await collection.add(1, 10)
    const foreign = await collection.add(2, 20)
    const useCase = new UpdatePossession(collection)

    const updated = await useCase.execute({
      userId: 1,
      possessionId: owned.id,
      changes: { condition: 'opened', rating: 4, comment: 'Blind buy réussi' },
    })
    assert.equal(updated.condition, 'opened')
    assert.equal(updated.rating, 4)
    assert.equal(updated.comment, 'Blind buy réussi')

    await assert.rejects(() =>
      useCase.execute({ userId: 1, possessionId: foreign.id, changes: { rating: 5 } })
    )
  })

  test('removes an owned possession only', async ({ assert }) => {
    const collection = new InMemoryCollectionRepository()
    const owned = await collection.add(1, 10)
    const foreign = await collection.add(2, 20)
    const useCase = new RemovePossession(collection)

    await useCase.execute({ userId: 1, possessionId: owned.id })
    assert.lengthOf(collection.possessions, 1)

    await assert.rejects(() => useCase.execute({ userId: 1, possessionId: foreign.id }))
    assert.lengthOf(collection.possessions, 1)
  })
})
