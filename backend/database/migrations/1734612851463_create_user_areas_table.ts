import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UserAreas extends BaseSchema {
  protected tableName = 'user_areas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_area_id')
      table.integer('user_id').unsigned().references('users.user_id')
      table.integer('area_id').unsigned().references('areas.area_id')
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}