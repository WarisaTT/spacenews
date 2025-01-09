<template>
    <div class="relative flex justify-between items-center bg-[#9F2B2B] text-white">
        <!-- ปุ่ม Power -->
        <div class="flex items-center py-3 pl-3">
            <button @click="logout" class="w-8 h-8 rounded-full flex items-center justify-center">
                <img :src="PowerIcon" alt="Power Icon" />
            </button>
        </div>

        <!-- ข้อความ -->
        <p v-if="title" class="font-itim text-[30px] text-[#FFF7CB] absolute left-1/2 transform -translate-x-1/2">{{ title }}</p>

        <!-- ปุ่ม Profile -->
        <div class="flex items-center py-3 pr-3">
            <!-- แสดงชื่อ username -->
            <p class="mr-3 text-[#FFF7CB] font-itim text-lg">{{ username }}</p>
            <button class="w-8 h-8 rounded-full flex items-center justify-center">
                <img :src="ProfileIcon" alt="Profile Icon" />
            </button>
        </div>
    </div>
</template>

<script setup>
import PowerIcon from './icons/power-off.png'; // ไฟล์ไอคอน Power
import ProfileIcon from './icons/profile-user.png'; // ไฟล์ไอคอนโปรไฟล์
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// รับ props
defineProps({
    title: {
        type: String, // ประเภทของ prop
        default: '', // ค่าเริ่มต้นเป็นค่าว่าง
    },
});

// สร้างตัวแปรเก็บชื่อ username
const username = ref('')

// ดึงข้อมูลจาก localStorage เมื่อ component ถูก mount
onMounted(() => {
  const payload = localStorage.getItem('payload')
  if (payload) {
    try {
      const parsedPayload = JSON.parse(payload) // ถอดรหัส JSON
      username.value = parsedPayload.username // ดึง username
    } catch (error) {
      console.error('Error parsing payload:', error)
    }
  }
})

// ใช้ router ในการนำทาง
const router = useRouter()

// ฟังก์ชัน logout
const logout = () => {
  // ลบข้อมูล payload และ token ออกจาก localStorage
  localStorage.removeItem('payload')
  localStorage.removeItem('token')

  // นำทางไปยังหน้าล็อกอิน หรือหน้าอื่นๆ
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Itim&display=swap');

* {
    font-family: 'Itim', sans-serif;
}
</style>