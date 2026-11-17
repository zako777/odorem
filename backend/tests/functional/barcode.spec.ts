import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

import Barcode from '#models/barcode'
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

const productByBarcodeQuery = `
  query ProductByBarcode($code: String!) {
    productByBarcode(code: $code) {
      productId
      volumeMl
      concentrationCode
      concentrationLabel
      perfumeId
      perfumeName
      brand
    }
  }
`

// Fake EAN-13 used by tests only.
const TEST_CODE = '0123456789012'

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
  const email = `barcode-${Date.now()}-${Math.random()}@example.com`
  const response = await client.post('/graphql').json({
    query: registerMutation,
    variables: {
      input: {
        email,
        password: 'supersecret123',
        passwordConfirmation: 'supersecret123',
        fullName: 'Barcode Tester',
      },
    },
  })
  return (response.body() as GraphQLResponse<{ register: { token: string } }>).data!.register.token
}

async function seedProductWithBarcode() {
  const edp = await Concentration.create({ code: 'edp', label: 'Eau de parfum' })
  const perfume = await Perfume.create({ name: 'Sauvage', brand: 'Dior' })
  const product = await Product.create({
    perfumeId: perfume.id,
    concentrationId: edp.id,
    volumeMl: 100,
  })
  await Barcode.create({ code: TEST_CODE, productId: product.id })
  return product
}

async function gql(client: GraphQLClient, token: string, query: string, variables = {}) {
  const response = await client
    .post('/graphql')
    .header('authorization', `Bearer ${token}`)
    .json({ query, variables })
  return response.body() as GraphQLResponse<Record<string, unknown>>
}

test.group('GraphQL barcode lookup', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('rejects unauthenticated access', async ({ client, assert }) => {
    const response = await client
      .post('/graphql')
      .json({ query: productByBarcodeQuery, variables: { code: TEST_CODE } })

    const payload = response.body() as GraphQLResponse<{ productByBarcode: unknown }>
    assert.isArray(payload.errors)
    assert.isNull(payload.data?.productByBarcode)
  })

  test('returns the product for a known code, leading zeros preserved', async ({
    client,
    assert,
  }) => {
    const product = await seedProductWithBarcode()
    const token = await registerAndGetToken(client)

    const payload = await gql(client, token, productByBarcodeQuery, { code: TEST_CODE })

    assert.isUndefined(payload.errors)
    assert.deepEqual(payload.data?.productByBarcode, {
      productId: String(product.id),
      volumeMl: 100,
      concentrationCode: 'edp',
      concentrationLabel: 'Eau de parfum',
      perfumeId: String(product.perfumeId),
      perfumeName: 'Sauvage',
      brand: 'Dior',
    })
  })

  test('returns null for an unknown code', async ({ client, assert }) => {
    const token = await registerAndGetToken(client)

    const payload = await gql(client, token, productByBarcodeQuery, { code: '0123456789019' })

    assert.isUndefined(payload.errors)
    assert.isNull(payload.data?.productByBarcode)
  })

  test('rejects a malformed code', async ({ client, assert }) => {
    const token = await registerAndGetToken(client)

    const payload = await gql(client, token, productByBarcodeQuery, { code: 'ABC' })

    assert.isArray(payload.errors)
  })
})
