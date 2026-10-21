---
name: adonisjs-lucid
description: Use when creating or changing database tables, migrations, models, relationships, or queries in an AdonisJS project using Lucid ORM. Enforces one fixed workflow - migration first, generated schema class second, model third.
---

# AdonisJS Lucid ORM: Standard Workflow

Docs: https://lucid.adonisjs.com/docs

## Core principle

**The database is the source of truth.** Write a migration, run it, and Lucid generates typed schema classes in `database/schema.ts`. Models extend those classes and only contain what is specific to them: relationships, hooks, and business methods.

## Hard rules

1. NEVER edit `database/schema.ts` (it is auto-generated).
2. NEVER declare columns in a model (they are inherited from the schema class).
3. NEVER edit a migration that has already run. Create a new one with `--alter`.
4. ALWAYS run `node ace migration:run` before writing the model.
5. Table names: plural `snake_case` (`blog_posts`). Model names: singular `PascalCase` (`BlogPost`). Model files: `snake_case` (`blog_post.ts`).

## Workflow: create a new table + model

### Step 1. Create the migration

```bash
node ace make:migration posts --create=posts
```

### Step 2. Describe the table in `up()` (and `down()`)

`database/migrations/<timestamp>_create_posts_table.ts`

```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('posts', (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('status').defaultTo('draft')
      table.integer('author_id').unsigned().references('users.id').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable('posts')
  }
}
```

### Step 3. Run the migration

```bash
node ace migration:run
```

This applies the migration **and regenerates `database/schema.ts`** with a `PostsSchema` class (pattern: `<TableInPascalCase>Schema`).

### Step 4. Create the model

```bash
node ace make:model Post
```

(Optional flags: `--migration`, `--controller`, `--factory`, `--transformer`. Note: if you use `--migration`, the model can only compile after you have written and run that migration.)

### Step 5. Add only relationships, hooks, and methods

`app/models/post.ts`

```ts
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { PostsSchema } from '#database/schema'
import User from './user.js'

export default class Post extends PostsSchema {
  @belongsTo(() => User, { foreignKey: 'authorId' })
  declare author: BelongsTo<typeof User>

  isPublished() {
    return this.status === 'published'
  }
}
```

### Step 6. Use it

```ts
// Read
const posts = await Post.query()
  .where('status', 'published')
  .preload('author')
  .orderBy('createdAt', 'desc')

const post = await Post.findOrFail(params.id)

// Create
const created = await Post.create({ title: 'Hello', authorId: 1 })

// Update
post.merge({ title: 'New title' })
await post.save()

// Delete
await post.delete()
```

## Workflow: modify an existing table

```bash
node ace make:migration add_published_at_to_posts --alter=posts
node ace migration:run
```

Then update the model only if you need new relationships, hooks, or methods. New columns appear automatically through the regenerated schema class.

## Relationships cheat sheet

| Type | Decorator | Type import |
|---|---|---|
| Child to parent | `@belongsTo(() => User)` | `BelongsTo<typeof User>` |
| Parent to children | `@hasMany(() => Post)` | `HasMany<typeof Post>` |
| Parent to one child | `@hasOne(() => Profile)` | `HasOne<typeof Profile>` |
| Pivot table | `@manyToMany(() => Tag)` | `ManyToMany<typeof Tag>` |
| Through another model | `@hasManyThrough([() => Post, () => User])` | `HasManyThrough<typeof Post>` |

All decorators come from `@adonisjs/lucid/orm`; types from `@adonisjs/lucid/types/relations`.

## Hooks (lifecycle logic on the model)

```ts
import { beforeSave } from '@adonisjs/lucid/orm'

@beforeSave()
static async normalize(post: Post) {
  if (post.$dirty.title) post.title = post.title.trim()
}
```

## Transactions

```ts
import db from '@adonisjs/lucid/services/db'

await db.transaction(async (trx) => {
  const post = await Post.query({ client: trx }).where('id', 1).forUpdate().firstOrFail()
  post.status = 'published'
  await post.save()
})
```

## Command reference

| Goal | Command |
|---|---|
| New migration (create) | `node ace make:migration <name> --create=<table>` |
| New migration (alter) | `node ace make:migration <name> --alter=<table>` |
| Apply migrations | `node ace migration:run` |
| Undo last batch | `node ace migration:rollback` |
| Check status | `node ace migration:status` |
| Reset and re-run all | `node ace migration:refresh [--seed]` |
| Drop everything and re-run | `node ace migration:fresh [--seed]` |
| New model | `node ace make:model <Name>` |
| New factory | `node ace make:factory <Model>` |
| New seeder | `node ace make:seeder <Name>` |
| Run seeders | `node ace db:seed` |
| Regenerate schema (e.g. legacy DB) | `node ace schema:generate` |

Migration commands refuse to run in production unless `--force` is passed.

## Checklist before finishing any DB task

- [ ] Migration has both `up()` and `down()`
- [ ] `node ace migration:run` executed successfully
- [ ] `database/schema.ts` was NOT edited by hand
- [ ] Model extends the generated `<Table>Schema` and declares no columns
- [ ] Relationships have matching `foreignKey` when the column is not the default