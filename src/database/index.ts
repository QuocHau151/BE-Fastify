import { PrismaClient } from '@prisma/client'
import envConfig from '@/config'

const prisma = new PrismaClient({
  datasourceUrl: envConfig.DATABASE_URL,
  log: ['info']
})

export default prisma
