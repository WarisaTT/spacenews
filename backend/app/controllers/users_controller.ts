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

      // ตรวจสอบว่า username นี้มีอยู่แล้วในระบบหรือไม่
      const existingUser = await User.findBy('username', payload.username)

      if (existingUser) {
        // ถ้ามี username นี้อยู่แล้ว
        return response.status(422).json({
          message: 'The username has already been taken.',
        })
      }

      // ถ้าไม่มี username นี้ในระบบก็สามารถสร้างผู้ใช้ใหม่ได้
      const user = await User.create({
        username: payload.username,
        password: payload.password,
      })

      // ตรวจสอบการสร้างผู้ใช้ใหม่
      if (user) {
        // ถ้าสำเร็จ ส่งข้อความการลงทะเบียนสำเร็จพร้อมกับ redirect ไปที่หน้า login
        return response.status(201).json({
          message: `The user ${user.username} has been registered successfully. Please login.`,
        })
      }

      // ถ้าการบันทึกผู้ใช้ไม่สำเร็จ ให้ส่ง error
      return response.status(400).json({
        message: 'Registration failed. Please try again.',
      })
    } catch (error) {
      console.error(error) // Log ข้อผิดพลาดที่เกิดขึ้น

      // หากมีข้อผิดพลาดเกี่ยวกับ validation ให้แสดง error message ที่เกี่ยวข้อง
      if (error.code === 'E_VALIDATION_ERROR' && error.messages && error.messages.length > 0) {
        return response.status(422).json({
          message: error.messages[0].message, // แสดงข้อความแรกจาก messages
        })
      }

      // หากไม่ใช่ข้อผิดพลาดที่เกี่ยวข้องกับ validation
      return response.status(500).json({
        message: 'An unexpected error occurred.',
        error: error.message, // แสดง error message ที่เกิดขึ้น
      })
    }
  }

}
