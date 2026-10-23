import { PerfumeSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Product from './product.js'

export default class Perfume extends PerfumeSchema {
  @hasMany(() => Product)
  declare products: HasMany<typeof Product>
}
