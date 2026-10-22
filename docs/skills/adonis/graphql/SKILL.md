---
name: adonisjs-graphql-ddd
description: Use when adding or changing a GraphQL feature (type, input, query, mutation, field resolver, authorization, test) in an AdonisJS project using @foadonis/graphql with a DDD module structure. Enforces one fixed workflow and strict layer boundaries. Pairs with the adonisjs-lucid skill for tables and models.
---

# AdonisJS GraphQL + DDD: Standard Workflow

Docs: https://friendsofadonis.com/docs/graphql (package: `@foadonis/graphql`, built on TypeGraphQL, Apollo or Yoga driver)

## Core principle

**The resolver is a thin adapter.** It translates GraphQL arguments into a use-case call and a domain entity into a GraphQL type. Business rules live in the domain, orchestration lives in use cases, SQL lives in infrastructure.

GraphQL types are **separate classes** from Lucid models. Do not put `@ObjectType` / `@Field` on a Lucid model: with Lucid schema classes the columns are inherited (not declared in the model), and it would leak persistence into your API.

## Layer rules (dependency direction: presentation -> application -> domain <- infrastructure)

| Layer | Contains | May import | Must NOT import |
|---|---|---|---|
| `domain` | Entities, value objects, domain errors, repository ports (abstract classes) | Nothing from the framework | Lucid, GraphQL, Adonis |
| `application` | Use cases (one class = one `execute`), Bouncer policies | `domain`, `@adonisjs/core` (`inject`) | GraphQL decorators, Lucid models |
| `infrastructure` | Lucid models, repository implementations, mappers | `domain`, Lucid | GraphQL |
| `presentation/graphql` | `@ObjectType`, `@InputType`, `@ArgsType` classes | `domain` (for mapping), `@foadonis/graphql` | Lucid models |
| `app/graphql/resolvers` | Resolver classes (autoloaded) | `application`, `presentation` | Lucid models, repositories |

## Folder structure

```
app/
  modules/
    recipes/
      domain/
        recipe.ts                     # entity
        recipe_repository.ts          # port (abstract class)
        errors/recipe_not_found_error.ts
      application/
        use_cases/create_recipe.ts
        use_cases/get_recipe.ts
        policies/recipe_policy.ts
      infrastructure/
        recipe_model.ts               # Lucid model (extends generated schema class)
        lucid_recipe_repository.ts    # port implementation
      presentation/
        graphql/
          recipe_type.ts              # @ObjectType
          create_recipe_input.ts      # @InputType
  graphql/
    resolvers/
      recipe_resolver.ts              # thin resolver, one per module (autoloaded)
  providers/
    domain_provider.ts                # binds ports -> implementations
```

Resolvers must stay in the autoloaded folder (default `app/graphql/resolvers`, configurable through `directories.resolvers` in `adonisrc.ts`). Everything else lives in the module.

## One-time setup

```bash
node ace add @foadonis/graphql      # choose Yoga or Apollo
```

`package.json` import aliases:

```json
"imports": {
  "#modules/*": "./app/modules/*.js",
  "#graphql/*": "./app/graphql/*.js",
  "#providers/*": "./providers/*.js"
}
```

`adonisrc.ts`:

```ts
directories: { resolvers: 'app/graphql/resolvers' },
providers: [
  // ...
  () => import('#providers/domain_provider'),
],
```

`config/graphql.ts`: set `apollo.introspection` and `apollo.playground` to `false` in production. Optionally set `emitSchemaFile: true` to export the SDL. The route is registered with `graphql.registerRoute(router)` in `start/routes.ts` (verify it exists after `node ace add`).

## Workflow: add a new feature (e.g. Recipe)

Follow the steps in this exact order.

### Step 1. Database (see the `adonisjs-lucid` skill)

```bash
node ace make:migration recipes --create=recipes
# write up()/down()
node ace migration:run
```

### Step 2. Domain: entity + port

`app/modules/recipes/domain/recipe.ts`

