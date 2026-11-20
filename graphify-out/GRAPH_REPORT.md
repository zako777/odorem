# Graph Report - odorem  (2026-11-20)

## Corpus Check
- 144 files · ~28,790 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 8, .example 1, .graphql 1)

## Summary
- 889 nodes · 1583 edges · 57 communities (36 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 35 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e529e6d8`
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
- models/product.ts
- bootstrap.ts
- schema.ts
- container_bindings_middleware.ts
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
- barcode.spec.ts
- exports
- CatalogueRepository
- events.ts
- listeners.ts
- @adonisjs/eslint-config
- hotHook
- AdonisJS GraphQL e2e Testing Skill
- AdonisJS Unit Testing Skill
- odorem-core
- Product
- @vinejs/vine
- console.ts
- hash.ts
- wishlist_resolver.ts
- test.ts
- silent_auth_middleware.ts
- @adonisjs/shield
- ace.js
- routes.ts
- AccessTokensController
- session.tsx
- @adonisjs/lucid
- graphql_user_auth.spec.ts

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
- `Barcode` --references--> `Product`  [EXTRACTED]
  backend/app/models/barcode.ts → backend/app/models/product.ts
- `Barcode` --inherits--> `BarcodeSchema`  [EXTRACTED]
  backend/app/models/barcode.ts → backend/database/schema.ts
- `Concentration` --inherits--> `ConcentrationSchema`  [EXTRACTED]
  backend/app/models/concentration.ts → backend/database/schema.ts
- `Product` --references--> `Concentration`  [EXTRACTED]
  backend/app/models/product.ts → backend/app/models/concentration.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Technology Stack** — backend, adonisjs_lucid, adonisjs_graphql_ddd, postgresql [EXTRACTED 1.00]
- **Testing Strategy** — adonisjs_unit_testing, adonisjs_graphql_e2e_testing [EXTRACTED 1.00]

## Communities (57 total, 21 thin omitted)

### Community 0 - "@adonisjs/core"
Cohesion: 0.17
Nodes (9): Data, User, Variants, NewAccountController, ProfileController, User, UserTransformer, bodyParserConfig (+1 more)

### Community 1 - "mobile/package.json"
Cohesion: 0.05
Nodes (41): devDependencies, eslint, eslint-config-expo, @types/react, typescript, eslint, typescript, main (+33 more)

### Community 2 - "tasks.py"
Cohesion: 0.09
Nodes (18): backend(), build(), check(), _compose(), docker_build(), docker_down(), docker_logs(), docker_up() (+10 more)

### Community 3 - "UserEntity"
Cohesion: 0.07
Nodes (20): AuthPayload, LoginUserInput, RegisterUserInput, UserPublicProfile, UserResolver, LoginUser, LoginUserInput, RegisterUser (+12 more)

### Community 4 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 5 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, expo, expo-camera, expo-constants, expo-device, expo-font, expo-glass-effect, expo-image (+18 more)

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
Cohesion: 0.16
Nodes (3): AdonisJS GraphQL + DDD Skill, corsConfig, @adonisjs/cors

### Community 13 - "auth.ts"
Cohesion: 0.29
Nodes (5): @adonisjs/auth/types, @adonisjs/core/types, authConfig, Authenticators, EventsList

### Community 14 - "env.ts"
Cohesion: 0.13
Nodes (10): appUrl, http, databaseConnection, dbConfig, @adonisjs/core/types, encryptionConfig, EncryptorsList, @adonisjs/core/types (+2 more)

### Community 15 - "models/product.ts"
Cohesion: 0.14
Nodes (9): Concentration, Perfume, GraphQLClient, GraphQLResponse, GraphQLClient, GraphQLResponse, GraphQLClient, GraphQLResponse (+1 more)

### Community 16 - "bootstrap.ts"
Cohesion: 0.15
Nodes (9): sessionConfig, @japa/api-client/types, plugins, RoutesRegistry, runnerHooks, @adonisjs/session, @japa/api-client, @japa/assert (+1 more)

### Community 17 - "schema.ts"
Cohesion: 0.44
Nodes (8): AuthAccessTokenSchema, BarcodeSchema, ConcentrationSchema, PerfumeSchema, PossessionSchema, ProductSchema, UserSchema, WishlistItemSchema

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
Cohesion: 0.06
Nodes (27): ProductNotFoundError, AddToCollection, AddToCollectionInput, ListCollection, ListCollectionQuery, RemovePossession, RemovePossessionInput, UpdatePossession (+19 more)

### Community 27 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, better-sqlite3, esbuild, fsevents, @swc/core

### Community 29 - "AdonisJS Lucid ORM: Standard Workflow"
Cohesion: 0.12
Nodes (16): AdonisJS Lucid ORM: Standard Workflow, Checklist before finishing any DB task, Command reference, Core principle, Hard rules, Hooks (lifecycle logic on the model), Relationships cheat sheet, Step 1. Create the migration (+8 more)

### Community 31 - "barcode.spec.ts"
Cohesion: 0.25
Nodes (3): Barcode, GraphQLClient, GraphQLResponse

### Community 32 - "exports"
Cohesion: 0.67
Nodes (3): exports, ./data, ./registry

### Community 33 - "CatalogueRepository"
Cohesion: 0.05
Nodes (25): FindProductByBarcode, GetPerfume, ListProductsByPerfume, SearchPerfumes, SearchPerfumesInput, CatalogueRepository, PerfumesPage, ScannedProduct (+17 more)

### Community 43 - "Product"
Cohesion: 0.32
Nodes (3): Possession, Product, WishlistItem

### Community 44 - "@vinejs/vine"
Cohesion: 0.29
Nodes (5): barcodeValidator, VineGlobalTransforms, @vinejs/vine/types, luxon, @vinejs/vine

### Community 46 - "hash.ts"
Cohesion: 0.50
Nodes (3): @adonisjs/core/types, hashConfig, HashersList

### Community 47 - "wishlist_resolver.ts"
Cohesion: 0.06
Nodes (20): WishlistEntryType, WishlistItemType, WishlistPage, WishlistResolver, AddToWishlist, AddToWishlistInput, ListWishlist, ListWishlistQuery (+12 more)

### Community 53 - "routes.ts"
Cohesion: 0.25
Nodes (4): controllers, AuthMiddleware, middleware, @adonisjs/auth

### Community 57 - "session.tsx"
Cohesion: 0.09
Nodes (38): Index(), LoginForm(), styles, RootLayout(), PerfumeDetail, PerfumeScreen(), styles, PerfumesPage (+30 more)

## Knowledge Gaps
- **47 isolated node(s):** `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig`, `@types/luxon`, `@types/node` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 440 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@adonisjs/core` connect `@adonisjs/core` to `UserEntity`, `backend/package.json`, `@foadonis/graphql`, `kernel.ts`, `env.ts`, `hash.ts`, `test.ts`, `silent_auth_middleware.ts`, `container_bindings_middleware.ts`, `bootstrap.ts`, `models/product.ts`, `routes.ts`, `api_provider.ts`, `force_json_response_middleware.ts`, `routes.d.ts`, `graphql_user_auth.spec.ts`, `handler.ts`, `barcode.spec.ts`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **What connects `@adonisjs/assembler`, `@adonisjs/prettier-config`, `@adonisjs/tsconfig` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mobile/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Why does `@adonisjs/lucid` connect `@adonisjs/lucid` to `backend/package.json`, `Product`, `env.ts`, `models/product.ts`, `wishlist_resolver.ts`, `schema.ts`, `bootstrap.ts`, `api_provider.ts`, `collection_resolver.ts`, `barcode.spec.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Should `tasks.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09158186864014801 - nodes in this community are weakly interconnected._
- **Why does `@foadonis/graphql` connect `@foadonis/graphql` to `CatalogueRepository`, `UserEntity`, `backend/package.json`, `kernel.ts`, `wishlist_resolver.ts`, `bootstrap.ts`, `routes.ts`, `collection_resolver.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `UserEntity` be split into smaller, more focused modules?**
  _Cohesion score 0.06656426011264721 - nodes in this community are weakly interconnected._