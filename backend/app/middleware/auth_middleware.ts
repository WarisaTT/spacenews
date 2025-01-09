import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used to authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * Handle the request and ensure the user is authenticated.
   * If authentication fails, return a JSON response with an error message.
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      // Attempt to authenticate the user using the specified guards
      await ctx.auth.authenticateUsing(options.guards)
      
      // Continue to the next middleware or controller action
      await next()
    } catch {
      // If authentication fails, return a 401 Unauthorized response
      return ctx.response.unauthorized({ message: 'User not authenticated.' })
    }
  }
}