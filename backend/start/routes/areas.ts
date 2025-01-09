import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import AreasController from '#controllers/areas_controller'
// const PostsController = ()=> import('#controllers/posts_controller')

router.get('/',({ response }:HttpContext) => {
    response.redirect().toRoute('areas.home')
})
router.get('/areas',[AreasController,'index']).as('areas.home')
router.post('/areas',[AreasController,'store']).as('areas.store')
router.get('/areas/:id',[AreasController,'show']).as('areas.show')
router.get('/areas/:id/area-name',[AreasController,'fetchAreaNameById']).as('areas.name')
router.get('/areas/:id/delete',[AreasController,'destroy']).as('areas.delete')
router.post('/areas/:id/update',[AreasController,'update']).as('areas.update')


// router.on('/').render('pages/home')