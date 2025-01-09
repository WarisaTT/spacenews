import type { HttpContext } from '@adonisjs/core/http'
import Post from '../models/post.js'

export default class PostsController {
  // public async index() {
  //   return Post.all()
  // }

  // public async show({ params }: HttpContext) {
  //   return Post.findOrFail(params.id)
  // }

  public async store({ request, auth, response }: HttpContext) {
    await auth.authenticate() // ทำการยืนยันตัวตน
    try {
      const data = request.only(['content', 'areaId'])
      const { content, areaId } = data

      if (!content || !areaId) {
        return response.status(400).send({ message: 'Both content and areaId are required.' })
      }

      const userId = auth.user?.userId // ดึง userId จาก auth

      if (!userId) {
        return response.status(401).send({ message: 'User not authenticated.' })
      }

      const post = await Post.create({
        ...data,
        userId,
      })

      return response.status(201).send(post)
    } catch (error) {
      console.error('Error creating post:', error)
      return response.status(500).send({ message: 'Error creating post.' })
    }
  }

  public async update({ params, auth, request, response }: HttpContext) {
    await auth.authenticate() // ทำการยืนยันตัวตน
    try {
      // ตรวจสอบว่า params.postId มีค่าหรือไม่
      if (!params.postId || isNaN(Number(params.postId))) {
        return { error: 'Invalid post ID' } // หากไม่มีค่า หรือไม่ใช่ตัวเลข
      }

      const userId = auth.user?.userId // ดึง userId จาก auth

      if (!userId) {
        return response.status(401).send({ message: 'User not authenticated.' })
      }

      // ค้นหาโพสต์ตาม postId
      const post = await Post.findOrFail(params.postId)

      // ดึงข้อมูลจาก request
      const data = request.only(['content'])

      // อัปเดตโพสต์
      post.merge(data)
      await post.save()

      return post // ส่งกลับโพสต์ที่อัปเดตแล้ว
    } catch (error) {
      console.error('Error updating post:', error)
      return { error: 'Post not found or failed to update' } // หากเกิดข้อผิดพลาด
    }
  }

  public async destroy({ params, auth, response }: HttpContext) {
    await auth.authenticate() // ทำการยืนยันตัวตน
    const userId = auth.user?.userId // ดึง userId จาก auth

    if (!userId) {
      return response.status(401).send({ message: 'User not authenticated.' })
    }
    const post = await Post.findOrFail(params.postId)
    await post.delete()
    return { message: 'Post deleted successfully' }
  }

  public async getPostsByArea({ params }: HttpContext) {
    const posts = await Post.query()
      .where('area_id', params.areaId) // ใช้ area_id จาก params
      .preload('user')
      .preload('area')
      .preload('likes') // preload ข้อมูล likes ที่เชื่อมโยงกับโพสต์
      .preload('comments')
      .withCount('likes') // นับจำนวน likes
      .withCount('comments')
      .orderBy('updated_at', 'desc') // จัดเรียงโพสต์โดยใช้ created_at จากใหม่ไปเก่า
    return posts
  }
}
