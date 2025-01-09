import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Areas extends BaseSchema {
  protected tableName = 'areas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('area_id')
      table.string('area_name').notNullable()
      table.text('description')
      table.string('area_image_url')
      table.enum('category', ['university', 'community']).defaultTo('community')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}