```ts
export default class Recipe {
  constructor(
    readonly id: number,
    public title: string,
    public description: string | null,
    readonly authorId: number,
    readonly createdAt: Date
  ) {}

  rename(title: string) {
    if (!title.trim()) throw new Error('Recipe title cannot be empty')
    this.title = title.trim()
  }
}
```

`app/modules/recipes/domain/recipe_repository.ts`

```ts
import type Recipe from './recipe.js'

export default abstract class RecipeRepository {
  abstract findById(id: number): Promise<Recipe | null>
  abstract list(page: number, perPage: number): Promise<Recipe[]>
  abstract add(data: { title: string; description?: string; authorId: number }): Promise<Recipe>
}
```

### Step 3. Infrastructure: model + repository

Create the model with `node ace make:model Recipe`, then move it to `infrastructure/` and rename it `RecipeModel`. Set the table explicitly because the class name no longer matches the table.

`app/modules/recipes/infrastructure/recipe_model.ts`

```ts
import { RecipesSchema } from '#database/schema'

export default class RecipeModel extends RecipesSchema {
  static table = 'recipes'
}
```

`app/modules/recipes/infrastructure/lucid_recipe_repository.ts`

```ts
import Recipe from '#modules/recipes/domain/recipe'
import RecipeRepository from '#modules/recipes/domain/recipe_repository'
import RecipeModel from './recipe_model.js'

const toEntity = (m: RecipeModel) =>
  new Recipe(m.id, m.title, m.description, m.authorId, m.createdAt.toJSDate())

export default class LucidRecipeRepository extends RecipeRepository {
  async findById(id: number) {
    const row = await RecipeModel.find(id)
    return row ? toEntity(row) : null
  }

  async list(page: number, perPage: number) {
    const rows = await RecipeModel.query().paginate(page, perPage)
    return rows.all().map(toEntity)
  }

  async add(data: { title: string; description?: string; authorId: number }) {
    return toEntity(await RecipeModel.create(data))
  }
}
```

Bind the port once in `providers/domain_provider.ts`:

```ts
import type { ApplicationService } from '@adonisjs/core/types'
import RecipeRepository from '#modules/recipes/domain/recipe_repository'

export default class DomainProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.bind(RecipeRepository, async () => {
      const { default: Impl } = await import('#modules/recipes/infrastructure/lucid_recipe_repository')
      return new Impl()
    })
  }
}
```

### Step 4. Application: use cases (one per file)

`app/modules/recipes/application/use_cases/create_recipe.ts`

```ts
import { inject } from '@adonisjs/core'
import RecipeRepository from '#modules/recipes/domain/recipe_repository'

@inject()
export default class CreateRecipe {
  constructor(private recipes: RecipeRepository) {}

  execute(input: { title: string; description?: string; authorId: number }) {
    return this.recipes.add(input)
  }
}
```

### Step 5. Presentation: GraphQL type + input

`app/modules/recipes/presentation/graphql/recipe_type.ts`

```ts
import { ObjectType, Field, ID } from '@foadonis/graphql'
import type Recipe from '#modules/recipes/domain/recipe'

@ObjectType('Recipe')
export default class RecipeType {
  @Field(() => ID)
  declare id: number

  @Field()
  declare title: string

  @Field({ nullable: true })
  declare description: string | null

  @Field()
  declare createdAt: Date

  static from(entity: Recipe) {
    return Object.assign(new RecipeType(), {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt,
    })
  }
}
```

`app/modules/recipes/presentation/graphql/create_recipe_input.ts`

```ts
import { InputType, Field } from '@foadonis/graphql'

@InputType()
export default class CreateRecipeInput {
  @Field()
  declare title: string

  @Field({ nullable: true })
  declare description?: string
}
```

### Step 6. Resolver (thin, autoloaded)

Scaffold with `node ace make:resolver recipe`, then:

`app/graphql/resolvers/recipe_resolver.ts`

