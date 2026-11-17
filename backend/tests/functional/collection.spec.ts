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

const myCollectionQuery = `
  query MyCollection($page: Int, $perPage: Int) {
    myCollection(page: $page, perPage: $perPage) {
      items {
        possession { id productId quantity condition rating comment }
        perfumeName
        brand
        concentrationCode
        volumeMl
      }
      total
      page
      perPage
    }
  }
`

const addMutation = `
  mutation AddToCollection($productId: Int!) {
    addToCollection(productId: $productId) { id productId quantity condition rating comment }
  }
`

const updateMutation = `
  mutation UpdatePossession($possessionId: Int!, $input: UpdatePossessionInput!) {
    updatePossession(possessionId: $possessionId, input: $input) { id quantity condition rating comment }
  }
`

const removeMutation = `
  mutation RemovePossession($possessionId: Int!) {
    removePossession(possessionId: $possessionId)
  }
`

type GraphQLClient = {
  post: (url: string) => {
    json: (body: Record<string, unknown>) => Promise<{ body: () => unknown }>
    header: (
      name: string,
      value: string
    ) => { json: (body: Record<string, unknown>) => Promise<{ body: () => unknown }> }
  }
}

async function registerAndGetToken(client: GraphQLClient) {
  const email = `collection-${Date.now()}-${Math.random()}@example.com`
  const response = await client.post('/graphql').json({
    query: registerMutation,
    variables: {
      input: {
        email,
        password: 'supersecret123',
        passwordConfirmation: 'supersecret123',
        fullName: 'Collection Tester',
      },
    },
  })
  return (response.body() as GraphQLResponse<{ register: { token: string } }>).data!.register.token
}

async function seedProduct() {
  const edp = await Concentration.create({ code: 'edp', label: 'Eau de parfum' })
  const perfume = await Perfume.create({ name: 'Sauvage', brand: 'Dior' })
  const product = await Product.create({
    perfumeId: perfume.id,
    concentrationId: edp.id,
    volumeMl: 100,
  })
  return product
}

async function gql(client: GraphQLClient, token: string, query: string, variables = {}) {
  const response = await client
    .post('/graphql')
    .header('authorization', `Bearer ${token}`)
    .json({ query, variables })
  return response.body() as GraphQLResponse<Record<string, unknown>>
}

test.group('GraphQL collection', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('rejects unauthenticated access to the collection', async ({ client, assert }) => {
    const response = await client.post('/graphql').json({ query: myCollectionQuery })

    const payload = response.body() as GraphQLResponse<unknown>
    assert.isArray(payload.errors)
    assert.isNull(payload.data)
  })

  test('adds a product and lists it with catalogue details', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)

    const added = await gql(client, token, addMutation, { productId: product.id })
    assert.isUndefined(added.errors)
    const possession = added.data?.addToCollection as { quantity: number; condition: string }
    assert.equal(possession.quantity, 1)
    assert.equal(possession.condition, 'new')

    const listed = await gql(client, token, myCollectionQuery)
    const items = (listed.data?.myCollection as { items: Array<Record<string, unknown>> }).items
    assert.lengthOf(items, 1)
    assert.equal(items[0].perfumeName, 'Sauvage')
    assert.equal(items[0].brand, 'Dior')
    assert.equal(items[0].concentrationCode, 'edp')
    assert.equal(items[0].volumeMl, 100)
  })

  test('adding the same product twice increments the quantity', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)

    await gql(client, token, addMutation, { productId: product.id })
    const second = await gql(client, token, addMutation, { productId: product.id })

    const possession = second.data?.addToCollection as { quantity: number }
    assert.equal(possession.quantity, 2)

    const listed = await gql(client, token, myCollectionQuery)
    assert.equal((listed.data?.myCollection as { total: number }).total, 1)
  })

  test('concurrent adds of the same product stay atomic', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)

    const results = await Promise.all([
      gql(client, token, addMutation, { productId: product.id }),
      gql(client, token, addMutation, { productId: product.id }),
    ])
    results.forEach((result) => assert.isUndefined(result.errors))

    const listed = await gql(client, token, myCollectionQuery)
    const collection = listed.data?.myCollection as {
      items: Array<{ possession: { quantity: number } }>
      total: number
    }
    assert.equal(collection.total, 1)
    assert.equal(collection.items[0].possession.quantity, 2)
  })

  test('rejects adding an unknown product', async ({ client, assert }) => {
    const token = await registerAndGetToken(client)

    const payload = await gql(client, token, addMutation, { productId: 9999 })

    assert.isArray(payload.errors)
  })

  test('updates personal data and enforces isolation between users', async ({ client, assert }) => {
    const product = await seedProduct()
    const tokenA = await registerAndGetToken(client)
    const tokenB = await registerAndGetToken(client)

    const added = await gql(client, tokenA, addMutation, { productId: product.id })
    const possessionId = Number((added.data?.addToCollection as { id: string }).id)

    // User A updates their possession.
    const updated = await gql(client, tokenA, updateMutation, {
      possessionId,
      input: { condition: 'opened', rating: 4, comment: 'Blind buy réussi' },
    })
    const possession = updated.data?.updatePossession as {
      condition: string
      rating: number
      comment: string
    }
    assert.isUndefined(updated.errors)
    assert.equal(possession.condition, 'opened')
    assert.equal(possession.rating, 4)
    assert.equal(possession.comment, 'Blind buy réussi')

    // User B cannot update it.
    const forbidden = await gql(client, tokenB, updateMutation, {
      possessionId,
      input: { rating: 5 },
    })
    assert.isArray(forbidden.errors)

    // User B has an empty collection.
    const collectionB = await gql(client, tokenB, myCollectionQuery)
    assert.equal((collectionB.data?.myCollection as { total: number }).total, 0)
  })

  test('rejects an out-of-range rating', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)
    const added = await gql(client, token, addMutation, { productId: product.id })
    const possessionId = Number((added.data?.addToCollection as { id: string }).id)

    const payload = await gql(client, token, updateMutation, {
      possessionId,
      input: { rating: 6 },
    })

    assert.isArray(payload.errors)
  })

  test('removes an owned possession only', async ({ client, assert }) => {
    const product = await seedProduct()
    const tokenA = await registerAndGetToken(client)
    const tokenB = await registerAndGetToken(client)
    const added = await gql(client, tokenA, addMutation, { productId: product.id })
    const possessionId = Number((added.data?.addToCollection as { id: string }).id)

    // User B cannot remove it.
    const forbidden = await gql(client, tokenB, removeMutation, { possessionId })
    assert.isArray(forbidden.errors)

    // User A removes it.
    const removed = await gql(client, tokenA, removeMutation, { possessionId })
    assert.isUndefined(removed.errors)
    assert.equal(removed.data?.removePossession, true)

    const listed = await gql(client, tokenA, myCollectionQuery)
    assert.equal((listed.data?.myCollection as { total: number }).total, 0)
  })
})
