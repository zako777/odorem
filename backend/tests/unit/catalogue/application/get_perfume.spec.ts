import { test } from '@japa/runner'

import { GetPerfume } from '#catalogue/application/get_perfume'
import { ListProductsByPerfume } from '#catalogue/application/list_products_by_perfume'
import { PerfumeNotFoundError } from '#catalogue/domain/errors'
import InMemoryCatalogueRepository from '../support/in_memory_catalogue_repository.js'

test.group('GetPerfume', () => {
  test('returns the perfume for a known id', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryCatalogueRepository()
    repository.addPerfume(1, "J'adore", 'Dior')
    const getPerfume = new GetPerfume(repository)

    // Act
    const perfume = await getPerfume.execute(1)

    // Assert
    assert.equal(perfume.name, "J'adore")
  })

  test('rejects an unknown id', async ({ assert }) => {
    // Arrange
    const getPerfume = new GetPerfume(new InMemoryCatalogueRepository())

    // Act & Assert
    await assert.rejects(() => getPerfume.execute(42), PerfumeNotFoundError)
  })
})

test.group('ListProductsByPerfume', () => {
  test('returns only the products of the given perfume', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryCatalogueRepository()
    repository.addProduct(1, 10, 50)
    repository.addProduct(2, 10, 100)
    repository.addProduct(3, 20, 50)
    const listProducts = new ListProductsByPerfume(repository)

    // Act
    const products = await listProducts.execute(10)

    // Assert
    assert.deepEqual(
      products.map((product) => product.id),
      [1, 2]
    )
    assert.equal(products[0].concentration.code, 'edp')
  })
})
