import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('post_id')
      table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users')
      table.integer('area_id').unsigned().notNullable().references('area_id').inTable('areas')
      table.text('content').notNullable()
      table.enum('post_type', ['news', 'announcement', 'event']).notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}