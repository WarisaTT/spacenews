import type { HttpContext } from '@adonisjs/core/http'
import Comment from '../models/comment.js'

export default class CommentsController {
  public async getComments({ params }: HttpContext) {
  if (!params.postId) {
    throw new Error('Post ID is required');
  }
  return Comment.query().where('post_id', params.postId).preload('user');

}

  public async store({ params, auth, request, response }: HttpContext) {
  // ทำการยืนยันตัวตน
  await auth.authenticate();
  
  // ดึงข้อมูล comment และ user_id จาก request
  const { comment } = request.only(['comment']);
  const userId = auth.user?.userId;  // ดึง userId จาก auth

  // ตรวจสอบการยืนยันตัวตน
  if (!userId) {
    return response.status(401).send({ message: "User not authenticated." });
  }

  // กำหนดข้อมูลที่จะบันทึกลงในฐานข้อมูล
  const data = {
    comment,  // ใช้ชื่อฟิลด์ให้ตรงกับโมเดล
    userId,   // ใช้ userId จาก auth
    postId: params.postId, // postId ตามโมเดล
  };

  // สร้างคอมเมนต์ใหม่ในฐานข้อมูล
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