import { CorsConfig } from '@ioc:Adonis/Core/Cors'

const corsConfig: CorsConfig = {
  // เปิดหรือปิดการใช้งาน CORS
  enabled: true,

  // ระบุว่า Origin ใดที่อนุญาต:
  // - true: อนุญาตทุก Origin
  // - 'http://localhost:8080': ระบุเฉพาะ Origin
  origin: true,

  // Methods ที่อนุญาต
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  // Headers ที่อนุญาต
  headers: true,

  // Cookies
  exposeHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,

  // กำหนดอายุ (วินาที) สำหรับการ Cache preflight requests
  maxAge: 90,
}

export default corsConfig