import { jwtDecode } from "jwt-decode"; // นำเข้า jwtDecode ให้ถูกต้อง

// ฟังก์ชัน Login
async function Login(url, obj, setErrorMessage) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: obj.username,
        password: obj.password,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log(data);

      // เอา token ออกมาจากข้อมูลที่ได้รับจากการตอบกลับ
      const token = data.data.token.token;

      // ถอดรหัส JWT token เพื่อดึงข้อมูล payload
      const payload = jwtDecode(token);
      console.log(token);
      console.log(payload);

      // เก็บ payload ลง localStorage
      localStorage.setItem("payload", JSON.stringify(payload));
      
      // คุณสามารถเก็บ token ด้วยก็ได้ถ้าต้องการใช้งาน
      localStorage.setItem("token", token);

      return response;
    } else {
      const errorData = await response.json();
      const errorMessage = errorData[0]?.message || "Username and Password incorrect.";
      setErrorMessage(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

// ฟังก์ชัน Register
async function Register(url, obj) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed. Please try again.");
    }

    const res = await response.json();
    console.log(res);
    
    return res 
  } catch (error) {
    console.error("Registration error:", error);
    throw error
  }
}
export default { Login, Register }; // ใช้ export ชัดเจน