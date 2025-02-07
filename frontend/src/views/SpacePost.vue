<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Header from '@/components/Header.vue'
import Profile from '@/components/icons/profile-user.png'
import Clear from '@/components/icons/clear2.png'
import EditPost from '@/components/icons/edit-post.png'
import DeletePost from '@/components/icons/delete-post.png'
import Post from '@/components/modals/PostModal.vue'
import Search from '@/components/icons/searchIcon2.png'
import Sort from '@/components/icons/sort1.png'
import Edit from '@/components/icons/etc.png'
import Like from '@/components/icons/like1.png'
import Like2 from '@/components/icons/like2.png'
import Like3 from '@/components/icons/like3.png'
import Comment from '@/components/icons/comment.png'
import Sidebar from '@/components/Sidebar.vue'
import Cancle from '@/components/icons/cancle.png'
import Send from '@/components/icons/send.png'
// import CommentModal from '@/components/modals/CommentModal.vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { deletePost as deletePostFromAPI } from '@/libs/fetchPost'
import { addComment } from '@/libs/fetchComments'
import { fetchPostsByArea } from '@/libs/fetchPost' // นำเข้าฟังก์ชัน fetchPost
import { fetchCommentsByPost } from '@/libs/fetchComments'
import { addLike, deleteLike } from '@/libs/fetchLikes'

// Reactive state
const posts = ref([])
const comments = ref([])
const error = ref('')
const route = useRoute()
const router = useRouter()
const content = ref('')
let areaId = parseInt(route.params.areaId) // ใช้ defaultAreaId แทนค่าconsole.log(areaId)
const areaName = route.query.areaName;  // อ่าน areaName จาก query
const isModalOpen = ref(false) // สถานะสำหรับเปิด/ปิด Modal
const isCommentModalOpen = ref(false) // สถานะสำหรับเปิด/ปิด Comment Modal
const newComment = ref('')
const postIdForComment = ref(null)
const currentPostId = ref(null)
const currentPostContent = ref('')
const optionsVisibleId = ref(null);

const getCommentsByPost = async (postId) => {
    try {
        const fetchedComments = await fetchCommentsByPost(postId)
        comments.value = fetchedComments.map((comment) => ({
            id: comment.id,
            comment: comment.comment,
            username: comment.user.username,
            time: formatTime(comment.createdAt)
        }))
    } catch (error) {
        console.error('Error fetching comments:', error)
    }
}

const formatTime = (dateString) => {
    const now = new Date()
    const commentTime = new Date(dateString)
    const diffInSeconds = Math.floor((now - commentTime) / 1000) // แปลงเป็นวินาที

    if (diffInSeconds < 60) {
        return `${diffInSeconds} s.` // แสดงวินาที
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        return `${diffInMinutes} m.` // แสดงนาที
    } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600)
        return `${diffInHours} hr.` // แสดงชั่วโมง
    } else {
        const diffInDays = Math.floor(diffInSeconds / 86400)
        return `${diffInDays} day` // แสดงวัน
    }
}

const getPostsByArea = async () => {
    try {
        const payloadString = localStorage.getItem('payload'); 
        const payload = JSON.parse(payloadString); 
        const userId = payload.userId; 
        if (isNaN(areaId)) {
            throw new Error('Invalid areaId: Area ID must be a valid number');
        }
        const fetchedPosts = await fetchPostsByArea(areaId);
        console.log('Fetched Posts:', fetchedPosts); // ตรวจสอบโครงสร้างข้อมูล

        posts.value = fetchedPosts.map((post) => {
            // แปลงวันที่ให้เป็นรูปแบบที่ต้องการ
            const formattedDate = new Date(post.updatedAt);
            const day = formattedDate.getDate().toString().padStart(2, '0');
            const month = formattedDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const year = formattedDate.getFullYear();
            const hours = formattedDate.getHours().toString().padStart(2, '0');
            const minutes = formattedDate.getMinutes().toString().padStart(2, '0');

            const formattedDateString = `${day} ${month} ${year}   ${hours}:${minutes}`;

            return {
                id: post.postId || 0,
                username: post.user.username || 'Unknown',
                fullname: post.user.fullName || 'Unknown',
                date: formattedDateString || 'No date',
                content: post.content || 'No content',
                likes: post.likes || [], // ให้แน่ใจว่า likes เป็น array
                likes_count: post.likes ? post.likes.length : 0,
                comments: post.comments || [],
                comments_count: post.comments ? post.comments.length : 0,
                areaName: post.area.areaName || 'No area name',
                isLiked: post.likes.some(like => like.userId == userId)
            };
        });

        if (fetchedPosts.length > 0) {
            areaName.value = fetchedPosts[0].area.areaName || 'Default Area Name';
        } else {
            areaName.value = 'No posts available';
        }
    } catch (err) {
        error.value = err.message || 'Error fetching posts';
        console.error('Error fetching posts:', err);
    }
};

// เมื่อค่า areaId เปลี่ยน ให้โหลดโพสต์ใหม่
watch(() => route.params.areaId, (newAreaId) => {
    areaId = parseInt(newAreaId);
    getPostsByArea();
});

