---
name: adonisjs-unit-testing
description: Use when writing or updating unit tests in an AdonisJS project with Japa - domain entities, use cases, validators, services, mail classes, and code that needs test doubles (fakes, container swaps, frozen time). Enforces one fixed structure, naming, and test-double policy. For GraphQL end-to-end tests, use the adonisjs-graphql-e2e-testing skill instead.
---

# AdonisJS Unit Testing Workflow (Japa)

Docs:
- Introduction: https://docs.adonisjs.com/guides/testing/introduction
- Test doubles: https://docs.adonisjs.com/guides/testing/test-doubles
- Resetting state: https://docs.adonisjs.com/guides/testing/resetting-state-between-tests

## Core principle

A unit test checks **one isolated piece of code** (an entity, a use case, a validator, a service) fast and deterministically. Own abstractions (repository ports) are replaced by in-memory fakes. **External systems** (mail, payment, third-party APIs, storage, time) are replaced by test doubles. **Internal database queries are never mocked**: if a test needs the database, hit the real test database.

## What is a unit test here, and what is not

| Subject | Test type | DB | Location |
|---|---|---|---|
| Domain entity / value object | Unit | No | `tests/unit/<module>/domain/` |
| Use case (with in-memory repository) | Unit | No | `tests/unit/<module>/application/` |
| VineJS validator | Unit | No | `tests/unit/<module>/validators/` |
| Mail class (build only) | Unit | Only if factories are needed | `tests/unit/mails/` |
| Repository implementation (Lucid) | Unit with real DB | Yes, isolated | `tests/unit/<module>/infrastructure/` |
| GraphQL operation through HTTP | e2e | Yes | see `adonisjs-graphql-e2e-testing` |

Never mock Lucid query methods (`Model.query`, `find`, `create`...). Test the Lucid repository against the real database instead.

## One-time setup

### 1. Suite in `adonisrc.ts`

```ts
tests: {
  suites: [
    { files: ['tests/unit/**/*.spec.ts'], name: 'unit', timeout: 2000 },
  ],
  forceExit: false,
}
```

### 2. `tests/bootstrap.ts` (minimum for unit tests)

```ts
import { assert } from '@japa/assert'
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import type { Config } from '@japa/runner/types'

export const plugins: Config['plugins'] = [assert(), pluginAdonisJS(app)]

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [() => testUtils.db().migrate()],   // only needed if some tests use the database
  teardown: [],
}

export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
```

The HTTP server is **not** started for the `unit` suite.

### 3. `.env.test`

Overrides `.env` automatically when running tests. Always point to a **dedicated test database** and use cheap drivers:

```
SESSION_DRIVER=memory
DB_DATABASE=app_test
```

## Workflow: write a unit test

Follow these steps in this exact order.

### Step 1. Identify what you are testing

Pick the row in the table above. That decides the folder, whether the DB is needed, and which doubles to use.

### Step 2. Generate the file

```bash
node ace make:test recipes/domain/recipe --suite=unit
```

Creates `tests/unit/recipes/domain/recipe.spec.ts`. File name: `<subject_in_snake_case>.spec.ts`, mirroring the source path.

### Step 3. Write the group and tests

Rules:
- One `test.group()` per class or function under test. Group name = the subject (`'Recipe entity'`, `'CreateRecipe use case'`).
- Test titles describe behavior: `'rejects an empty title'`, not `'test 1'`.
- Arrange / Act / Assert comments in every test that has more than one step.
- One behavior per test. Several assertions are fine if they check the same behavior.

### Step 4. Cover the minimum cases

For each subject, cover: nominal case, each business rule/invariant, each error path, boundary values. For use cases that touch user-owned data, **always** add an isolation test with two users.

### Step 5. Run

```bash
node ace test unit                          # whole suite
node ace test --files="recipes/domain/*"    # one folder
node ace test --tests="rejects an empty title"
node ace test --watch                       # iterate (combine with --files)
node ace test --bail                        # stop at first failure
node ace test --failed                      # re-run only failures
```

## Recipes

