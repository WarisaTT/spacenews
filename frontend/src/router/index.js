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
    name: 'register',
    component: Register // กำหนดหน้า /post
  },
  {
    path: '/login',
    name: 'login',
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

export default router
