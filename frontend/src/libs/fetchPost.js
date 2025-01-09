const API_ROOT = import.meta.env.VITE_API_ROOT // ใช้ตัวแปรจาก VITE_API_ROOT

// ฟังก์ชัน fetch สำหรับดึงข้อมูลโพสต์ตาม areaId
// export const fetchPostsByArea = async (areaId) => {
//   try {
//     if (!areaId || typeof areaId !== 'number') {
//       throw new Error('Invalid areaId: Area ID must be a valid number')
//     }

//     // สร้าง URL สำหรับเรียก API
//     const url = `${API_ROOT}/posts/area/${areaId}`

//     // เรียก API
//     const response = await fetch(url)

//     // ตรวจสอบสถานะของการตอบกลับ
//     if (!response.ok) {
//       const errorMessage = `Error ${response.status}: ${response.statusText}`
//       throw new Error(errorMessage)
//     }

//     // แปลงข้อมูลเป็น JSON
//     const data = await response.json()

//     // เก็บข้อมูลลงใน localStorage
//     localStorage.setItem(`posts_area_${areaId}`, JSON.stringify(data))

//     // คืนค่าข้อมูลที่ได้จาก API
//     return data
//   } catch (error) {
//     // แสดงข้อผิดพลาดใน console และโยนข้อผิดพลาดกลับ
//     console.error('Fetch error:', error.message)
//     throw error
//   }
// }

export const fetchPostsByArea = async (areaId) => {
  try {
    const response = await fetch(`${API_ROOT}/posts/area/${areaId}`)
    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }
    const data = await response.json()
    console.log(data)
    localStorage.setItem(`posts_area_${areaId}`, JSON.stringify(data))
    return data
  } catch (error) {
    console.error('Fetch error:', error.message)
    throw error
  }
}

// fetchPost.js (or utils/fetchPost.js)
// export const addPost = async (content) => {
//     const apiRoot = import.meta.env.VITE_API_ROOT;  // Ensure the API root is defined in .env file
//     const response = await fetch(`${apiRoot}/posts`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ content }),  // Send content as the request payload
//     });

//     if (!response.ok) {
//         throw new Error('Error adding post');
//     }

//     return await response.json();  // Return the created post data
// };

export const addPost = async (content, areaId, emit) => {
  // ตรวจสอบว่า content และ areaId ไม่เป็น undefined
  const userId = JSON.parse(localStorage.getItem('payload'))?.userId

  if (!userId) {
    alert('User is not authenticated. Please log in.')
    return
  }

  const data = {
    content: content.value,
    areaId: areaId.value,
    userId: userId // ส่ง userId ไปยัง backend
  }

  try {
    // ดึง token จาก localStorage หรือ sessionStorage
    const token = localStorage.getItem('token') // ตรวจสอบชื่อของ token ใน localStorage

    if (!token) {
      alert('Token is missing or invalid. Please log in.')
      return
    }

    const response = await fetch(`${API_ROOT}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // ส่ง token ใน header
      },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      const result = await response.json()
      emit('post', result) // ส่งข้อมูลโพสต์ที่สร้างใหม่ไปยัง parent component
      content.value = '' // ล้างข้อความหลังโพสต์
    }
  } catch (error) {
    alert('Error sending data to backend: ' + error.message)
    console.error('Error sending data to backend:', error)
  }
}

export const updatePost = async (postId, content, emit) => {
  const userId = JSON.parse(localStorage.getItem('payload'))?.userId
  if (!userId) {
    alert('User is not authenticated. Please log in.')
    return
  }

  const data = {
    content: content.value,
    userId: userId // ส่ง userId ไปยัง backend
  }

  try {
    if (!postId || isNaN(Number(postId))) {
      throw new Error('Invalid post ID: Post ID must be a valid number')
    }

    const token = localStorage.getItem('token') // ดึง token จาก localStorage
    if (!token) {
      alert('Token is missing or invalid. Please log in.')
      return
    }

    // สร้าง URL สำหรับเรียก API
    const url = `${API_ROOT}/posts/${postId}`

    // เรียก API
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // ส่ง token ใน header
      },
      body: JSON.stringify({ content }) // ส่งข้อมูลใหม่ไปยัง backend
    })

    // ตรวจสอบสถานะของการตอบกลับ
    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`
      emit('post', result) // ส่งข้อมูลโพสต์ที่สร้างใหม่ไปยัง parent component
      throw new Error(errorMessage)
    }

    // แปลงข้อมูลเป็น JSON
    const updatedPost = await response.json()

    console.log(updatedPost);
    
    // คืนค่าข้อมูลโพสต์ที่อัปเดตแล้ว
    return updatedPost
    
  } catch (error) {
    console.error('Error updating post:', error.message)
    throw error
  }
}

// ฟังก์ชันสำหรับลบโพสต์
export const deletePost = async (postId) => {
  try {
    // ตรวจสอบว่า postId เป็นตัวเลขที่ถูกต้อง
    if (!postId || isNaN(Number(postId))) {
      throw new Error('Invalid post ID: Post ID must be a valid number');
    }

    // ดึง token จาก localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token is missing or invalid. Please log in.');
      return;
    }

    // สร้าง URL สำหรับเรียก API
    const url = `${API_ROOT}/posts/${postId}`;

    // เรียก API เพื่อลบโพสต์
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}` // ส่ง token ใน header
      }
    });

    // ตรวจสอบสถานะของการตอบกลับ
    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // แปลงข้อมูลการตอบกลับเป็น JSON
    const result = await response.json();

    // คืนค่าข้อความสำเร็จหรือตัวบ่งชี้อื่นๆ ที่เกี่ยวข้อง
    return result;
  } catch (error) {
    console.error('Error deleting post:', error.message);
    throw error;
  }
};