### Domain entity (pure, no framework)

```ts
import { test } from '@japa/runner'
import Recipe from '#modules/recipes/domain/recipe'

test.group('Recipe entity', () => {
  test('trims the title when renaming', ({ assert }) => {
    const recipe = new Recipe(1, 'Old', null, 10, new Date())

    recipe.rename('  Pancakes  ')

    assert.equal(recipe.title, 'Pancakes')
  })

  test('rejects an empty title', ({ assert }) => {
    const recipe = new Recipe(1, 'Old', null, 10, new Date())

    assert.throws(() => recipe.rename('   '), 'Recipe title cannot be empty')
  })
})
```

### Use case with an in-memory repository

Create the fake once, next to the tests, by implementing the **port** (abstract class):

`tests/unit/recipes/support/in_memory_recipe_repository.ts`

```ts
import Recipe from '#modules/recipes/domain/recipe'
import RecipeRepository from '#modules/recipes/domain/recipe_repository'

export default class InMemoryRecipeRepository extends RecipeRepository {
  items: Recipe[] = []
  private nextId = 1

  async findById(id: number) {
    return this.items.find((r) => r.id === id) ?? null
  }

  async list(page: number, perPage: number) {
    return this.items.slice((page - 1) * perPage, page * perPage)
  }

  async add(data: { title: string; description?: string; authorId: number }) {
    const recipe = new Recipe(this.nextId++, data.title, data.description ?? null, data.authorId, new Date())
    this.items.push(recipe)
    return recipe
  }
}
```

The test builds the use case by hand (no container needed):

```ts
import { test } from '@japa/runner'
import CreateRecipe from '#modules/recipes/application/use_cases/create_recipe'
import InMemoryRecipeRepository from '../support/in_memory_recipe_repository.js'

test.group('CreateRecipe use case', (group) => {
  let repository: InMemoryRecipeRepository
  let createRecipe: CreateRecipe

  group.each.setup(() => {
    repository = new InMemoryRecipeRepository()
    createRecipe = new CreateRecipe(repository)
  })

  test('stores the recipe for the given author', async ({ assert }) => {
    const recipe = await createRecipe.execute({ title: 'Pancakes', authorId: 10 })

    assert.equal(recipe.authorId, 10)
    assert.lengthOf(repository.items, 1)
  })

  test('does not expose recipes of another user', async ({ assert }) => {
    await createRecipe.execute({ title: 'Mine', authorId: 1 })
    await createRecipe.execute({ title: 'Theirs', authorId: 2 })

    const mine = repository.items.filter((r) => r.authorId === 1)

    assert.lengthOf(mine, 1)
    assert.equal(mine[0].title, 'Mine')
  })
})
```

If a rule lives in the use case (ownership check, duplicate check), the isolation test must call the use case with user A's id on user B's data and assert the error.

### VineJS validator

```ts
import { test } from '@japa/runner'
import { errors } from '@vinejs/vine'
import { createRecipeValidator } from '#modules/recipes/presentation/validators/create_recipe'

test.group('createRecipeValidator', () => {
  test('accepts a valid payload', async ({ assert }) => {
    const data = await createRecipeValidator.validate({ title: 'Pancakes' })
    assert.equal(data.title, 'Pancakes')
  })

  test('rejects a missing title', async ({ assert }) => {
    await assert.rejects(
      () => createRecipeValidator.validate({}),
      errors.E_VALIDATION_ERROR as any
    )
  })
})
```

Adjust the validator import path to the project's actual location.

### Lucid repository (real database, isolated)

```ts
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import LucidRecipeRepository from '#modules/recipes/infrastructure/lucid_recipe_repository'
import { RecipeFactory } from '#database/factories/recipe_factory'

test.group('LucidRecipeRepository', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('finds a recipe by id', async ({ assert }) => {
    const row = await RecipeFactory.create()

    const recipe = await new LucidRecipeRepository().findById(row.id)

    assert.equal(recipe?.title, row.title)
  })

  test('returns null when the recipe does not exist', async ({ assert }) => {
    assert.isNull(await new LucidRecipeRepository().findById(999999))
  })
})
```

