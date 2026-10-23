import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

import { LoginUser } from '#user/application/login_user'
import { InvalidCredentialsError } from '#user/domain/errors'
import { UserEntity } from '#user/domain/user'
import InMemoryUserRepository from '../support/in_memory_user_repository.js'

test.group('LoginUser', () => {
  test('authenticates with a normalized email and valid password', async ({ assert }) => {
    // Arrange
    const repository = new InMemoryUserRepository()
    repository.users.push(
      new UserEntity(1, 'alice@example.com', 'Alice', await hash.make('supersecret123'))
    )
    const loginUser = new LoginUser(repository)

    // Act
    const user = await loginUser.execute({
      email: ' ALICE@example.com ',
      password: 'supersecret123',
    })

    // Assert
    assert.equal(user.email, 'alice@example.com')
  })

  test('rejects an unknown email', async ({ assert }) => {
    const loginUser = new LoginUser(new InMemoryUserRepository())

    await assert.rejects(
      () => loginUser.execute({ email: 'missing@example.com', password: 'supersecret123' }),
      InvalidCredentialsError
    )
  })

  test('rejects an invalid password', async ({ assert }) => {
    const repository = new InMemoryUserRepository()
    repository.users.push(
      new UserEntity(1, 'alice@example.com', 'Alice', await hash.make('supersecret123'))
    )
    const loginUser = new LoginUser(repository)

    await assert.rejects(
      () => loginUser.execute({ email: 'alice@example.com', password: 'wrongsecret' }),
      InvalidCredentialsError
    )
  })
})
