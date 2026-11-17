import { BarcodeSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Product from './product.js'

export default class Barcode extends BarcodeSchema {
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}
