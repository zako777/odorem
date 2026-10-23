import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

type GraphQLResponse<T> = {
  data?: T | null
  errors?: Array<{ message: string }>
}

type AuthPayload = {
  user: {
    id: string
    email: string
    fullName: string | null
  }
  token: string
}

const registerMutation = `
  mutation RegisterUser($input: RegisterUserInput!) {
    register(input: $input) {
      user { id email fullName }
      token
    }
  }
`

const registerVariables = (email: string, fullName: string) => ({
  input: {
    email,
    password: 'supersecret123',
    passwordConfirmation: 'supersecret123',
    fullName,
  },
})

test.group('GraphQL user auth', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('registers a user through GraphQL', async ({ client, assert }) => {
    const email = `register-${Date.now()}@example.com`
    const response = await client.post('/graphql').json({
      query: registerMutation,
      variables: registerVariables(email, 'Alice GraphQL'),
    })

    response.assertStatus(200)
    const payload = response.body() as GraphQLResponse<{ register: AuthPayload }>

    assert.isUndefined(payload.errors)
    assert.equal(payload.data?.register.user.email, email)
    assert.equal(payload.data?.register.user.fullName, 'Alice GraphQL')
    assert.isTrue(Boolean(payload.data?.register.token))
  })

  test('logs in a registered user through GraphQL', async ({ client, assert }) => {
    const email = `login-${Date.now()}@example.com`
    await client.post('/graphql').json({
      query: registerMutation,
      variables: registerVariables(email, 'Login User'),
    })

    const response = await client.post('/graphql').json({
      query: `
        mutation LoginUser($input: LoginUserInput!) {
          login(input: $input) {
            user { id email fullName }
            token
          }
        }
      `,
      variables: { input: { email, password: 'supersecret123' } },
    })

    response.assertStatus(200)
    const payload = response.body() as GraphQLResponse<{ login: AuthPayload }>

    assert.equal(payload.data?.login.user.email, email)
    assert.equal(payload.data?.login.user.fullName, 'Login User')
    assert.isTrue(Boolean(payload.data?.login.token))
  })

  test('rejects an unauthenticated profile query', async ({ client, assert }) => {
    const response = await client.post('/graphql').json({
      query: 'query Me { me { id email fullName } }',
    })

    response.assertStatus(200)
    const payload = response.body() as GraphQLResponse<unknown>

    assert.isArray(payload.errors)
    assert.isNull(payload.data)
  })

  test('returns only the profile represented by the access token', async ({ client, assert }) => {
    const firstEmail = `first-${Date.now()}@example.com`
    const secondEmail = `second-${Date.now()}@example.com`
    const first = await client.post('/graphql').json({
      query: registerMutation,
      variables: registerVariables(firstEmail, 'First User'),
    })
    await client.post('/graphql').json({
      query: registerMutation,
      variables: registerVariables(secondEmail, 'Second User'),
    })
    const firstToken = (first.body() as GraphQLResponse<{ register: AuthPayload }>).data!.register.token

    const response = await client
      .post('/graphql')
      .header('authorization', `Bearer ${firstToken}`)
      .json({ query: 'query Me { me { id email fullName } }' })

    response.assertStatus(200)
    const payload = response.body() as GraphQLResponse<{ me: AuthPayload['user'] }>

    assert.isUndefined(payload.errors)
    assert.equal(payload.data?.me.email, firstEmail)
    assert.notEqual(payload.data?.me.email, secondEmail)
  })

  test('rejects an invalid access token', async ({ client, assert }) => {
    const response = await client
      .post('/graphql')
      .header('authorization', 'Bearer invalid-token')
      .json({ query: 'query Me { me { id email fullName } }' })

    response.assertStatus(200)
    const payload = response.body() as GraphQLResponse<unknown>

    assert.isArray(payload.errors)
    assert.isNull(payload.data)
  })
})
