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
      // ใช้ LoginUserValidator เพื่อ validate ข้อมูลที่รับมาจาก request
      const payload = await request.validateUsing(LoginUserValidator)

      // ถ้าผ่าน validation ก็สามารถบันทึกผู้ใช้ใหม่ได้
      const user = await User.create({
        username: payload.username,
        password: payload.password,
      })

      return response.status(201).json({
        message: `The user ${user.username} has been registered successfully.`,
        data: { username: user.username, email: user.email },
      })
    } catch (error) {
      console.error(error) // Log ข้อผิดพลาดที่เกิดขึ้น
      return response.status(400).json({
        message: 'An error occurred while registering the user.',
        error: error,
      })
    }
  }
}
