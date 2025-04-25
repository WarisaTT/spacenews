import router from '@adonisjs/core/services/router'
import PostsController from '#controllers/posts_controller'

router.post('/posts', [PostsController, 'store']).as('posts.store')
router.delete('/posts/:postId', [PostsController, 'destroy']).as('posts.delete')
router.put('/posts/:postId', [PostsController, 'update']).as('posts.update')
router.get('/posts/area/:areaId', [PostsController, 'getPostsByArea']).as('posts.area')

// router.get('/posts', [PostsController, 'index']).as('posts.index')
// router.on('/').render('pages/home')
// router.get('/posts/:id', [PostsController, 'show']).as('posts.show')
