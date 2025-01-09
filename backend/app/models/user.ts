import { DateTime } from 'luxon'
import { BaseModel, column, hasMany} from '@adonisjs/lucid/orm'
import type { HasMany } from '@/adonisjs/lucid/types/relations'
import Post from './post.js'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'

import hash from '@adonisjs/core/services/hash'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare userId: number

  @column()
  declare username: string

  @column()
  declare password: string

  @column()
  declare email: string

  @column()
  declare fullName: string

  @column()
  declare profileImageUrl: string

  @hasMany(() => Post, {
    foreignKey: 'userId',  // ชื่อคอลัมน์ที่เชื่อมโยงกับ User
    localKey: 'userId'     // คีย์ที่ใช้ในการเชื่อมโยง
  })
  declare posts: HasMany<typeof Post>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime  // ใช้สำหรับจัดการการอัปเดตโดยอัตโนมัติ
}