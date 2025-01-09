import router from '@adonisjs/core/services/router'
import CommentsController from '#controllers/comments_controller'

router.get('/comments/:postId', [CommentsController, 'getComments']).as('comments.getComments')
router.post('/comments/:postId', [CommentsController, 'store']).as('comments.store')
