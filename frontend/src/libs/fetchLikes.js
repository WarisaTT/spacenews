const API_ROOT = import.meta.env.VITE_API_ROOT // ใช้ตัวแปรจาก VITE_API_ROOT

export const addLike = async (postId) => {
  const userId = JSON.parse(localStorage.getItem('payload'))?.userId;
  
  if (!userId) {
    alert('User is not authenticated. Please log in.');
    return;
  }

  const data = {
    user_id: userId,
    post_id: postId
  };

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token is missing or invalid. Please log in.');
      return;
    }

    const response = await fetch(`${API_ROOT}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error adding like:', error.message);
    throw error;
  }
};


export const deleteLike = async (postId) => {
  const userId = JSON.parse(localStorage.getItem('payload'))?.userId;
  
  if (!userId) {
    alert('User is not authenticated. Please log in.');
    return;
  }

  const data = {
    user_id: userId,
    post_id: postId
  };

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token is missing or invalid. Please log in.');
      return;
    }

    const response = await fetch(`${API_ROOT}/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error deleting like:', error.message);
    throw error;
  }
};