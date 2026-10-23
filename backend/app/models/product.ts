import { ProductSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Perfume from './perfume.js'
import Concentration from './concentration.js'

export default class Product extends ProductSchema {
  @belongsTo(() => Perfume)
  declare perfume: BelongsTo<typeof Perfume>

  @belongsTo(() => Concentration)
  declare concentration: BelongsTo<typeof Concentration>
}
