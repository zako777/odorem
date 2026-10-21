

---
name: adonisjs-graphql-e2e-testing
description: Use when writing an end-to-end (e2e) test for a GraphQL query, mutation, field resolver or authorization rule in an AdonisJS project using @foadonis/graphql, Japa and Lucid. Enforces one fixed test structure (setup, factories, operation, assertions on response and database).
---

# AdonisJS GraphQL: e2e Test Workflow

Docs:
- GraphQL testing: https://friendsofadonis.com/docs/graphql/testing
- Lucid testing utilities: https://lucid.adonisjs.com/docs/testing
- Lucid factories: https://lucid.adonisjs.com/docs/model-factories

## Core principle

An e2e GraphQL test sends a **real operation through the real HTTP stack** (middleware, auth, resolver, use case, repository, database) and asserts on **both** the GraphQL response and the database state. No mocking of the app's own layers.

## What e2e covers (and what it does not)

| Test type | Where | Covers |
|---|---|---|
| Unit | `tests/unit` | Domain entities, use cases with an in-memory repository |
| **e2e (this skill)** | `tests/e2e/graphql/<module>` | One GraphQL operation, end to end, with a real database |

Do not re-test business rules here that are already covered by unit tests. Cover: happy path, unauthenticated, forbidden, validation/not found.

## One-time setup

### 1. Register the e2e suite in `adonisrc.ts`

```ts
tests: {
  suites: [
    { files: ['tests/unit/**/*.spec(.ts|.js)'], name: 'unit', timeout: 2000 },
    { files: ['tests/e2e/**/*.spec(.ts|.js)'], name: 'e2e', timeout: 10000 },
  ],
}
```

### 2. Register the plugins and the migration hook in `tests/bootstrap.ts`

```ts
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import { dbAssertions } from '@adonisjs/lucid/plugins/japa/db'
import { graphqlApiClient } from '@foadonis/graphql/plugins/api_client'
import type { Config } from '@japa/runner/types'

export const plugins: Config['plugins'] = [
  assert(),
  apiClient(),
  pluginAdonisJS(app),
  authApiClient(app),        // enables .loginAs(user)
  dbAssertions(app),         // enables the `db` helper in the test context
  graphqlApiClient(app),     // enables client.query / client.mutate
]

export const runnerHooks = {
  setup: [() => testUtils.db().migrate()],   // migration:run once, migration:reset at the end
  teardown: [],
}
```

Notes:
- `graphqlApiClient` requires `apiClient()`.
- Requests go to the route named `graphql` (registered by `graphql.registerRoute(router)` in `start/routes.ts`). For a custom path use `graphqlApiClient(app, { path: '/api/graphql' })`.
- Use a **separate test database** (set it in `.env.test`). Never run tests against dev or production data.
- The GraphQL server starts on the first GraphQL request and stops at the end of the run.

## Workflow: write an e2e test

Follow these steps in this exact order.

### Step 1. Create a factory for the Lucid model (once per model)

Factories use the infrastructure model, not the domain entity.

```bash
node ace make:factory RecipeModel
```

`database/factories/recipe_factory.ts`

```ts
import { Factory } from '@adonisjs/lucid/factories'
import RecipeModel from '#modules/recipes/infrastructure/recipe_model'

export const RecipeFactory = Factory.define(RecipeModel, ({ faker }) => ({
  title: faker.lorem.words(3),
  description: faker.lorem.sentence(),
})).build()
```

Return every required column, otherwise the insert fails with a `NOT NULL` error. Add named states with `.state('published', (r) => { ... })` before `.build()`.

### Step 2. Create the test file

Path: `tests/e2e/graphql/<module>/<operation>.spec.ts` (one file per operation, snake_case, named after the operation, e.g. `create_recipe.spec.ts`).

### Step 3. Use this exact skeleton

```ts
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { RecipeFactory } from '#database/factories/recipe_factory'

test.group('GraphQL | createRecipe', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('creates a recipe for an authenticated user', async ({ client, db }) => {
    // Arrange
    const user = await UserFactory.create()

    // Act
    const response = await client
      .mutate(
        `mutation CreateRecipe($data: CreateRecipeInput!) {
          createRecipe(data: $data) { id title }
        }`,
        { data: { title: 'Pancakes' } }
      )
      .loginAs(user)

    // Assert: GraphQL response
    response.assertNoErrors()
    response.assertDataContains({ createRecipe: { title: 'Pancakes' } })

    // Assert: database state
    await db.assertHas('recipes', { title: 'Pancakes', author_id: user.id }, 1)
  })

  test('rejects an unauthenticated user', async ({ client, db }) => {
    const response = await client.mutate(
      `mutation { createRecipe(data: { title: "Pancakes" }) { id } }`
    )

    response.assertErrors()
    await db.assertEmpty('recipes')
  })
})
```

Rules for the skeleton:
- **Arrange / Act / Assert** comments in every test.
- Operation documents are written with **named operations and variables** (`$data`), never string-interpolated values.
- Always assert on the response **and** on the database for mutations.
- Always add the unauthenticated case for any operation protected by `@Authorized` / `@CurrentUser`.

## Database isolation

