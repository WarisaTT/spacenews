import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Likes extends BaseSchema {
  protected tableName = 'likes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('like_id')
      table.integer('post_id').unsigned().references('posts.post_id').onDelete('cascade')
      table.integer('user_id').unsigned().references('users.user_id')
      table.enum('emotion', ['like', 'love', 'surprised', 'sad', 'angry']).defaultTo('like')
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}