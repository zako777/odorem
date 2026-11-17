import { test } from '@japa/runner'

import { FindProductByBarcode } from '#catalogue/application/find_product_by_barcode'
import InMemoryCatalogueRepository from './support/in_memory_catalogue_repository.js'

test.group('Find product by barcode', () => {
  test('returns the product and its perfume for a known code', async ({ assert }) => {
    const repository = new InMemoryCatalogueRepository()
    repository.addPerfume(1, 'Sauvage', 'Dior')
    repository.addProduct(10, 1, 100)
    repository.addBarcode('0123456789012', 10)
    const useCase = new FindProductByBarcode(repository)

    const result = await useCase.execute('0123456789012')

    assert.deepEqual(result, {
      productId: 10,
      volumeMl: 100,
      concentrationCode: 'edp',
      concentrationLabel: 'Eau de parfum',
      perfumeId: 1,
      perfumeName: 'Sauvage',
      brand: 'Dior',
    })
  })

  test('returns null for an unknown code', async ({ assert }) => {
    const repository = new InMemoryCatalogueRepository()
    const useCase = new FindProductByBarcode(repository)

    assert.isNull(await useCase.execute('0123456789012'))
  })
})