| Helper | Use when |
|---|---|
| `testUtils.db().wrapInGlobalTransaction()` | Default. Fastest: opens a transaction before each test, rolls back after. (`withGlobalTransaction()` is a deprecated alias.) |
| `testUtils.db().truncate()` | Fallback if a test needs committed data (multiple concurrent transactions, subprocesses, workers). |
| `testUtils.db().seed()` | Test depends on seeded reference data. Pair with `truncate()` and return its cleanup. |

Register in `group.each.setup(...)`. Never mix both isolation helpers in the same group.

## Recipes by operation type

### Query

```ts
test('returns a recipe by id', async ({ client }) => {
  const recipe = await RecipeFactory.create()

  const response = await client.query(
    `query Recipe($id: Int!) { recipe(id: $id) { id title } }`,
    { id: recipe.id }
  )

  response.assertNoErrors()
  response.assertDataContains({ recipe: { title: recipe.title } })
})
```

### Not found / domain error

```ts
test('fails when the recipe does not exist', async ({ client }) => {
  const response = await client.query(`query { recipe(id: 999999) { id } }`)

  response.assertErrors()
  response.assertErrorMessage(/not found/i)
})
```

### Authorization (Bouncer ability or policy)

```ts
test('forbids a non-admin', async ({ client }) => {
  const user = await UserFactory.create()

  const response = await client.query(`query { adminStats { total } }`).loginAs(user)

  response.assertErrors()
  response.assertErrorCode('FORBIDDEN')   // check the exact code your app returns
})
```

`assertErrorCode` matches `extensions.code`. Run the test once with `response.dumpErrors()` to see the real code, then hard-code it.

### Field resolver (relation)

```ts
test('resolves the author lazily', async ({ client }) => {
  const user = await UserFactory.create()
  const recipe = await RecipeFactory.merge({ authorId: user.id }).create()

  const response = await client.query(
    `query Recipe($id: Int!) { recipe(id: $id) { title author { id } } }`,
    { id: recipe.id }
  )

  response.assertNoErrors()
  response.assertDataContains({ recipe: { author: { id: String(user.id) } } })
})
```

`ID` fields are serialized as strings in the response.

### Pagination / lists

Create the rows with `RecipeFactory.createMany(5)`, request a page size, and assert on `response.data.recipes.length` with `assert.lengthOf(...)`.

### Operation name (document with several operations)

```ts
client.query(`query First { a } query Second { b }`).operationName('Second')
```

### File upload

`client.mutate(...).upload('file', file)`. Uploads are supported by the **Yoga driver only** (fails explicitly with Apollo).

### Custom headers

```ts
client.query(`query { me { email } }`).loginAs(user).header('Accept-Language', 'fr')
```

## Assertion cheat sheet

| Goal | Assertion |
|---|---|
| No GraphQL errors | `response.assertNoErrors()` |
| Data equals exactly | `response.assertData({...})` |
| Data contains a subset | `response.assertDataContains({...})` |
| At least one error / exactly N | `response.assertErrors()` / `response.assertErrors(2)` |
| Error code | `response.assertErrorCode('UNAUTHENTICATED')` |
| Error message (string or regex) | `response.assertErrorMessage(/Access denied/)` |
| Row exists (optionally N times) | `await db.assertHas('table', { col: value }, n?)` |
| Row missing | `await db.assertMissing('table', { col: value })` |
| Table size | `await db.assertCount('table', n)` / `await db.assertEmpty('table')` |
| Model row exists / deleted | `await db.assertModelExists(model)` / `await db.assertModelMissing(model)` |
| Debug | `response.dumpErrors()` and `request.dumpBody()` |

`assertNoErrors` also fails when the response is not a GraphQL body (for example a 404 from a wrong path), so a broken setup never passes silently. `db.assert*` column names use the **database** names (`author_id`), not the model property names (`authorId`).

## Optional: typed documents

If you use GraphQL Code Generator, pass the generated `TypedDocumentNode` instead of a string. `response.data` and the variables become typed:

```ts
import { RecipeDocument } from '#graphql/generated'
const response = await client.query(RecipeDocument, { id: 1 })
```

## Hard rules

1. One spec file per GraphQL operation, in `tests/e2e/graphql/<module>/`.
2. Every test is isolated (`wrapInGlobalTransaction` or `truncate`), never relies on another test's data.
3. Data is created with factories, never with hand-written inserts.
4. Mutations assert on the response AND the database.
5. Every protected operation has an unauthenticated test and, if it uses abilities/policies, a forbidden test.
6. Variables are passed as the second argument, never concatenated into the document.
7. Tests run against a dedicated test database.
8. Do not mock use cases, repositories or resolvers in e2e tests.

## Checklist before finishing

- [ ] Spec file located in `tests/e2e/graphql/<module>/<operation>.spec.ts`
- [ ] `group.each.setup` registers a database isolation helper
- [ ] Factories used for all test data
- [ ] Happy path + unauthenticated (+ forbidden / not found when relevant)
- [ ] Response asserted (`assertNoErrors` + `assertData*`) and database asserted (`db.assert*`)
- [ ] `node ace test e2e` passes