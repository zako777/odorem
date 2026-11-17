import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'possessions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE').notNullable()
      table.integer('product_id').unsigned().references('products.id').notNullable()
      table.integer('quantity').unsigned().notNullable().defaultTo(1)
      table.enum('condition', ['new', 'opened', 'finished']).notNullable().defaultTo('new')
      table.integer('rating').unsigned().nullable()
      table.text('comment').nullable()

      table.unique(['user_id', 'product_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
