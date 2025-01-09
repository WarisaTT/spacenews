import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('user_id') // เปลี่ยนจาก id เป็น user_id
      table.string('username').notNullable()
      table.string('password').notNullable()
      table.string('email').unique()
      table.string('full_name')
      table.string('profile_image_url')
      table.timestamps(true)  // ใช้เพื่อสร้าง created_at และ updated_at โดยอัตโนมัติ
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}