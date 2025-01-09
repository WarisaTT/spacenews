import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Comments extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('comment_id')
      table.integer('post_id').unsigned().references('posts.post_id')
      table.integer('user_id').unsigned().references('users.user_id')
      table.text('comment')
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}