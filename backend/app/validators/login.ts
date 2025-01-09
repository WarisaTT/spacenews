import vine from '@vinejs/vine'

// สร้าง schema การตรวจสอบข้อมูลสำหรับผู้ใช้งาน
const schema = vine.object({
    username: vine.string()
        .minLength(6)  // ความยาวของ username ต้องไม่น้อยกว่า 6 ตัวอักษร
        .unique(async (db, value) => {
            const user = await db.from('users')
                .where('username', value)
                .first()  // ตรวจสอบในตาราง users ว่ามีชื่อผู้ใช้ซ้ำหรือไม่
            return !user  // ถ้าไม่มีผู้ใช้ที่ซ้ำกัน ให้ส่ง true
        }),
    password: vine.string()
        .minLength(6)  // ความยาวของ password ต้องไม่น้อยกว่า 6 ตัวอักษร
        .confirmed()  // ตรวจสอบว่า password และ password_confirmation ตรงกัน
})

// คอมไพล์ schema ให้เป็น validator
export const LoginUserValidator = vine.compile(schema)