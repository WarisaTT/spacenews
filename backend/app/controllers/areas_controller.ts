import type { HttpContext } from '@adonisjs/core/http'
import Area from '../models/area.js'

export default class AreasController {
  public async index({ response }: HttpContext) {
      const areas = await Area.all()
      return response.ok(areas)
  }

  public async store({ request }: HttpContext) {
    const data = request.only(['areaName', 'description'])
    return Area.create(data)
  }
  
  // public async show({ params }: HttpContext) {
  //   return Area.findOrFail(params.id)
  // }

  // public async update({ params, request }: HttpContext) {
  //   const area = await Area.findOrFail(params.id)
  //   const data = request.only(['name', 'description'])
  //   area.merge(data)
  //   await area.save()
  //   return area
  // }

  // public async destroy({ params }: HttpContext) {
  //   const area = await Area.findOrFail(params.id)
  //   await area.delete()
  //   return { message: 'Area deleted successfully' }
  // }
}