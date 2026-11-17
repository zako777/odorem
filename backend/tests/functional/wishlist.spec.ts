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

const myWishlistQuery = `
  query MyWishlist($page: Int, $perPage: Int) {
    myWishlist(page: $page, perPage: $perPage) {
      items { id productId perfumeName brand concentrationCode volumeMl }
      total
      page
      perPage
    }
  }
`

const myCollectionQuery = `
  query MyCollection {
    myCollection {
      items { possession { id productId quantity } }
      total
    }
  }
`

const addWishlistMutation = `
  mutation AddToWishlist($productId: Int!) {
    addToWishlist(productId: $productId) { id productId }
  }
`

const removeWishlistMutation = `
  mutation RemoveFromWishlist($itemId: Int!) {
    removeFromWishlist(itemId: $itemId)
  }
`

const moveWishlistMutation = `
  mutation MoveWishlistToCollection($itemId: Int!) {
    moveWishlistToCollection(itemId: $itemId)
  }
`

const addCollectionMutation = `
  mutation AddToCollection($productId: Int!) {
    addToCollection(productId: $productId) { quantity }
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
  const email = `wishlist-${Date.now()}-${Math.random()}@example.com`
  const response = await client.post('/graphql').json({
    query: registerMutation,
    variables: {
      input: {
        email,
        password: 'supersecret123',
        passwordConfirmation: 'supersecret123',
        fullName: 'Wishlist Tester',
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

test.group('GraphQL wishlist', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('rejects unauthenticated access to the wishlist', async ({ client, assert }) => {
    const response = await client.post('/graphql').json({ query: myWishlistQuery })

    const payload = response.body() as GraphQLResponse<unknown>
    assert.isArray(payload.errors)
    assert.isNull(payload.data)
  })

  test('adds a product and lists it with catalogue details', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)

    const added = await gql(client, token, addWishlistMutation, { productId: product.id })
    assert.isUndefined(added.errors)
    assert.equal((added.data?.addToWishlist as { productId: string }).productId, String(product.id))

    const listed = await gql(client, token, myWishlistQuery)
    const items = (listed.data?.myWishlist as { items: Array<Record<string, unknown>> }).items
    assert.lengthOf(items, 1)
    assert.equal(items[0].perfumeName, 'Sauvage')
    assert.equal(items[0].brand, 'Dior')
    assert.equal(items[0].concentrationCode, 'edp')
    assert.equal(items[0].volumeMl, 100)
  })

  test('a repeated add keeps a single wishlist entry', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)

    await gql(client, token, addWishlistMutation, { productId: product.id })
    const second = await gql(client, token, addWishlistMutation, { productId: product.id })

    assert.isUndefined(second.errors)
    const listed = await gql(client, token, myWishlistQuery)
    assert.equal((listed.data?.myWishlist as { total: number }).total, 1)
  })

  test('rejects adding an unknown product', async ({ client, assert }) => {
    const token = await registerAndGetToken(client)

    const payload = await gql(client, token, addWishlistMutation, { productId: 9999 })

    assert.isArray(payload.errors)
  })

  test('isolates wishlists between users', async ({ client, assert }) => {
    const product = await seedProduct()
    const tokenA = await registerAndGetToken(client)
    const tokenB = await registerAndGetToken(client)

    const added = await gql(client, tokenA, addWishlistMutation, { productId: product.id })
    const itemId = Number((added.data?.addToWishlist as { id: string }).id)

    // User B cannot remove or move it.
    const forbiddenRemove = await gql(client, tokenB, removeWishlistMutation, { itemId })
    assert.isArray(forbiddenRemove.errors)
    const forbiddenMove = await gql(client, tokenB, moveWishlistMutation, { itemId })
    assert.isArray(forbiddenMove.errors)

    // User B has an empty wishlist, user A still has their item.
    const wishlistB = await gql(client, tokenB, myWishlistQuery)
    assert.equal((wishlistB.data?.myWishlist as { total: number }).total, 0)
    const wishlistA = await gql(client, tokenA, myWishlistQuery)
    assert.equal((wishlistA.data?.myWishlist as { total: number }).total, 1)
  })

  test('removes an owned item', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)
    const added = await gql(client, token, addWishlistMutation, { productId: product.id })
    const itemId = Number((added.data?.addToWishlist as { id: string }).id)

    const removed = await gql(client, token, removeWishlistMutation, { itemId })

    assert.isUndefined(removed.errors)
    assert.equal(removed.data?.removeFromWishlist, true)
    const listed = await gql(client, token, myWishlistQuery)
    assert.equal((listed.data?.myWishlist as { total: number }).total, 0)
  })

  test('moves an item into the collection and clears the wishlist', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)
    const added = await gql(client, token, addWishlistMutation, { productId: product.id })
    const itemId = Number((added.data?.addToWishlist as { id: string }).id)

    const moved = await gql(client, token, moveWishlistMutation, { itemId })
    assert.isUndefined(moved.errors)
    assert.equal(moved.data?.moveWishlistToCollection, true)

    const wishlist = await gql(client, token, myWishlistQuery)
    assert.equal((wishlist.data?.myWishlist as { total: number }).total, 0)

    const collection = await gql(client, token, myCollectionQuery)
    const items = (
      collection.data?.myCollection as { items: Array<{ possession: { quantity: number } }> }
    ).items
    assert.lengthOf(items, 1)
    assert.equal(items[0].possession.quantity, 1)
  })

  test('moving into an existing possession increments its quantity', async ({ client, assert }) => {
    const product = await seedProduct()
    const token = await registerAndGetToken(client)
    await gql(client, token, addCollectionMutation, { productId: product.id })
    const added = await gql(client, token, addWishlistMutation, { productId: product.id })
    const itemId = Number((added.data?.addToWishlist as { id: string }).id)

    const moved = await gql(client, token, moveWishlistMutation, { itemId })

    assert.isUndefined(moved.errors)
    const collection = await gql(client, token, myCollectionQuery)
    const items = (
      collection.data?.myCollection as { items: Array<{ possession: { quantity: number } }> }
    ).items
    assert.lengthOf(items, 1)
    assert.equal(items[0].possession.quantity, 2)
    const wishlist = await gql(client, token, myWishlistQuery)
    assert.equal((wishlist.data?.myWishlist as { total: number }).total, 0)
  })
})
