import { createRouter, createWebHistory } from 'vue-router'
import Spaceview from '../views/Spaceview.vue' // หรือปรับให้ตรงกับไฟล์ของคุณ
import SpacePost from '@/views/SpacePost.vue'
import Register from '@/views/Register.vue'
import CommentModal from '@/components/modals/CommentModal.vue'
import Login from '@/views/Login.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Spaceview // กำหนดหน้า /home
  },
  {
    path: '/posts/area/:areaId',
    name: 'Post',
    component: SpacePost, // กำหนดหน้า /post
    // props: (route) => ({ areaId: parseInt(route.params.areaId, 10) })
  },
  {
    path: '/register',
    name: 'Register',
    component: Register // กำหนดหน้า /post
  },
  {
    path: '/login',
    name: 'Login',
    component: Login // กำหนดหน้า /post
  },
  {
    path: '/comments/:postId',
    name: 'Comment',
    components: {
      default: SpacePost, // หรือหน้าอื่น ๆ ที่คุณต้องการแสดงเป็น default
      modal: CommentModal
    },
    props: {
      modal: (route) => ({ postId: parseInt(route.params.postId, 10) })
    }
  }
  // ,{
  //   path: '/area/:areaId/posts',
  //   name: 'Post',
  //   component: Post, // กำหนดหน้า /post
  //   props: route => ({ areaId: parseInt(route.params.areaId, 10) })
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")
  const payload = localStorage.getItem("payload")

  const publicRoutes = [
    "Login",
    "Register",
  ];

  if (token) {
    try {
      // ตรวจสอบ token ที่หมดอายุ
      const parsedPayload = JSON.parse(payload);
      const now = new Date().getTime();

      // หาก token หมดอายุ ให้ลบข้อมูลและส่งกลับไปยังหน้า Login
      if (parsedPayload.exp && now > parsedPayload.exp * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("payload");
        alert("Your session has expired. Please log in again.");
        return next({ name: "Login" });
      }

      // หากเข้าสู่ระบบแล้วและพยายามเข้าถึงหน้า Login หรือ Register
      if (to.name === "Login" || to.name === "Register") {
        return next({ name: "Home" });
      }
    } catch (error) {
      console.error("Error parsing payload:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("payload");
      return next({ name: "Login" });
    }
  } else {
    if (!publicRoutes.includes(to.name)) {
      return next({ name: "Login" });
    }
  }

  // Proceed with navigation
  next()
})

export default router
