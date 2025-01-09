<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'; 
import Profile from '@/components/icons/profile-user.png';
import Group from '@/components/icons/groupSpace.png';
import Cancle from '@/components/icons/clear3.png';
import { addPost, updatePost } from '@/libs/fetchPost'; // เพิ่มการนำเข้า updatePost

// รับ props
const props = defineProps({
  isModalOpen: Boolean,
  initialContent: {
    type: String,
    default: '',
  },
  areaName: {
    type: String,
    default:'',
  }, // รับค่า areaName จาก parent component
  postId: {
    type: Number,
    default: null, // เพิ่มการรับค่า postId สำหรับการแก้ไขโพสต์
  },
});

console.log('props: ' + props.postId );


// กำหนด emits
const emit = defineEmits(['close', 'post']);

// ใช้ useRoute เพื่อดึง areaId จาก URL
const route = useRoute();
const areaId = ref(route.params.areaId); // ดึง areaId จาก path และเก็บไว้ใน ref

// สถานะภายใน
const content = ref(props.initialContent || '');
const areaName = ref(props.areaName);  // ค่าจาก props

// ติดตามการเปลี่ยนแปลงของ areaName
watch(() => props.areaName, (newValue) => {
  areaName.value = newValue; // อัพเดตค่า areaName
});

// ฟังก์ชันสำหรับปิด Modal
const onClose = () => {
  emit('close');
  content.value="";
};

// ฟังก์ชันสำหรับโพสต์ข้อความใหม่หรือการแก้ไขโพสต์
const onPost = async () => {
  try {
    if (props.postId) {
      // ถ้ามี postId แสดงว่าเป็นการแก้ไขโพสต์
      await updatePost(props.postId, content.value); // ใช้ฟังก์ชัน updatePost
    } else {
      // ถ้าไม่มี postId แสดงว่าเป็นการสร้างโพสต์ใหม่
      await addPost(content, areaId, emit);
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }
  emit('close');
  content.value="";
  props.postId = null;
  console.log(post)
};

// สร้างตัวแปรเก็บชื่อ username
const username = ref('');

// ดึงข้อมูลจาก localStorage เมื่อ component ถูก mount
onMounted(() => {
  const payload = localStorage.getItem('payload');
  if (payload) {
    try {
      const parsedPayload = JSON.parse(payload); 
      username.value = parsedPayload.username; 
    } catch (error) {
      console.error('Error parsing payload:', error);
    }
  }
});

watch(() => props.areaName, (newValue) => {
  console.log('New areaName:', newValue); // เพิ่มการตรวจสอบค่าของ areaName
  areaName.value = newValue;
});

onMounted(() => {
  console.log('areaName:', areaName.value); // ตรวจสอบค่าของ areaName
});

</script>

<template>
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div class="bg-[#E09F3E] w-5/12 px-10 py-7 rounded-3xl">
      <div class="flex items-center">
        <div class="flex-1 text-center font-itim text-white text-3xl font-thin">
          <!-- ถ้ามี postId จะแสดงข้อความ "Edit Post" ถ้าไม่มีจะแสดงข้อความ "Create Post" -->
          {{ props.postId ? 'Edit Post' : 'Create Post' }}
        </div>
        <button @click="onClose" class="rounded-full bg-[#F7DFA5] hover:bg-opacity-75 p-2">
          <img :src="Cancle" alt="cancel icon" class="w-4 h-4">
        </button>
      </div>
      <hr class="m-2 border border-[1px] rounded-xl">
      <div class="my-5 flex gap-4 items-center">
        <img :src="Profile" alt="Profile Icon" class="w-17 h-10" />
        <div class="flex-col mt-[-10px]">
          <div class="font-itim text-[#FFF3B0] text-2xl">{{ username }}</div>
          <div class="font-itim text-[#FFF3B0] text-sm font-light text-center bg-[#F2C788] rounded-md flex px-2 gap-2">
            <img :src="Group" alt="group space icon" class="w-6">
            <div class="text-[#BD7509] font-itim pt-[1.5px]">{{ areaName }}</div>
          </div>
        </div>
      </div>
      <textarea v-model="content" placeholder="Say something..."
        class="w-full h-48 p-3 mb-4 bg-[#E09F3E] placeholder:text-[#BD7509] font-itim text-[#FFF3B0] text-lg"></textarea>
      <div class="flex justify-center">
        <button @click="onPost"
          class="w-full border border-[#335C67] border-[2px] text-[#335C67] font-itim text-xl px-4 py-1 rounded-lg justify-center items-center hover:bg-[#335C67] hover:text-white">
          <!-- ถ้ามี postId จะแสดงข้อความ "Edit Post" ถ้าไม่มีจะแสดงข้อความ "Post" -->
          {{ props.postId ? 'Edit' : 'Post' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>