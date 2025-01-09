import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo} from '@adonisjs/lucid/orm'
import type { BelongsTo} from '@/adonisjs/lucid/types/relations'
import User from './user.js'


export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare commentId: number

  @column()
  declare postId: number

  @column()
  declare userId: number

  @column()
  declare comment: string

  @belongsTo(() => User, {
      foreignKey: 'userId',
      localKey: 'userId'
    })
    declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}