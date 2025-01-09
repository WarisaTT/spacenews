import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  declare likeId: number

  @column()
  declare postId: number

  @column()
  declare userId: number

  @column()
  declare emotion: 'like' | 'love' | 'surprised' | 'sad' | 'angry'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}