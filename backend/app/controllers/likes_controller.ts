import type { HttpContext } from '@adonisjs/core/http'
import Like from '../models/like.js'

export default class LikesController {
  // Add a like
  public async store({ request }: HttpContext) {
    const data = {
      userId: request.input('user_id'),  // รับ user_id จาก body
      postId: request.input('post_id'),  // รับ post_id จาก body
    }
    
    const existingLike = await Like.query().where('user_id', data.userId).where('post_id', data.postId).first()

    if (existingLike) {
      return { message: 'Already liked this post' }
    }

    await Like.create(data)
    return { message: 'Like added successfully' }
  }

  // Delete a like
  public async destroy({ request }: HttpContext) {
    const userId = request.input('user_id')
    const postId = request.input('post_id')
    
    const like = await Like.query().where('post_id', postId).where('user_id', userId).firstOrFail()
    await like.delete()
    return { message: 'Like removed successfully' }
  }
}