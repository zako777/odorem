import { test } from '@japa/runner'

import { RegisterUser } from '#user/application/register_user'
import { UserAlreadyExistsError } from '#user/domain/errors'
import InMemoryUserRepository from '../support/in_memory_user_repository.js'

test.group('RegisterUser', (group) => {
  let repository: InMemoryUserRepository
  let registerUser: RegisterUser

  group.each.setup(() => {
    repository = new InMemoryUserRepository()
    registerUser = new RegisterUser(repository)
  })

  test('registers a user with normalized email and name', async ({ assert }) => {
    // Arrange
    const input = {
      email: '  ALICE@example.com ',
      password: 'supersecret123',
      fullName: '  Alice GraphQL  ',
    }

    // Act
    const user = await registerUser.execute(input)

    // Assert
    assert.equal(user.email, 'alice@example.com')
    assert.equal(user.fullName, 'Alice GraphQL')
    assert.equal(repository.lastSavedInput?.password, 'supersecret123')
  })

  test('stores a null name when the name is empty', async ({ assert }) => {
    const user = await registerUser.execute({
      email: 'alice@example.com',
      password: 'supersecret123',
      fullName: '   ',
    })

    assert.isNull(user.fullName)
  })

  test('rejects an invalid email', async ({ assert }) => {
    await assert.rejects(
      () => registerUser.execute({ email: 'not-an-email', password: 'supersecret123' }),
      'A valid email is required.'
    )
  })

  test('rejects a password shorter than eight characters', async ({ assert }) => {
    await assert.rejects(
      () => registerUser.execute({ email: 'alice@example.com', password: 'short' }),
      'Password must contain between 8 and 32 characters.'
    )
  })

  test('rejects a password longer than 32 characters', async ({ assert }) => {
    await assert.rejects(
      () =>
        registerUser.execute({
          email: 'alice@example.com',
          password: 'a'.repeat(33),
        }),
      'Password must contain between 8 and 32 characters.'
    )
  })

  test('rejects a duplicate email', async ({ assert }) => {
    await registerUser.execute({ email: 'alice@example.com', password: 'supersecret123' })

    await assert.rejects(
      () => registerUser.execute({ email: ' ALICE@example.com ', password: 'anothersecret' }),
      UserAlreadyExistsError
    )
  })
})
