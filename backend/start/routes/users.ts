import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.post('/login', [UsersController, 'login']).as('users.login')
router.post('/register', [UsersController, 'register']).as('users.register')

// router.on('/').render('pages/home')