import { test } from '@japa/runner'

import { SearchPerfumes } from '#catalogue/application/search_perfumes'
import InMemoryCatalogueRepository from '../support/in_memory_catalogue_repository.js'

test.group('SearchPerfumes', () => {
  test('trims the search term', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryCatalogueRepository()
    const searchPerfumes = new SearchPerfumes(repository)

    // Act
    await searchPerfumes.execute({ search: '  Dior  ' })

    // Assert
    assert.equal(repository.lastSearchQuery?.search, 'Dior')
  })

  test('treats a blank search term as no search', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryCatalogueRepository()
    const searchPerfumes = new SearchPerfumes(repository)

    // Act
    await searchPerfumes.execute({ search: '   ' })

    // Assert
    assert.isNotNull(repository.lastSearchQuery)
    assert.isNull(repository.lastSearchQuery!.search)
  })

  test('applies default pagination', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryCatalogueRepository()
    const searchPerfumes = new SearchPerfumes(repository)

    // Act
    await searchPerfumes.execute({})

    // Assert
    assert.deepEqual(repository.lastSearchQuery, {
      search: null,
      page: 1,
      perPage: 20,
    })
  })

  test('clamps page and perPage to valid bounds', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryCatalogueRepository()
    const searchPerfumes = new SearchPerfumes(repository)

    // Act
    await searchPerfumes.execute({ page: 0, perPage: 500 })

    // Assert
    assert.deepEqual(repository.lastSearchQuery, {
      search: null,
      page: 1,
      perPage: 50,
    })
  })

  test('returns the page metadata it applied', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryCatalogueRepository()
    repository.addPerfume(1, 'N°5', 'Chanel')
    const searchPerfumes = new SearchPerfumes(repository)

    // Act
    const page = await searchPerfumes.execute({})

    // Assert
    assert.equal(page.total, 1)
    assert.equal(page.page, 1)
    assert.equal(page.perPage, 20)
    assert.deepEqual(
      page.items.map((perfume) => perfume.name),
      ['N°5']
    )
  })
})
