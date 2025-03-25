import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'
import { LoginUserValidator } from '#validators/login'

export default class UsersController {
  async login({ auth, request, response }: HttpContext) {
    try {
      const { username, password } = await request.only(['username', 'password'])
      const user = await User.verifyCredentials(username, password)

      if (user) {
        console.log(user)
        const token = await auth.use('jwt').generate(user)
        return response.status(201).json({
          message: 'Login successful',
          data: { token },
        })
      }
    } catch (error) {
      return response.badRequest(error)
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(LoginUserValidator)
      const existingUser = await User.findBy('username', payload.username)

      if (existingUser) {
        return response.status(422).json({
          message: 'The username has already been taken.',
        })
      }
      const user = await User.create({
        username: payload.username,
        password: payload.password,
      })
      if (user) {
        return response.status(201).json({
          message: `The user ${user.username} has been registered successfully. Please login.`,
        })
      }
      return response.status(400).json({
        message: 'Registration failed. Please try again.',
      })
    } catch (error) {
      console.error(error)
      if (error.code === 'E_VALIDATION_ERROR' && error.messages && error.messages.length > 0) {
        return response.status(422).json({
          message: error.messages[0].message,
        })
      }
      return response.status(500).json({
        message: 'An unexpected error occurred.',
        error: error.message,
      })
    }
  }

}
