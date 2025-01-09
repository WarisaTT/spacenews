import router from '@adonisjs/core/services/router'
import LikesController from '#controllers/likes_controller'

router.post('/likes', [LikesController, 'store']).as('likes.getComments')
router.delete('/likes', [LikesController, 'destroy']).as('likes.store')