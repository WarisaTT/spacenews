// fetch/fetchAreas.js
// export async function fetchAreas() {
//   try {
    // ดึงค่า API Root จาก environment variable
//     const apiUrl = import.meta.env.VITE_API_ROOT + '/areas';
//     const response = await fetch(apiUrl, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching areas:', error);
//     return [];
//   }
// }

// fetch/fetchAreas.js
export async function fetchAreaById(areaId) {
  try {
    // ดึงค่า VITE_API_ROOT จาก process.env
    const apiRoot = import.meta.env.VITE_API_ROOT;
    
    // ส่งคำขอไปยัง API
    const response = await fetch(`${apiRoot}/areas/${areaId}`);
    
    // ตรวจสอบสถานะการตอบกลับ
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // แปลงข้อมูลเป็น JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching area with id ${areaId}:`, error.message);
    return null;
  }
}

// Function to fetch areas from the API
// export const fetchAreas = async () => {
//   const apiRoot = import.meta.env.VITE_API_ROOT;
//   try {
//     const response = await fetch(`${apiRoot}/areas`);
//     if (response.ok) {
//       return await response.json();
//     } else {
//       console.error('Error fetching areas');
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching areas:', error);
//     return [];
//   }
// };

// Function to handle adding a new area
export const addArea = async (newAreaName, newAreaDescription, areas, showModal) => {
  if (newAreaName.value.trim() === '' || newAreaDescription.value.trim() === '') {
    alert("Both name and description are required.");
    return;
  }

  const data = {
    areaName: newAreaName.value,
    description: newAreaDescription.value,
  };

  try {
    const apiRoot = import.meta.env.VITE_API_ROOT;
    const response = await fetch(`${apiRoot}/areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      areas.value.push(result); // Add the newly created area to the list
      newAreaName.value = '';
      newAreaDescription.value = '';
      showModal.value = false;
    } else {
      const errorResult = await response.json();
      alert(`Error adding area: ${errorResult.message || 'Unknown error'}`);
      console.error('Error adding area:', errorResult);
    }
  } catch (error) {
    alert('Error sending data to backend: ' + error.message);
    console.error('Error sending data to backend:', error);
  }
};

// Fetch the areas from the backend API
export const fetchAreas = async () => {
  try {
    const apiRoot = import.meta.env.VITE_API_ROOT;
    const response = await fetch(`${apiRoot}/areas`);
    if (!response.ok) {
      throw new Error('Failed to fetch areas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
};
