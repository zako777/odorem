# Graph Report - odorem  (2026-11-17)

## Corpus Check
- 138 files · ~26,256 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 8, .example 1, .graphql 1)

## Summary
- 853 nodes · 1488 edges · 62 communities (40 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `16a42949`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- @adonisjs/core
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
- lucid_catalogue_repository.ts
- bootstrap.ts
- CatalogueRepository
- InMemoryCatalogueRepository
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
- console.ts
- exports
- CatalogueResolver
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
- wishlist_resolver.ts
- index.tsx
- container_bindings_middleware.ts
- ProductEntity
- mobile/eslint.config.js
- PerfumeEntity
- routes.ts
- search_perfumes.ts
- AccessTokensController
- catalogue_resolver.ts
- scan.tsx
- @adonisjs/lucid
- graphql_user_auth.spec.ts
- test.ts
- silent_auth_middleware.ts

## God Nodes (most connected - your core abstractions)
1. `@adonisjs/core` - 36 edges
2. `imports` - 24 edges
3. `@adonisjs/lucid` - 23 edges
4. `CatalogueRepository` - 22 edges
5. `User` - 22 edges
6. `UserEntity` - 21 edges
7. `PossessionEntity` - 18 edges
8. `Product` - 18 edges
9. `InMemoryCatalogueRepository` - 18 edges
10. `CollectionRepository` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Development Tools` --references--> `Infrastructure & Dev Tools`  [EXTRACTED]
  docs/setup.md → CLAUDE.md
- `InMemoryCatalogueRepository` --references--> `SearchPerfumesQuery`  [EXTRACTED]
  backend/tests/unit/catalogue/support/in_memory_catalogue_repository.ts → backend/app/catalogue/domain/catalogue_repository.ts
- `LucidCatalogueRepository` --implements--> `CatalogueRepository`  [EXTRACTED]
  backend/app/catalogue/infrastructure/persistence/lucid_catalogue_repository.ts → backend/app/catalogue/domain/catalogue_repository.ts
- `InMemoryCatalogueRepository` --implements--> `CatalogueRepository`  [EXTRACTED]
  backend/tests/unit/catalogue/support/in_memory_catalogue_repository.ts → backend/app/catalogue/domain/catalogue_repository.ts
- `InMemoryCatalogueRepository` --references--> `PerfumeEntity`  [EXTRACTED]
  backend/tests/unit/catalogue/support/in_memory_catalogue_repository.ts → backend/app/catalogue/domain/perfume.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Technology Stack** — backend, adonisjs_lucid, adonisjs_graphql_ddd, postgresql [EXTRACTED 1.00]
- **Testing Strategy** — adonisjs_unit_testing, adonisjs_graphql_e2e_testing [EXTRACTED 1.00]

## Communities (62 total, 22 thin omitted)

### Community 0 - "@adonisjs/core"
Cohesion: 0.14
Nodes (12): Data, User, Variants, NewAccountController, ProfileController, User, UserTransformer, email() (+4 more)

### Community 1 - "mobile/package.json"
Cohesion: 0.07
Nodes (28): eslint, typescript, main, name, private, type, version, expo (+20 more)

### Community 2 - "tasks.py"
Cohesion: 0.09
Nodes (18): backend(), build(), check(), _compose(), docker_build(), docker_down(), docker_logs(), docker_up() (+10 more)

### Community 3 - "UserEntity"
Cohesion: 0.07
Nodes (17): AuthPayload, LoginUserInput, RegisterUserInput, UserPublicProfile, UserResolver, LoginUser, LoginUserInput, RegisterUser (+9 more)

### Community 4 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 5 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, expo, expo-camera, expo-constants, expo-device, expo-font, expo-glass-effect, expo-image (+17 more)

### Community 6 - "index.ts"
Cohesion: 0.22
Nodes (8): placeholder, registry, routes, @tuyau/core/types, UserRegistry, ParamValue, ApiDefinition, @tuyau/core

### Community 7 - "backend/package.json"
Cohesion: 0.08
Nodes (23): eslint, typescript, license, name, prettier, private, type, version (+15 more)

### Community 8 - "imports"
Cohesion: 0.08
Nodes (24): imports, #abilities/*, #catalogue/*, #collection/*, #config/*, #controllers/*, #database/*, #events/* (+16 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @adonisjs/auth, @adonisjs/core, @adonisjs/cors, @adonisjs/lucid, @adonisjs/session, @adonisjs/shield, @apollo/server (+11 more)

### Community 10 - "@foadonis/graphql"
Cohesion: 0.15
Nodes (7): DemoResolver, @foadonis/graphql/types, graphqlConfig, GraphQLDriver, PubSubDriver, SubscriptionDriver, @foadonis/graphql

### Community 11 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @adonisjs/assembler, @adonisjs/eslint-config, @adonisjs/prettier-config, @adonisjs/tsconfig, eslint, hot-hook, @japa/assert (+9 more)

### Community 12 - "kernel.ts"
Cohesion: 0.13
Nodes (5): AdonisJS GraphQL + DDD Skill, corsConfig, shieldConfig, @adonisjs/cors, @adonisjs/shield

### Community 13 - "auth.ts"
Cohesion: 0.29
Nodes (5): @adonisjs/auth/types, @adonisjs/core/types, authConfig, Authenticators, EventsList

### Community 14 - "env.ts"
Cohesion: 0.13
Nodes (10): appUrl, http, databaseConnection, dbConfig, @adonisjs/core/types, encryptionConfig, EncryptorsList, @adonisjs/core/types (+2 more)

### Community 15 - "lucid_catalogue_repository.ts"
Cohesion: 0.29
Nodes (6): ScannedProduct, SearchPerfumesQuery, ConcentrationRecord, PerfumeRecord, ProductRecord, DEFAULT_CONCENTRATION

### Community 16 - "bootstrap.ts"
Cohesion: 0.15
Nodes (9): sessionConfig, @japa/api-client/types, plugins, RoutesRegistry, runnerHooks, @adonisjs/session, @japa/api-client, @japa/assert (+1 more)

### Community 17 - "CatalogueRepository"
Cohesion: 0.22
Nodes (6): GetPerfume, ListProductsByPerfume, CatalogueRepository, PerfumeNotFoundError, AddToWishlist, AddToWishlistInput

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
Cohesion: 0.05
Nodes (28): ProductNotFoundError, AddToCollection, AddToCollectionInput, ListCollection, ListCollectionQuery, RemovePossession, RemovePossessionInput, UpdatePossession (+20 more)

### Community 27 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, better-sqlite3, esbuild, fsevents, @swc/core

### Community 29 - "AdonisJS Lucid ORM: Standard Workflow"
Cohesion: 0.12
Nodes (16): AdonisJS Lucid ORM: Standard Workflow, Checklist before finishing any DB task, Command reference, Core principle, Hard rules, Hooks (lifecycle logic on the model), Relationships cheat sheet, Step 1. Create the migration (+8 more)

### Community 31 - "console.ts"
Cohesion: 0.22
Nodes (3): APP_ROOT, APP_ROOT, @poppinss/ts-exec

### Community 32 - "exports"
Cohesion: 0.67
Nodes (3): exports, ./data, ./registry

### Community 43 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, android, ios, lint, reset-project, start, test, web

### Community 44 - "@vinejs/vine"
Cohesion: 0.29
Nodes (5): barcodeValidator, VineGlobalTransforms, @vinejs/vine/types, luxon, @vinejs/vine

### Community 45 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, eslint, eslint-config-expo, @types/react, typescript

### Community 46 - "hash.ts"
Cohesion: 0.50
Nodes (3): @adonisjs/core/types, hashConfig, HashersList

### Community 47 - "wishlist_resolver.ts"
Cohesion: 0.06
Nodes (18): WishlistEntryType, WishlistItemType, WishlistPage, WishlistResolver, ListWishlist, ListWishlistQuery, MoveWishlistToCollection, MoveWishlistToCollectionInput (+10 more)

### Community 48 - "index.tsx"
Cohesion: 0.29
Nodes (3): styles, expo-router, react-native

### Community 53 - "routes.ts"
Cohesion: 0.25
Nodes (4): controllers, AuthMiddleware, middleware, @adonisjs/auth

### Community 54 - "search_perfumes.ts"
Cohesion: 0.32
Nodes (3): SearchPerfumes, SearchPerfumesInput, PerfumesPage

### Community 56 - "catalogue_resolver.ts"
Cohesion: 0.32
Nodes (6): FindProductByBarcode, ConcentrationType, PerfumesPage, PerfumeType, ProductType, ScannedProductType

### Community 57 - "scan.tsx"
Cohesion: 0.40
Nodes (5): normalizeBarcode(), ScanScreen(), styles, expo-camera, react

### Community 58 - "@adonisjs/lucid"
Cohesion: 0.05
Nodes (24): Barcode, Concentration, Perfume, Possession, Product, WishlistItem, AuthAccessTokenSchema, BarcodeSchema (+16 more)

## Knowledge Gaps
- **48 isolated node(s):** `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig`, `@types/luxon`, `@types/node` (+43 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 426 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@adonisjs/core` connect `@adonisjs/core` to `UserEntity`, `backend/package.json`, `@foadonis/graphql`, `kernel.ts`, `test.ts`, `env.ts`, `hash.ts`, `container_bindings_middleware.ts`, `bootstrap.ts`, `routes.ts`, `api_provider.ts`, `force_json_response_middleware.ts`, `routes.d.ts`, `@adonisjs/lucid`, `graphql_user_auth.spec.ts`, `handler.ts`, `silent_auth_middleware.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **What connects `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig` to the rest of the system?**
  _48 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@adonisjs/core` be split into smaller, more focused modules?**
  _Cohesion score 0.13666666666666666 - nodes in this community are weakly interconnected._
- **Why does `@adonisjs/lucid` connect `@adonisjs/lucid` to `backend/package.json`, `env.ts`, `wishlist_resolver.ts`, `bootstrap.ts`, `api_provider.ts`, `collection_resolver.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `mobile/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `@foadonis/graphql` connect `@foadonis/graphql` to `UserEntity`, `backend/package.json`, `kernel.ts`, `wishlist_resolver.ts`, `bootstrap.ts`, `routes.ts`, `catalogue_resolver.ts`, `collection_resolver.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `tasks.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09158186864014801 - nodes in this community are weakly interconnected._