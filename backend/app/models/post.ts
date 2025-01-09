import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@/adonisjs/lucid/types/relations'
import User from './user.js'
import Area from './area.js' // Import the Area model
import Like from './like.js'
import Comment from './comment.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare postId: number

  @column()
  declare userId: number

  @column()
  declare areaId: number

  @column()
  declare content: string

  @column()
  declare postType: 'news' | 'announcement' | 'event'

  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'userId'
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Area, {
    foreignKey: 'areaId', // Reference to the Area model
    localKey: 'areaId'    // Link this with the Area's `areaId`
  })
  declare area: BelongsTo<typeof Area> // Declare the relationship with Area

  @hasMany(() => Like, { foreignKey: 'postId' })
  declare likes: HasMany<typeof Like>

  @hasMany(() => Comment, { foreignKey: 'postId' })
  declare comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}