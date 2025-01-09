import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Area extends BaseModel {
  @column({ isPrimary: true })
  declare areaId: number

  @column()
  declare areaName: string

  @column()
  declare description: string

  @column()
  declare areaImageUrl: string

  @column()
  declare category: 'university' | 'community'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}