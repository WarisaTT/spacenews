import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserArea extends BaseModel {
  @column({ isPrimary: true })
  declare userAreaId: number

  @column()
  declare userId: number

  @column()
  declare areaId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}