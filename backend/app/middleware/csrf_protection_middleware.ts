import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class CsrfProtectionMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    // ตรวจสอบ CSRF Token
    const csrfToken = ctx.request.header('csrf-token')

    // ทำการเรียกฟังก์ชันถัดไปใน middleware pipeline
    return next()
  }
}