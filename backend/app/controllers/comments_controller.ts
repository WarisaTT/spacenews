import type { HttpContext } from '@adonisjs/core/http'
import Comment from '../models/comment.js'

export default class CommentsController {
  public async getComments({ params }: HttpContext) {
    if (!params.postId) {
      throw new Error('Post ID is required');
    }
    return Comment.query().where('post_id', params.postId).preload('user').orderBy('created_at', 'desc');;
  }

  public async store({ params, auth, request, response }: HttpContext) {
    await auth.authenticate();
    const { comment } = request.only(['comment']);
    const userId = auth.user?.userId;

    if (!userId) {
      return response.status(401).send({ message: "User not authenticated." });
    }
    const data = {
      comment,
      userId,
      postId: params.postId
    };
    return Comment.create(data);
  }

  //   public async update({ params, request }: HttpContext) {
  //   const comment = await Comment.findOrFail(params.id)

  //   // แปลงฟิลด์ content จาก request เป็น comment เพื่อให้ตรงกับโมเดล
  //   const data = request.only(['content'])
  //   const updateData = {
  //     comment: data.content, // ใช้ชื่อฟิลด์ที่สอดคล้องกับโมเดล
  //   }

  //   comment.merge(updateData)
  //   await comment.save()

  //   return comment
  // }

  //   public async destroy({ params }: HttpContext) {
  //     const comment = await Comment.findOrFail(params.id)
  //     await comment.delete()
  //     return { message: 'Comment deleted successfully' }
  //   }
}