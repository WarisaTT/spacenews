<script setup>
import { ref } from 'vue'
import Spacebg from '@/components/icons/Spacebg.png'
import SpaceImage from '@/components/icons/Spaceimage.png'
import Username from '@/components/icons/username.png'
import Password from '@/components/icons/password.png'
import auth from '@/libs/fetchUsers.js'
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const userLogin = async () => {
  try {
    const user = {
      username: username.value,
      password: password.value,
    };
    const apiRoot = import.meta.env.VITE_API_ROOT;
    const response = await auth.Login(`${apiRoot}/login`, user, showError);

    if (response.status === 201) {
      router.push({ name: "Home" });
    }
  } catch (error) {
    console.error(
        
    error);
  }
};

const showError = (message) => {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = "";
  }, 10000);
};
</script>

<template>
  <div class="bg-cover bg-center h-screen bg-opacity-50" :style="{ backgroundImage: `url(${Spacebg})` }">
    <!-- Center the content -->
    <div class="flex items-center justify-center h-full">
      <div class="bg-[#FFF] w-[500px] h-[600px] rounded-[70px] border border-[5px] border-black gap-3 flex flex-col">
        <img :src="SpaceImage" alt="" class="rounded-t-[70px]" />
        <p class="p-2 pl-8 text-black font-smath text-3xl font-bold pb-[-200px]">Login</p>
        
        <!-- Username Input -->
        <div class="bg-[#9F2B2B] mx-8 py-2 px-7 rounded-3xl flex">
          <img :src="Username" alt="Username form Icon" class="w-10" />
          <input 
            v-model="username" 
            type="text" 
            placeholder="Username" 
            class="flex-1 px-4 bg-transparent rounded-full focus:outline-none text-[#E7E1E1] placeholder:text-[#D9D4D4] placeholder:font-smath text-lg" 
          />
        </div>

        <!-- Password Input -->
        <div class="bg-[#9F2B2B] mx-8 py-2 px-7 rounded-3xl flex">
          <img :src="Password" alt="Password form Icon" class="w-10" />
          <input 
            v-model="password" 
            type="password" 
            placeholder="Password" 
            class="flex-1 px-4 bg-transparent rounded-full focus:outline-none text-[#E7E1E1] placeholder:text-[#D9D4D4] placeholder:font-smath text-lg" 
          />
        </div>
                <!-- Error and Success Messages -->
                <!-- Error Message (พื้นที่คงที่) -->
        <div class="h-4 mt-[-10px] text-red-500 text-center">
          <span v-if="errorMessage">{{ errorMessage }}</span>
        </div>

        <!-- Login Button -->
        <button 
          @click="userLogin"
          class="bg-[#13B84F] mx-8 py-2 mt-1 px-7 flex items-center justify-center border border-2 border-black font-smath text-white text-xl rounded-lg shadow-md hover:bg-[#0E9A3D] hover:shadow-lg active:scale-95 transition-all duration-300"
        >
          Login
        </button>
        


        <!-- Link to Register -->
        <div class="text-black font-smath flex items-center justify-center">
          <router-link to="/register" class="ml-2 text-black-600 underline hover:text-blue-800">
            Create account
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can add custom styling for the login component here */
</style>