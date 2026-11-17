# Graph Report - odorem  (2026-11-17)

## Corpus Check
- 115 files · ~22,275 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 8, .example 1, .graphql 1)

## Summary
- 735 nodes · 1200 edges · 59 communities (34 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `beba1009`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- access_tokens_controller.ts
- mobile/package.json
- tasks.py
- UserEntity
- expo
- dependencies
- index.ts
- backend/package.json
- imports
- dependencies
- @foadonis/graphql
- devDependencies
- kernel.ts
- auth.ts
- env.ts
- CatalogueRepository
- bootstrap.ts
- test.ts
- User
- scripts
- mobile/tsconfig.json
- Backend API (AdonisJS)
- api_provider.ts
- compilerOptions
- force_json_response_middleware.ts
- routes.d.ts
- collection_resolver.ts
- allowScripts
- handler.ts
- AdonisJS Lucid ORM: Standard Workflow
- CollectionResolver
- exports
- user_resolver.ts
- events.ts
- listeners.ts
- @adonisjs/eslint-config
- hotHook
- AdonisJS GraphQL e2e Testing Skill
- AdonisJS Unit Testing Skill
- odorem-core
- scripts
- @vinejs/vine
- devDependencies
- hash.ts
- UserResolver
- index.tsx
- container_bindings_middleware.ts
- cors.ts
- mobile/eslint.config.js
- _layout.tsx
- config/graphql.ts
- test.ts
- AccessTokensController
- silent_auth_middleware.ts
- @adonisjs/shield
- NewAccountController

## God Nodes (most connected - your core abstractions)
1. `@adonisjs/core` - 34 edges
2. `imports` - 23 edges
3. `UserEntity` - 21 edges
4. `PossessionEntity` - 18 edges
5. `CatalogueRepository` - 17 edges
6. `CollectionRepository` - 17 edges
7. `@adonisjs/lucid` - 16 edges
8. `User` - 15 edges
9. `ProductEntity` - 14 edges
10. `InMemoryCatalogueRepository` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Development Tools` --references--> `Infrastructure & Dev Tools`  [EXTRACTED]
  docs/setup.md → CLAUDE.md
- `Possession` --references--> `User`  [EXTRACTED]
  backend/app/models/possession.ts → backend/app/models/user.ts
- `ApiDefinition` --references--> `routes`  [EXTRACTED]
  backend/.adonisjs/client/registry/tree.d.ts → backend/.adonisjs/client/registry/index.ts
- `UserRegistry` --references--> `ApiDefinition`  [EXTRACTED]
  backend/.adonisjs/client/registry/index.ts → backend/.adonisjs/client/registry/tree.d.ts
- `InMemoryCatalogueRepository` --references--> `SearchPerfumesQuery`  [EXTRACTED]
  backend/tests/unit/catalogue/support/in_memory_catalogue_repository.ts → backend/app/catalogue/domain/catalogue_repository.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Technology Stack** — backend, adonisjs_lucid, adonisjs_graphql_ddd, postgresql [EXTRACTED 1.00]
- **Testing Strategy** — adonisjs_unit_testing, adonisjs_graphql_e2e_testing [EXTRACTED 1.00]

## Communities (59 total, 25 thin omitted)

### Community 0 - "access_tokens_controller.ts"
Cohesion: 0.20
Nodes (8): Data, User, Variants, ProfileController, User, UserTransformer, bodyParserConfig, @adonisjs/core

### Community 1 - "mobile/package.json"
Cohesion: 0.07
Nodes (29): eslint, typescript, main, name, private, type, version, expo (+21 more)

### Community 2 - "tasks.py"
Cohesion: 0.09
Nodes (18): backend(), build(), check(), _compose(), docker_build(), docker_down(), docker_logs(), docker_up() (+10 more)

### Community 3 - "UserEntity"
Cohesion: 0.12
Nodes (12): LoginUser, LoginUserInput, RegisterUser, RegisterUserInput, InvalidCredentialsError, UserAlreadyExistsError, UserPersistenceInput, UserRepository (+4 more)

### Community 4 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 5 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, expo, expo-constants, expo-device, expo-font, expo-glass-effect, expo-image, expo-linking (+16 more)

### Community 6 - "index.ts"
Cohesion: 0.22
Nodes (8): placeholder, registry, routes, @tuyau/core/types, UserRegistry, ParamValue, ApiDefinition, @tuyau/core

### Community 7 - "backend/package.json"
Cohesion: 0.08
Nodes (23): eslint, typescript, license, name, prettier, private, type, version (+15 more)

### Community 8 - "imports"
Cohesion: 0.09
Nodes (23): imports, #abilities/*, #catalogue/*, #collection/*, #config/*, #controllers/*, #database/*, #events/* (+15 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @adonisjs/auth, @adonisjs/core, @adonisjs/cors, @adonisjs/lucid, @adonisjs/session, @adonisjs/shield, @apollo/server (+11 more)

### Community 10 - "@foadonis/graphql"
Cohesion: 0.20
Nodes (3): controllers, DemoResolver, @foadonis/graphql

### Community 11 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @adonisjs/assembler, @adonisjs/eslint-config, @adonisjs/prettier-config, @adonisjs/tsconfig, eslint, hot-hook, @japa/assert (+9 more)

### Community 13 - "auth.ts"
Cohesion: 0.17
Nodes (8): AuthMiddleware, @adonisjs/auth/types, @adonisjs/core/types, authConfig, Authenticators, EventsList, middleware, @adonisjs/auth

### Community 14 - "env.ts"
Cohesion: 0.13
Nodes (10): appUrl, http, databaseConnection, dbConfig, @adonisjs/core/types, encryptionConfig, EncryptorsList, @adonisjs/core/types (+2 more)

### Community 15 - "CatalogueRepository"
Cohesion: 0.06
Nodes (22): GetPerfume, ListProductsByPerfume, SearchPerfumes, SearchPerfumesInput, CatalogueRepository, PerfumesPage, SearchPerfumesQuery, ConcentrationEntity (+14 more)

### Community 16 - "bootstrap.ts"
Cohesion: 0.15
Nodes (9): sessionConfig, @japa/api-client/types, plugins, RoutesRegistry, runnerHooks, @adonisjs/session, @japa/api-client, @japa/assert (+1 more)

### Community 17 - "test.ts"
Cohesion: 0.22
Nodes (3): APP_ROOT, APP_ROOT, @poppinss/ts-exec

### Community 18 - "User"
Cohesion: 0.06
Nodes (18): Concentration, Perfume, Possession, Product, AuthAccessTokenSchema, ConcentrationSchema, PerfumeSchema, PossessionSchema (+10 more)

### Community 19 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, format, lint, start, test, typecheck

### Community 20 - "mobile/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, paths, strict, extends, include, @/assets/*, expo/tsconfig.base

### Community 21 - "Backend API (AdonisJS)"
Cohesion: 0.38
Nodes (6): Backend API (AdonisJS), Development Tools, Mobile App (React Native/Expo), Infrastructure & Dev Tools, PostgreSQL, SQLite

### Community 22 - "api_provider.ts"
Cohesion: 0.29
Nodes (5): @adonisjs/core/http, ApiSerializer, HttpContext, serialize, serializer

### Community 23 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, jsx, outDir, rootDir, extends, @adonisjs/tsconfig/tsconfig.app.json

### Community 25 - "routes.d.ts"
Cohesion: 0.50
Nodes (4): @adonisjs/core/types/http, ParamValue, RoutesList, ScannedRoutes

### Community 26 - "collection_resolver.ts"
Cohesion: 0.07
Nodes (25): ProductNotFoundError, AddToCollection, AddToCollectionInput, ListCollection, ListCollectionQuery, RemovePossession, RemovePossessionInput, UpdatePossession (+17 more)

### Community 27 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, better-sqlite3, esbuild, fsevents, @swc/core

### Community 29 - "AdonisJS Lucid ORM: Standard Workflow"
Cohesion: 0.12
Nodes (16): AdonisJS Lucid ORM: Standard Workflow, Checklist before finishing any DB task, Command reference, Core principle, Hard rules, Hooks (lifecycle logic on the model), Relationships cheat sheet, Step 1. Create the migration (+8 more)

### Community 32 - "exports"
Cohesion: 0.67
Nodes (3): exports, ./data, ./registry

### Community 33 - "user_resolver.ts"
Cohesion: 0.24
Nodes (7): AuthPayload, LoginUserInput, RegisterUserInput, UserPublicProfile, email(), loginValidator, signupValidator

### Community 43 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, android, ios, lint, reset-project, start, test, web

### Community 44 - "@vinejs/vine"
Cohesion: 0.40
Nodes (4): VineGlobalTransforms, @vinejs/vine/types, luxon, @vinejs/vine

### Community 45 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint, eslint-config-expo, @types/react, typescript

### Community 46 - "hash.ts"
Cohesion: 0.50
Nodes (3): @adonisjs/core/types, hashConfig, HashersList

### Community 53 - "config/graphql.ts"
Cohesion: 0.33
Nodes (5): @foadonis/graphql/types, graphqlConfig, GraphQLDriver, PubSubDriver, SubscriptionDriver

## Knowledge Gaps
- **49 isolated node(s):** `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig`, `@types/luxon`, `@types/node` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 391 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@adonisjs/core` connect `access_tokens_controller.ts` to `UserEntity`, `backend/package.json`, `@foadonis/graphql`, `kernel.ts`, `auth.ts`, `env.ts`, `hash.ts`, `bootstrap.ts`, `container_bindings_middleware.ts`, `cors.ts`, `User`, `test.ts`, `api_provider.ts`, `force_json_response_middleware.ts`, `routes.d.ts`, `silent_auth_middleware.ts`, `handler.ts`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **What connects `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mobile/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `@foadonis/graphql` connect `@foadonis/graphql` to `user_resolver.ts`, `backend/package.json`, `kernel.ts`, `CatalogueRepository`, `bootstrap.ts`, `config/graphql.ts`, `collection_resolver.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `tasks.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09158186864014801 - nodes in this community are weakly interconnected._
- **Why does `@japa/runner` connect `User` to `UserEntity`, `backend/package.json`, `CatalogueRepository`, `bootstrap.ts`, `test.ts`, `collection_resolver.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `UserEntity` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._