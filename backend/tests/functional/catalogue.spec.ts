import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import Concentration from '#models/concentration'
import Perfume from '#models/perfume'
import Product from '#models/product'

type GraphQLResponse<T> = {
  data?: T | null
  errors?: Array<{ message: string }>
}

const registerMutation = `
  mutation RegisterUser($input: RegisterUserInput!) {
    register(input: $input) { token }
  }
`

const perfumesQuery = `
  query Perfumes($search: String, $page: Int, $perPage: Int) {
    perfumes(search: $search, page: $page, perPage: $perPage) {
      items { id name brand description }
      total
      page
      perPage
    }
  }
`

const perfumeQuery = `
  query Perfume($id: Int!) {
    perfume(id: $id) {
      id
      name
      brand
      products {
        id
        volumeMl
        concentration { code label }
      }
    }
  }
`

type GraphQLClient = {
  post: (url: string) => {
    json: (body: Record<string, unknown>) => Promise<{ body: () => unknown }>
  }
}

async function registerAndGetToken(client: GraphQLClient) {
  const email = `catalogue-${Date.now()}-${Math.random()}@example.com`
  const response = await client.post('/graphql').json({
    query: registerMutation,
    variables: {
      input: {
        email,
        password: 'supersecret123',
        passwordConfirmation: 'supersecret123',
        fullName: 'Catalogue Tester',
      },
    },
  })
  return (response.body() as GraphQLResponse<{ register: { token: string } }>).data!.register.token
}

async function seedCatalogue() {
  const edt = await Concentration.create({ code: 'edt', label: 'Eau de toilette' })
  const edp = await Concentration.create({ code: 'edp', label: 'Eau de parfum' })
  const dior = await Perfume.create({ name: 'Sauvage', brand: 'Dior' })
  const chanel = await Perfume.create({ name: 'Bleu de Chanel', brand: 'Chanel' })
  await Product.create({ perfumeId: dior.id, concentrationId: edt.id, volumeMl: 50 })
  await Product.create({ perfumeId: dior.id, concentrationId: edp.id, volumeMl: 100 })
  await Product.create({ perfumeId: chanel.id, concentrationId: edp.id, volumeMl: 50 })
  return { dior, chanel }
}

test.group('GraphQL catalogue', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('rejects unauthenticated catalogue access', async ({ client, assert }) => {
    const response = await client.post('/graphql').json({
      query: perfumesQuery,
      variables: {},
    })

    response.assertStatus(200)
    const payload = response.body() as GraphQLResponse<unknown>

    assert.isArray(payload.errors)
    assert.isNull(payload.data)
  })

  test('searches perfumes by name or brand', async ({ client, assert }) => {
    // Arrange
    await seedCatalogue()
    const token = await registerAndGetToken(client)

    // Act & Assert: search by brand
    const byBrand = await client
      .post('/graphql')
      .header('authorization', `Bearer ${token}`)
      .json({ query: perfumesQuery, variables: { search: 'dior' } })
    const brandPayload = byBrand.body() as GraphQLResponse<{
      perfumes: { items: Array<{ name: string }>; total: number }
    }>

    assert.isUndefined(brandPayload.errors)
    assert.equal(brandPayload.data?.perfumes.total, 1)
    assert.equal(brandPayload.data?.perfumes.items[0].name, 'Sauvage')

    // Act & Assert: search by name
    const byName = await client
      .post('/graphql')
      .header('authorization', `Bearer ${token}`)
      .json({ query: perfumesQuery, variables: { search: 'bleu' } })
    const namePayload = byName.body() as GraphQLResponse<{
      perfumes: { items: Array<{ brand: string }>; total: number }
    }>

    assert.isUndefined(namePayload.errors)
    assert.equal(namePayload.data?.perfumes.items[0].brand, 'Chanel')
  })

  test('paginates the catalogue and applies page metadata', async ({ client, assert }) => {
    // Arrange
    await seedCatalogue()
    const token = await registerAndGetToken(client)

    // Act
    const response = await client
      .post('/graphql')
      .header('authorization', `Bearer ${token}`)
      .json({ query: perfumesQuery, variables: { page: 2, perPage: 1 } })
    const payload = response.body() as GraphQLResponse<{
      perfumes: { items: Array<{ name: string }>; total: number; page: number; perPage: number }
    }>

    // Assert
    assert.isUndefined(payload.errors)
    assert.equal(payload.data?.perfumes.total, 2)
    assert.equal(payload.data?.perfumes.items.length, 1)
    assert.equal(payload.data?.perfumes.page, 2)
    assert.equal(payload.data?.perfumes.perPage, 1)
  })

  test('returns a perfume with its products and concentrations', async ({ client, assert }) => {
    // Arrange
    const { dior } = await seedCatalogue()
    const token = await registerAndGetToken(client)

    // Act
    const response = await client
      .post('/graphql')
      .header('authorization', `Bearer ${token}`)
      .json({ query: perfumeQuery, variables: { id: dior.id } })
    const payload = response.body() as GraphQLResponse<{
      perfume: {
        name: string
        products: Array<{ volumeMl: number; concentration: { code: string } }>
      }
    }>

    // Assert
    assert.isUndefined(payload.errors)
    assert.equal(payload.data?.perfume.name, 'Sauvage')
    assert.lengthOf(payload.data?.perfume.products ?? [], 2)
    assert.equal(payload.data?.perfume.products[0].concentration.code, 'edt')
  })

  test('rejects an unknown perfume id', async ({ client, assert }) => {
    // Arrange
    const token = await registerAndGetToken(client)

    // Act
    const response = await client
      .post('/graphql')
      .header('authorization', `Bearer ${token}`)
      .json({ query: perfumeQuery, variables: { id: 9999 } })
    const payload = response.body() as GraphQLResponse<unknown>

    // Assert
    assert.isArray(payload.errors)
  })
})
