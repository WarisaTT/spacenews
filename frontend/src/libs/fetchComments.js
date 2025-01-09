const API_ROOT = import.meta.env.VITE_API_ROOT; // ใช้ตัวแปรจาก VITE_API_ROOT

// ฟังก์ชันที่ใช้ดึงข้อมูลจาก API
export const fetchCommentsByPost = async (postId) => {
    try {
        // ตรวจสอบว่า postId เป็นตัวเลขที่ถูกต้องหรือไม่
        if (!Number.isInteger(postId) || postId <= 0) {
            throw new Error('Invalid postId: Post ID must be a positive integer');
        }

        // สร้าง URL ที่จะดึงข้อมูลจาก API
        const url = `${API_ROOT}/comments/${postId}`;

        // ส่งคำขอไปยัง API โดยใช้ fetch
        const response = await fetch(url);

        // ตรวจสอบว่า response.ok เป็นจริงหรือไม่ (หมายความว่า API ตอบกลับสำเร็จ)
        if (!response.ok) {
            const errorMessage = `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // แปลงข้อมูลที่ได้จาก API เป็น JSON
        const data = await response.json();

        // แสดงข้อมูลในคอนโซล (สามารถปรับให้แสดงบนหน้าเว็บได้)
        console.log('Fetched data:', data);

        return data; // ส่งข้อมูลที่ได้กลับไป
    } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงในคอนโซล
        console.error('Fetch error:', error.message);
        throw error; // โยนข้อผิดพลาดต่อไปเพื่อให้ฟังก์ชันที่เรียกสามารถจัดการได้
    }
};

export const addComment = async (comment, postId) => {
    if (!Number.isInteger(postId) || postId <= 0) {
            throw new Error('Invalid postId: Post ID must be a positive integer');
        }
  const userId = JSON.parse(localStorage.getItem('payload'))?.userId;
  
  if (!userId) {
    alert('User is not authenticated. Please log in.');
    return;
  }

  const data = {
    comment: comment,
    userId: userId,
  };

  try {
    const token = localStorage.getItem('token'); // ตรวจสอบชื่อของ token ใน localStorage

    if (!token) {
      alert('Token is missing or invalid. Please log in.');
      return;
    }

    const response = await fetch(`${API_ROOT}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // หากต้องการส่ง token ใน header
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(data),
    });

    // ตรวจสอบสถานะของคำขอ
    if (response.ok) {
      const result = await response.json();
      console.log('Comment added:', result);
      // ทำการรีเฟรชข้อมูลหรือแสดงข้อความเมื่อคอมเมนต์ถูกเพิ่มสำเร็จ
    } else {
      const error = await response.json();
      console.error('Error adding comment:', error);
    }
  } catch (error) {
    console.error('Request failed', error);
  }
};