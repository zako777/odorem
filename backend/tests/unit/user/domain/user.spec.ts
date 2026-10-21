import { test } from '@japa/runner'

import { UserEntity } from '#user/domain/user'

test.group('UserEntity', () => {
  test('creates a public profile without exposing the password hash', ({ assert }) => {
    const user = UserEntity.fromPersistence({
      id: 1,
      email: 'alice@example.com',
      fullName: 'Alice',
      passwordHash: 'secret-hash',
    })

    const profile = user.toPublic()

    assert.deepEqual(profile, {
      id: 1,
      email: 'alice@example.com',
      fullName: 'Alice',
    })
    assert.notProperty(profile, 'passwordHash')
  })

  test('preserves a nullable full name', ({ assert }) => {
    const user = UserEntity.fromPersistence({
      id: 2,
      email: 'bob@example.com',
      fullName: null,
      passwordHash: 'secret-hash',
    })

    assert.isNull(user.toPublic().fullName)
  })
})
