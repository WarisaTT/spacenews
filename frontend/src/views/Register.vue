<script setup>
import Spacebg from '@/components/icons/Spacebg.png'
import SpaceImage from '@/components/icons/Spaceimage.png'
import Username from '@/components/icons/username.png'
import Password from '@/components/icons/password.png'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import auth from '@/libs/fetchUsers.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const userRegister = async () => {
    if (!username.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'All fields are required!'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match!'
        return
    }

    errorMessage.value = ''
    successMessage.value = ''
    isLoading.value = true

    const user = {
        username: username.value,
        password: password.value,
        password_confirmation: confirmPassword.value
    }

    try {
        const apiRoot = import.meta.env.VITE_API_ROOT
        const data = await auth.Register(`${apiRoot}/register`, user)

        if (data.message) {
            successMessage.value = data.message || 'Registration successful!'

            setTimeout(() => {
                router.push({ name: 'Login' })
            }, 100)
        } else {
            throw new Error('Registration failed.')
        }
    } catch (error) {
        console.error('Registration error:', error)
        errorMessage.value =
            error.message || 'Registration failed. Please try again.'
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="bg-cover bg-center h-screen bg-opacity-50" :style="{ backgroundImage: `url(${Spacebg})` }">
        <div class="flex items-center justify-center h-full">
            <div
                class="bg-[#FFF] w-[500px] h-[640px] rounded-[70px] border border-[5px] border-black gap-3 flex flex-col">
                <img :src="SpaceImage" alt="" class="rounded-t-[70px]" />
                <p class="p-2 pl-8 text-black font-smath text-3xl font-bold">
                    Register
                </p>

                <!-- Username -->
                <div class="bg-[#9F2B2B] mx-8 py-2 px-7 rounded-3xl flex">
                    <img :src="Username" alt="Username Icon" class="w-10" />
                    <input v-model="username" type="text" placeholder="Username"
                        class="flex-1 px-4 bg-transparent rounded-full focus:outline-none text-[#E7E1E1] placeholder:text-[#D9D4D4] placeholder:font-smath text-lg" />
                </div>

                <!-- Password -->
                <div class="bg-[#9F2B2B] mx-8 py-2 px-7 rounded-3xl flex">
                    <img :src="Password" alt="Password Icon" class="w-10" />
                    <input v-model="password" type="password" placeholder="Password"
                        class="flex-1 px-4 bg-transparent rounded-full focus:outline-none text-[#E7E1E1] placeholder:text-[#D9D4D4] placeholder:font-smath text-lg" />
                </div>

                <!-- Confirm Password -->
                <div class="bg-[#9F2B2B] mx-8 py-2 px-7 rounded-3xl flex">
                    <img :src="Password" alt="Confirm Password Icon" class="w-10" />
                    <input v-model="confirmPassword" type="password" placeholder="Confirm Password"
                        class="flex-1 px-4 bg-transparent rounded-full focus:outline-none text-[#E7E1E1] placeholder:text-[#D9D4D4] placeholder:font-smath text-lg" />
                </div>

                <!-- Error Message -->
                <div class="h-4 mt-[-10px] text-red-500 text-center">
                    <span v-if="errorMessage">{{ errorMessage }}</span>
                </div>

                <!-- Register Button -->
                <button @click="userRegister" :disabled="isLoading"
                    class="bg-[#13B84F] mx-8 py-2 px-7 flex items-center justify-center border border-2 border-black font-smath text-white text-xl rounded-lg shadow-md hover:bg-[#0E9A3D] hover:shadow-lg active:scale-95 transition-all duration-300">
                    {{ isLoading ? 'Registering...' : 'Register' }}
                </button>

                <!-- Already Have Account -->
                <div class="text-black font-smath flex items-center justify-center">
                    Already have an account?
                    <router-link to="/login" class="ml-2 text-black-600 underline hover:text-blue-800">Login
                        here</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