const openModal = () => {
    currentPostId.value = null
    currentPostContent.value = ''
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false;
    currentPostId.value = null;
    getPostsByArea();
};

onMounted(async () => {
    await getPostsByArea()
    isModalOpen.value = false
    isCommentModalOpen.value = false
})

const toggleOptions = (postId) => {
    optionsVisibleId.value = optionsVisibleId.value === postId ? null : postId;
};

const isOptionsVisible = (postId) => {
    return optionsVisibleId.value === postId;
};

const deletePost = async (postId) => {
    try {
        await deletePostFromAPI(postId);
        alert('Post deleted successfully');
        getPostsByArea()
    } catch (error) {
        alert('Error deleting post: ' + error.message);
    }
};

const openEditModal = (post) => {
    currentPostId.value = post.id
    currentPostContent.value = post.content
    isModalOpen.value = true  // เปิด Modal
}

const searchQuery = ref('')
const filteredPosts = computed(() => {
    return posts.value.filter((post) => {
        return post.content.toLowerCase().includes(searchQuery.value.toLowerCase()) // กรองโพสต์ตามคำค้นหา
    })
})

const toggleLike = async (postId) => {
    const post = posts.value.find(p => p.id === postId);
    if (!post) return;

    try {
        if (post.isLiked) {
            await deleteLike(postId);
            post.likes_count -= 1;
            post.isLiked = false;
        } else {
            await addLike(postId);
            post.likes_count += 1;
            post.isLiked = true;
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
};

const openCommentModal = (postId) => {
    postIdForComment.value = postId
    getCommentsByPost(postId)
    isCommentModalOpen.value = true
}

const closeCommentModal = () => {
    isCommentModalOpen.value = false
    newComment.value = ''
    router.back()
}

const handleAddComment = async () => {
    if (newComment.value.trim()) {
        try {
            await addComment(newComment.value, postIdForComment.value)
            newComment.value = ''
            getCommentsByPost(postIdForComment.value)
            getPostsByArea() // อัพเดตจำนวนคอมเมนต์ในโพสต์
        } catch (error) {
            console.error('Failed to add comment:', error)
        }
    } else {
        alert('Please enter a comment')
    }
}

</script>

<template>
    <div class="bg-[#FFF7CB] min-h-screen h-full flex flex-col">
        <div class="fixed left-0 top-0 w-full h-[50px] z-50">
            <Header :title="areaName" />
        </div>
        <div class="flex flex-1 h-screen pt-[50px]">
            <Sidebar />

            <!-- Main Content Section -->
            <div class="main-content bg-[#FFF7CB] w-3/4 flex flex-col p-4 items-center gap-5 pt-7 mb-6">
                <div
                    class="text-white text-xl bg-[#E09F3E] w-5/6 rounded-lg h-[70px] flex items-center justify-center gap-3">
                    <img :src="Profile" alt="Profile Icon" class="w-17 h-10 px-3" />
                    <div class="bg-[#E7B66B] w-5/6 h-[35px] flex items-center justify-center rounded-full">
                        <button @click="openModal"
                            class="text-left flex-1 px-10 py-1 bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#BD7509] focus:ring-offset-2 text-[#BD7509] placeholder-[#BD7509] font-itim hover:bg-[#F9E1A3] active:bg-[#D89B48] transition-all duration-200">
                            Say something...
                        </button>
                    </div>
                </div>
                <Post :isModalOpen="isModalOpen" :initialContent="content" :areaName="areaName" @close="closeModal"
                    @post="getPostsByArea" />
                <div class="w-5/6 flex items-center gap-2 mb-5">
                    <!-- Search Box -->
                    <div
                        class="w-full md:w-4/6 rounded-full border border-[#335C67] border-2 p-1 flex items-center bg-[#FFF7CB]">
                        <img :src="Search" alt="Search Icon" class="w-13 h-6 mx-2" />
                        <input type="text" v-model="searchQuery"
                            class="flex-1 px-4 bg-transparent font-itim rounded-full focus:outline-none text-[#335C67] text-lg placeholder:text-[#335c677d]"
                            placeholder="Search posts..." />
                        <button class="hover:scale-90 transition duration-300 ease-in-out" @click="searchQuery = ''">
                            <img :src="Clear" alt="Clear Icon" class="w-4 h-4 mx-2" />
                        </button>
                    </div>
                    <div class="md:w-2/6 rounded-full border border-[#335C67] border-2 flex items-center">
                        <img :src="Sort" alt="Sort Icon" class="w-13 h-6 mx-2" />
                        <p class="font-itim text-[#335C67] text-lg p-1 px-16">DATED ADD</p>
                    </div>
                </div>
                <div v-for="post in filteredPosts" :key="post.postId" class="w-5/6 flex items-center">
                    <div class="bg-[#60706A] w-full rounded-lg flex flex-col h-[205px]">
                        <div class="m-5 flex gap-4 items-center">
                            <img :src="Profile" alt="Profile Icon" class="w-17 h-10" />
                            <div class="flex flex-col mt-[-4px]">
                                <div class="font-itim text-[#FFF3B0] text-2xl">
                                    {{ post.username }}
                                </div>
                                <div class="font-itim text-[#FFF3B0] text-sm mt-[-6px] font-light">
                                    {{ post.date }}
                                </div>
                            </div>
                            <button @click="toggleOptions(post.id)"
                                class="flex justify-end ml-auto p-3 rounded-full hover:scale-110">
                                <img :src="Edit" alt="Edit Icon" class="w-8 h-2" />
                            </button>

                            <div v-if="isOptionsVisible(post.id)"
                                class="absolute bg-white shadow-lg rounded-lg mt-24 right-5 w-28">
                                <button @click="openEditModal(post)"
                                    class="flex gap-5 w-full text-left p-2 pl-3 rounded-t-lg hover:bg-gray-900 font-itim text-white bg-black">
                                    <img :src="EditPost" alt="edit icon" class="w-5 mt-[-0.2px]">
                                    Edit
                                </button>

                                <Post v-if="isModalOpen" :isModalOpen="isModalOpen" :initialContent="currentPostContent"
                                    :postId="currentPostId" @close="closeModal" @post="getPostsByArea"
                                    :areaName="areaName" />

                                <button @click="deletePost(post.id)"
                                    class="flex gap-5 w-full text-left p-2 pl-3 rounded-b-lg hover:bg-gray-900 font-itim text-white bg-black">
                                    <img :src="DeletePost" alt="delete icon" class="w-5 mt-[-0.2px]">
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div class="ml-5 text-white font-itim text-3xl">
                            {{ post.content }}
                        </div>
                        <div class="flex ml-5 mt-3 gap-2 mr-5">
                            <img :src="Like" alt="Like Icon" class="w-6 h-6" />
                            <p class="font-itim text-white">{{ post.likes_count }}</p>
                            <p class="font-itim ml-auto text-white">
                                {{ post.comments_count }} comments
                            </p>
                        </div>
                        <hr class="w-[780px] rounded-full flex items-center mt-2 mx-auto" />
                        <div class="flex ml-5 mr-5 mt-1">
                            <!-- Like Button -->
                            <button
                                class="w-1/2 flex gap-4 justify-center items-center hover:bg-[#4D5A55] h-8 rounded-lg"
                                @click="toggleLike(post.id)">
                                <img :src="post.isLiked ? Like3 : Like2" alt="Like Icon" class="w-6 h-6" />
                                <p class="text-white font-itim text-lg">{{ post.isLiked ? 'Like' : 'Like' }}</p>
                            </button>

                            <!-- Comment Button -->
                            <router-link :to="{ path: `/comments/${post.id}` }"
                                @click.native.prevent="openCommentModal(post.id)"
                                class="w-1/2 flex gap-4 justify-center items-center hover:bg-[#4D5A55] h-8 rounded-lg">
                                <img :src="Comment" alt="Comment Icon Click" class="w-6 h-6" />
                                <p class="text-white font-itim text-lg">Comment</p>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Comments section with scroll -->
        <div v-if="isCommentModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-black p-5 rounded-3xl w-[700px] h-[500px] flex flex-col">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex-1 text-center font-itim text-white text-[35px]">Comments</div>
                    <button @click="closeCommentModal" class="rounded-full bg-white hover:bg-opacity-75 p-2">
                        <img :src="Cancle" alt="cancel icon" class="w-4 h-4">
                    </button>
                </div>

                <div class="overflow-y-auto flex-grow max-h-[300px]">
                    <div v-if="comments.length">
                        <div v-for="comment in comments" :key="comment.id" class="flex flex-col ml-5 font-itim">
                            <div class="flex gap-3">
                                <div class="font-itim text-[22px] text-white">{{ comment.username || 'No name' }}</div>
                                <div class="font-itim text-[12px] mt-3 text-[#60706A]">{{ comment.time }}</div>
                            </div>
                            <div class="text-[#B0AEAE] text-[20px] font-light ">{{ comment.comment }}</div>
                            <hr class="mt-2 mr-5 rounded-full border-[#434343] border">
                        </div>
                    </div>
                </div>

                <div class="flex flex-col flex-grow justify-end">
                    <div class="flex items-center bg-[#808181] p-1 rounded-full">
                        <input v-model="newComment" type="text" placeholder="Add a comment..."
                            class="flex-1 px-6 py-2 bg-transparent rounded-full focus:outline-none text-white placeholder-[#CCCDCD] font-itim"
                            @keydown.enter="handleAddComment" />
                        <button @click="handleAddComment">
                            <img :src="Send" alt="Send Icon" class="w-11 h-4 px-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main-content {
    width: calc(100% - 25vw);
    /* ให้ความกว้างของ main-content ลดลงจาก 100% โดยมีขนาดของ Sidebar */
    margin-left: 25vw;
    /* กำหนดระยะห่างด้านซ้ายเพื่อให้ main-content อยู่ข้างๆ Sidebar */
    top: 0;
    right: 0;
    position: relative;
}
</style>