```ts
import { Resolver, Query, Mutation, Arg, Int, Authorized, CurrentUser } from '@foadonis/graphql'
import type User from '#models/user'
import CreateRecipe from '#modules/recipes/application/use_cases/create_recipe'
import GetRecipe from '#modules/recipes/application/use_cases/get_recipe'
import RecipeType from '#modules/recipes/presentation/graphql/recipe_type'
import CreateRecipeInput from '#modules/recipes/presentation/graphql/create_recipe_input'

@Resolver(() => RecipeType)
export default class RecipeResolver {
  constructor(
    private createRecipe: CreateRecipe,
    private getRecipe: GetRecipe
  ) {}

  @Query(() => RecipeType)
  async recipe(@Arg('id', () => Int) id: number) {
    return RecipeType.from(await this.getRecipe.execute(id))
  }

  @Mutation(() => RecipeType)
  @Authorized()
  async createRecipe(@Arg('data') data: CreateRecipeInput, @CurrentUser() user: User) {
    const recipe = await this.createRecipe.execute({ ...data, authorId: user.id })
    return RecipeType.from(recipe)
  }
}
```

Resolver rules: no business logic, no `RecipeModel`, no repository. Only call a use case and map the result.

### Step 7. Test (Japa)

Register `graphqlApiClient(app)` (from `@foadonis/graphql/plugins/api_client`) next to `apiClient()` in `tests/bootstrap.ts`, then:

```ts
test('creates a recipe', async ({ client }) => {
  const response = await client
    .mutate(
      `mutation ($data: CreateRecipeInput!) { createRecipe(data: $data) { id title } }`,
      { data: { title: 'Pancakes' } }
    )
    .loginAs(user)

  response.assertNoErrors()
  response.assertDataContains({ createRecipe: { title: 'Pancakes' } })
})
```

Also unit-test use cases with an in-memory repository (a class extending the port), without touching the database or GraphQL.

## Authorization (Bouncer)

- `@Authorized()` on a query/mutation: requires an authenticated user.
- `@Authorized(abilities.isAdmin)` or `@Authorized(RecipePolicy, 'viewList')`: delegates to Bouncer. Several abilities must all pass.
- On a resolver class: protects every operation. An operation-level `@Authorized` **replaces** the class-level one (not merged).
- On a type field: `@Authorized(...)` hides that field; the parent object is passed to the ability/policy after the user.
- Queries/mutations receive `undefined` as the object. To check against a specific record, load it in the use case and call `ctx.bouncer` (via `@Ctx()`), or put the rule in the domain.
- `@CurrentUser()` makes the operation authenticated-only. For guests allowed, use `@Ctx()` and `ctx.auth`.
- Policies live in `application/policies/` and are resolved through the IoC container.

## Relations: field resolvers

Resolve nested data lazily, in the same resolver class, by calling a use case:

```ts
@FieldResolver(() => UserType)
author(@Root() recipe: RecipeType) {
  return this.getUser.execute(recipe.authorId)   // expose authorId internally on the type
}
```

Watch for N+1 queries on list fields: if a nested field is commonly requested, have the use case load it in one query.

## Hard rules

1. No GraphQL decorators outside `presentation/graphql` and `app/graphql/resolvers`.
2. No Lucid imports outside `infrastructure` (and migrations/seeders/factories).
3. Repositories return domain entities, never Lucid models.
4. One use case = one class = one `execute()`.
5. One resolver per module, in `app/graphql/resolvers`.
6. Never put `@ObjectType` on a Lucid model.
7. Introspection and playground OFF in production.
8. Every new operation has at least one Japa test (happy path + unauthorized).

## Checklist before finishing

- [ ] Migration ran, `database/schema.ts` regenerated (not hand-edited)
- [ ] Entity and repository port in `domain`, with no framework imports
- [ ] Port bound to its implementation in `domain_provider.ts`
- [ ] Use case created with `@inject()`
- [ ] Type and input created in `presentation/graphql`
- [ ] Resolver is thin and has `@Authorized` where required
- [ ] Japa tests pass (`node ace test`)