Use `truncate()` instead of `wrapInGlobalTransaction()` if the test needs committed data or several concurrent transactions.

## Test doubles policy

| Dependency | Double | How |
|---|---|---|
| Own repository port | In-memory fake class | `new InMemoryXRepository()` passed to the constructor |
| Own external service (payment, API client) | Dedicated fake class extending the real one | `swap(RealService, new FakeService())` in the test context |
| Events | Emitter fake | `using fake = emitter.fake()` then `fake.assertEmitted(...)` |
| Emails | Mail fake | `using fake = mail.fake()` then `fake.mails.assertSent(...)` |
| Password hashing (many users) | Hash fake | `using _hash = hash.fake()` |
| File storage | Drive fake | `using disk = drive.fake('disk_name')` |
| Current time | Frozen / traveled time | `freezeTime(date)`, `timeTravel('31 days')` from `@japa/runner` |
| Anything else | Sinon (last resort) | `sinon.stub(...)` + `group.each.teardown(() => sinon.restore())` |

Details:
- Built-in fakes support the `using` keyword: they are restored automatically at the end of the test. Otherwise call `.restore()` or use the `cleanup` hook.
- `swap` restores the original binding automatically; it can only be called inside a running Japa test. Use `useFake` from `@japa/plugin-adonisjs/helpers` to share swap logic in reusable helpers (`tests/helpers/fakes.ts`).
- `freezeTime` / `timeTravel` mock only `Date` and `Date.now()`, not `setTimeout` or `setInterval`.
- Do not hash for real in unit tests unless hashing is what you test (it is intentionally slow).

Example (events + time):

```ts
import { test, freezeTime } from '@japa/runner'
import emitter from '@adonisjs/core/services/emitter'
import { events } from '#generated/events'

test('emits the event on registration', async ({ assert }) => {
  using fake = emitter.fake()
  freezeTime(new Date('2026-01-01T00:00:00Z'))

  // ...call the code under test

  fake.assertEmitted(events.UserRegistered)
})
```

(Adjust the event import to how your project exposes events.)

## Assertion cheat sheet (`assert` from the test context)

| Goal | Assertion |
|---|---|
| Equality | `assert.equal(a, b)` / `assert.deepEqual(a, b)` |
| Boolean | `assert.isTrue(x)` / `assert.isFalse(x)` |
| Null / undefined | `assert.isNull(x)` / `assert.isUndefined(x)` |
| Array length | `assert.lengthOf(arr, n)` |
| Throws (sync) | `assert.throws(() => fn(), 'message')` |
| Rejects (async) | `await assert.rejects(() => fn(), 'message')` |
| Includes | `assert.include(arrOrString, value)` |

## Hard rules

1. Unit tests never call the network, send real emails, or touch real external services.
2. Never mock Lucid query methods; use the real test database for anything that queries.
3. Always run on a dedicated test database (`.env.test`). Check the target database before running tests that write.
4. Every test is independent: no shared mutable state between tests, no reliance on execution order. Reset in `group.each.setup`.
5. Use factories for database data, never hand-written inserts.
6. Use in-memory repositories for use cases; never instantiate the Lucid repository in a use case test.
7. One behavior per test, descriptive title.
8. Any use case touching user-owned data has a two-user isolation test.
9. Time-dependent code uses `freezeTime` / `timeTravel`, never real waiting (`sleep`).
10. Never report a test as passing if it was not executed. Report commands run and their results.

## Checklist before finishing

- [ ] File in `tests/unit/<module>/<layer>/` and named `<subject>.spec.ts`
- [ ] `test.group` named after the subject; titles describe behavior
- [ ] Nominal case, business rules, error paths and boundaries covered
- [ ] Two-user isolation test added if user data is involved
- [ ] Only external systems are faked; no Lucid queries mocked
- [ ] Fakes restored (`using`, `swap`, or `sinon.restore()`)
- [ ] `node ace test unit` executed and result reported