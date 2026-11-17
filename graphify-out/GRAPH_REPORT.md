# Graph Report - odorem  (2026-11-17)

## Corpus Check
- 137 files · ~25,883 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 8, .example 1, .graphql 1)

## Summary
- 847 nodes · 1477 edges · 61 communities (39 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3d97957`
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
- CollectionResolver
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
- add_to_wishlist.ts
- mobile/eslint.config.js
- _layout.tsx
- routes.ts
- search_perfumes.ts
- AccessTokensController
- catalogue_resolver.ts
- find_product_by_barcode.ts
- @adonisjs/lucid
- graphql_user_auth.spec.ts
- Field

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
- `LucidCatalogueRepository` --implements--> `CatalogueRepository`  [EXTRACTED]
  backend/app/catalogue/infrastructure/persistence/lucid_catalogue_repository.ts → backend/app/catalogue/domain/catalogue_repository.ts
- `InMemoryCatalogueRepository` --implements--> `CatalogueRepository`  [EXTRACTED]
  backend/tests/unit/catalogue/support/in_memory_catalogue_repository.ts → backend/app/catalogue/domain/catalogue_repository.ts
- `InMemoryCatalogueRepository` --references--> `ProductEntity`  [EXTRACTED]
  backend/tests/unit/catalogue/support/in_memory_catalogue_repository.ts → backend/app/catalogue/domain/product.ts
- `Possession` --references--> `User`  [EXTRACTED]
  backend/app/models/possession.ts → backend/app/models/user.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Technology Stack** — backend, adonisjs_lucid, adonisjs_graphql_ddd, postgresql [EXTRACTED 1.00]
- **Testing Strategy** — adonisjs_unit_testing, adonisjs_graphql_e2e_testing [EXTRACTED 1.00]

## Communities (61 total, 22 thin omitted)

### Community 0 - "@adonisjs/core"
Cohesion: 0.17
Nodes (9): Data, User, Variants, NewAccountController, ProfileController, User, UserTransformer, bodyParserConfig (+1 more)

### Community 1 - "mobile/package.json"
Cohesion: 0.07
Nodes (29): eslint, typescript, main, name, private, type, version, expo (+21 more)

### Community 2 - "tasks.py"
Cohesion: 0.09
Nodes (18): backend(), build(), check(), _compose(), docker_build(), docker_down(), docker_logs(), docker_up() (+10 more)

### Community 3 - "UserEntity"
Cohesion: 0.08
Nodes (13): UserResolver, LoginUser, LoginUserInput, RegisterUser, RegisterUserInput, InvalidCredentialsError, UserAlreadyExistsError, UserPersistenceInput (+5 more)

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
Cohesion: 0.08
Nodes (24): imports, #abilities/*, #catalogue/*, #collection/*, #config/*, #controllers/*, #database/*, #events/* (+16 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @adonisjs/auth, @adonisjs/core, @adonisjs/cors, @adonisjs/lucid, @adonisjs/session, @adonisjs/shield, @apollo/server (+11 more)

### Community 11 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @adonisjs/assembler, @adonisjs/eslint-config, @adonisjs/prettier-config, @adonisjs/tsconfig, eslint, hot-hook, @japa/assert (+9 more)

### Community 12 - "kernel.ts"
Cohesion: 0.11
Nodes (6): AdonisJS GraphQL + DDD Skill, SilentAuthMiddleware, corsConfig, shieldConfig, @adonisjs/cors, @adonisjs/shield

### Community 13 - "auth.ts"
Cohesion: 0.29
Nodes (5): @adonisjs/auth/types, @adonisjs/core/types, authConfig, Authenticators, EventsList

### Community 14 - "env.ts"
Cohesion: 0.06
Nodes (20): APP_ROOT, APP_ROOT, APP_ROOT, appUrl, http, databaseConnection, dbConfig, @adonisjs/core/types (+12 more)

### Community 15 - "lucid_catalogue_repository.ts"
Cohesion: 0.18
Nodes (8): ScannedProduct, ConcentrationEntity, ConcentrationRecord, PerfumeRecord, ProductEntity, ProductRecord, LucidCatalogueRepository, DEFAULT_CONCENTRATION

### Community 16 - "bootstrap.ts"
Cohesion: 0.15
Nodes (9): sessionConfig, @japa/api-client/types, plugins, RoutesRegistry, runnerHooks, @adonisjs/session, @japa/api-client, @japa/assert (+1 more)

### Community 17 - "CatalogueRepository"
Cohesion: 0.24
Nodes (4): GetPerfume, ListProductsByPerfume, CatalogueRepository, PerfumeNotFoundError

### Community 18 - "InMemoryCatalogueRepository"
Cohesion: 0.17
Nodes (3): SearchPerfumesQuery, PerfumeEntity, InMemoryCatalogueRepository

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
Nodes (26): AddToCollection, AddToCollectionInput, ListCollection, ListCollectionQuery, RemovePossession, RemovePossessionInput, UpdatePossession, UpdatePossessionInput (+18 more)

### Community 27 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, better-sqlite3, esbuild, fsevents, @swc/core

### Community 29 - "AdonisJS Lucid ORM: Standard Workflow"
Cohesion: 0.12
Nodes (16): AdonisJS Lucid ORM: Standard Workflow, Checklist before finishing any DB task, Command reference, Core principle, Hard rules, Hooks (lifecycle logic on the model), Relationships cheat sheet, Step 1. Create the migration (+8 more)

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

### Community 50 - "add_to_wishlist.ts"
Cohesion: 0.28
Nodes (3): ProductNotFoundError, AddToWishlist, AddToWishlistInput

### Community 53 - "routes.ts"
Cohesion: 0.25
Nodes (4): controllers, AuthMiddleware, middleware, @adonisjs/auth

### Community 54 - "search_perfumes.ts"
Cohesion: 0.32
Nodes (3): SearchPerfumes, SearchPerfumesInput, PerfumesPage

### Community 56 - "catalogue_resolver.ts"
Cohesion: 0.54
Nodes (5): ConcentrationType, PerfumesPage, PerfumeType, ProductType, ScannedProductType

### Community 58 - "@adonisjs/lucid"
Cohesion: 0.05
Nodes (24): Barcode, Concentration, Perfume, Possession, Product, WishlistItem, AuthAccessTokenSchema, BarcodeSchema (+16 more)

### Community 63 - "Field"
Cohesion: 0.24
Nodes (7): AuthPayload, LoginUserInput, RegisterUserInput, UserPublicProfile, email(), loginValidator, signupValidator

## Knowledge Gaps
- **49 isolated node(s):** `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig`, `@types/luxon`, `@types/node` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 425 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@adonisjs/core` connect `@adonisjs/core` to `UserEntity`, `backend/package.json`, `@foadonis/graphql`, `kernel.ts`, `env.ts`, `hash.ts`, `bootstrap.ts`, `container_bindings_middleware.ts`, `routes.ts`, `api_provider.ts`, `force_json_response_middleware.ts`, `routes.d.ts`, `@adonisjs/lucid`, `graphql_user_auth.spec.ts`, `handler.ts`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **What connects `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mobile/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `@adonisjs/lucid` connect `@adonisjs/lucid` to `backend/package.json`, `env.ts`, `wishlist_resolver.ts`, `bootstrap.ts`, `api_provider.ts`, `collection_resolver.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `tasks.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09158186864014801 - nodes in this community are weakly interconnected._
- **Why does `@foadonis/graphql` connect `@foadonis/graphql` to `backend/package.json`, `kernel.ts`, `env.ts`, `wishlist_resolver.ts`, `bootstrap.ts`, `routes.ts`, `catalogue_resolver.ts`, `collection_resolver.ts`, `Field`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `UserEntity` be split into smaller, more focused modules?**
  _Cohesion score 0.08489795918367347 - nodes in this community are weakly interconnected._