<script setup>
import { ref } from 'vue'
import { addComment } from '@/libs/fetchComments'; // นำเข้า addComment จาก fetchComment.js
import Cancle from '@/components/icons/cancle.png'
import Send from '@/components/icons/send.png'
import { useRoute } from 'vue-router'; 
const userData = JSON.parse(localStorage.getItem('payload'));
const username = userData.username;


const props = defineProps({
    isOpen: Boolean,
    comments: Array,
    postId: Number
})

const emit = defineEmits(['close', 'addComment']);

// ใช้ useRoute เพื่อเข้าถึง route params

const newComment = ref(props.comments || '');

// ฟังก์ชันสำหรับปิด Modal
const onClose = () => {
  emit('close');
};

// ฟังก์ชันสำหรับเพิ่มคอมเมนต์ใหม่
const onPost = async () => {
  try {
    await addComment(newComment);
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-black p-5 rounded-3xl w-[700px] h-[500px] flex flex-col">
            <div class="flex justify-between items-center mb-3">
                <div class="flex-1 text-center font-itim text-white text-[35px]">Comments</div>
                <button @click="onClose" class="rounded-full bg-white hover:bg-opacity-75 p-2">
                    <img :src="Cancle" alt="cancel icon" class="w-4 h-4">
                </button>
            </div>

            <div class="overflow-y-auto flex-grow max-h-[300px]">
                <div v-if="comments.length">
                    <div v-for="comment in comments" :key="comment.id" class="flex flex-col ml-5 font-itim">
                        <div class="flex gap-3">
                            <div class="font-itim text-[22px] text-white">{{ username || 'No name' }}</div>
                            <div class="font-itim text-[12px] mt-3 text-[#60706A]">{{ comment.time }}</div>
                        </div>
                        <div class="text-[#B0AEAE] text-[20px] font-light ">{{ comment.comment }}</div>
                        <hr class="mt-2 mr-5 rounded-full border-[#434343] border">
                    </div>
                </div>
            </div>

            <div class="flex flex-col flex-grow justify-end">
                <div class="flex items-center bg-[#808181] p-1 rounded-full">
                    <input v-model="newComment" type="text" :placeholder="'Comment by ' + username"
                        class="flex-1 px-6 py-2 bg-transparent rounded-full focus:outline-none text-white placeholder-[#CCCDCD] font-itim"
                        @keydown.enter="onPost" />
                    <button @click="onPost">
                        <img :src="Send" alt="Send Icon" class="w-11 h-4 px-3" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>