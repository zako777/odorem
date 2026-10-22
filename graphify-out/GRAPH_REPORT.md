# Graph Report - odorem  (2026-10-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 515 nodes · 717 edges · 43 communities (24 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c09d95d`
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
- UserResolver
- bootstrap.ts
- console.ts
- @adonisjs/lucid
- scripts
- mobile/tsconfig.json
- Backend API (AdonisJS)
- api_provider.ts
- compilerOptions
- force_json_response_middleware.ts
- routes.d.ts
- test.ts
- allowScripts
- handler.ts
- logger.ts
- @adonisjs/shield
- exports
- ace.js
- events.ts
- listeners.ts
- @adonisjs/eslint-config
- hotHook
- AdonisJS GraphQL e2e Testing Skill
- AdonisJS Unit Testing Skill
- odorem-core

## God Nodes (most connected - your core abstractions)
1. `@adonisjs/core` - 32 edges
2. `UserEntity` - 21 edges
3. `imports` - 21 edges
4. `expo` - 13 edges
5. `UserRepository` - 12 edges
6. `_npm()` - 12 edges
7. `InMemoryUserRepository` - 9 edges
8. `User` - 8 edges
9. `check()` - 8 edges
10. `_compose()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Development Tools` --references--> `Infrastructure & Dev Tools`  [EXTRACTED]
  docs/setup.md → CLAUDE.md
- `InMemoryUserRepository` --references--> `UserPersistenceInput`  [EXTRACTED]
  backend/tests/unit/user/support/in_memory_user_repository.ts → backend/app/user/domain/user_repository.ts
- `InMemoryUserRepository` --implements--> `UserRepository`  [EXTRACTED]
  backend/tests/unit/user/support/in_memory_user_repository.ts → backend/app/user/domain/user_repository.ts
- `InMemoryUserRepository` --references--> `UserEntity`  [EXTRACTED]
  backend/tests/unit/user/support/in_memory_user_repository.ts → backend/app/user/domain/user.ts
- `LucidUserRepository` --implements--> `UserRepository`  [EXTRACTED]
  backend/app/user/infrastructure/persistence/lucid_user_repository.ts → backend/app/user/domain/user_repository.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Technology Stack** — backend, adonisjs_lucid, adonisjs_graphql_ddd, postgresql [EXTRACTED 1.00]
- **Testing Strategy** — adonisjs_unit_testing, adonisjs_graphql_e2e_testing [EXTRACTED 1.00]

## Communities (43 total, 19 thin omitted)

### Community 0 - "@adonisjs/core"
Cohesion: 0.06
Nodes (26): Data, User, Variants, AccessTokensController, NewAccountController, ProfileController, AuthPayload, LoginUserInput (+18 more)

### Community 1 - "mobile/package.json"
Cohesion: 0.04
Nodes (42): typescript, devDependencies, @types/react, typescript, main, name, private, scripts (+34 more)

### Community 2 - "tasks.py"
Cohesion: 0.10
Nodes (16): backend(), build(), check(), _compose(), docker_build(), docker_down(), docker_logs(), docker_up() (+8 more)

### Community 3 - "UserEntity"
Cohesion: 0.11
Nodes (13): LoginUser, LoginUserInput, RegisterUser, RegisterUserInput, InvalidCredentialsError, UserAlreadyExistsError, UserPersistenceInput, UserRepository (+5 more)

### Community 4 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, reactCompiler, typedRoutes (+16 more)

### Community 5 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, expo, expo-constants, expo-device, expo-font, expo-glass-effect, expo-image, expo-linking (+16 more)

### Community 6 - "index.ts"
Cohesion: 0.11
Nodes (14): placeholder, registry, routes, @tuyau/core/types, UserRegistry, ParamValue, ApiDefinition, AuthAccessTokenSchema (+6 more)

### Community 7 - "backend/package.json"
Cohesion: 0.09
Nodes (22): license, name, prettier, private, type, version, @adonisjs/assembler, @adonisjs/prettier-config (+14 more)

### Community 8 - "imports"
Cohesion: 0.10
Nodes (21): imports, #abilities/*, #config/*, #controllers/*, #database/*, #events/*, #exceptions/*, #generated/* (+13 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, @adonisjs/auth, @adonisjs/core, @adonisjs/cors, @adonisjs/lucid, @adonisjs/session, @adonisjs/shield, @apollo/server (+11 more)

### Community 10 - "@foadonis/graphql"
Cohesion: 0.12
Nodes (8): controllers, DemoResolver, @foadonis/graphql/types, graphqlConfig, GraphQLDriver, PubSubDriver, SubscriptionDriver, @foadonis/graphql

### Community 11 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @adonisjs/assembler, @adonisjs/eslint-config, @adonisjs/prettier-config, @adonisjs/tsconfig, eslint, hot-hook, @japa/assert (+9 more)

### Community 13 - "auth.ts"
Cohesion: 0.17
Nodes (8): AuthMiddleware, @adonisjs/auth/types, @adonisjs/core/types, authConfig, Authenticators, EventsList, middleware, @adonisjs/auth

### Community 14 - "env.ts"
Cohesion: 0.18
Nodes (7): appUrl, http, @adonisjs/core/types, encryptionConfig, EncryptorsList, sessionConfig, @adonisjs/session

### Community 16 - "bootstrap.ts"
Cohesion: 0.20
Nodes (7): @japa/api-client/types, plugins, RoutesRegistry, runnerHooks, @japa/api-client, @japa/assert, @japa/plugin-adonisjs

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

### Community 27 - "allowScripts"
Cohesion: 0.40
Nodes (5): allowScripts, better-sqlite3, esbuild, fsevents, @swc/core

### Community 29 - "logger.ts"
Cohesion: 0.50
Nodes (3): @adonisjs/core/types, loggerConfig, LoggersList

### Community 32 - "exports"
Cohesion: 0.67
Nodes (3): exports, ./data, ./registry

## Knowledge Gaps
- **46 isolated node(s):** `expo`, `expo-constants`, `expo-device`, `expo-font`, `expo-glass-effect` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 316 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@adonisjs/core` connect `@adonisjs/core` to `UserEntity`, `backend/package.json`, `@foadonis/graphql`, `kernel.ts`, `auth.ts`, `env.ts`, `bootstrap.ts`, `api_provider.ts`, `force_json_response_middleware.ts`, `routes.d.ts`, `test.ts`, `handler.ts`, `logger.ts`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **What connects `expo`, `expo-constants`, `expo-device` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `@adonisjs/core` be split into smaller, more focused modules?**
  _Cohesion score 0.058069381598793365 - nodes in this community are weakly interconnected._
- **Why does `typescript` connect `mobile/package.json` to `backend/package.json`?**
  _High betweenness centrality (0.181) - this node is a cross-community bridge._
- **Should `mobile/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `mobile/package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `tasks.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09856035437430787 - nodes in this community are weakly interconnected._