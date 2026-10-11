/*
|--------------------------------------------------------------------------
| GraphQL resolvers registration file
|--------------------------------------------------------------------------
|
| DO NOT MODIFY THIS FILE AS IT WILL BE OVERRIDDEN DURING THE BUILD PROCESS
|
| It automatically register your resolvers present in `app/graphql/resolvers`.
| You can disable this behavior by removing the `indexResolvers` from your `adonisrc.ts`.
|
*/

import graphql from '@foadonis/graphql/services/main'
import app from '@adonisjs/core/services/app'

graphql.resolvers([
  () => import('#graphql/resolvers/demo_resolver'),
])

graphql.hmr(app.makePath('app/graphql/resolvers'))
