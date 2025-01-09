import router from '@adonisjs/core/services/router'
import PostsController from '#controllers/posts_controller'
// const PostsController = ()=> import('#controllers/posts_controller')

// router.get('/posts', [PostsController, 'index']).as('posts.index')
router.post('/posts', [PostsController, 'store']).as('posts.store')
// router.get('/posts/:id', [PostsController, 'show']).as('posts.show')
router.delete('/posts/:postId', [PostsController, 'destroy']).as('posts.delete')
router.put('/posts/:postId', [PostsController, 'update']).as('posts.update')

// เส้นทางสำหรับ posts ใน area
router.get('/posts/area/:areaId', [PostsController, 'getPostsByArea']).as('posts.area')

// router.on('/').render('pages/home')