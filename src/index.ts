import fastifyAuth from '@fastify/auth'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import envConfig, { API_URL } from './config'
import authRoutes from './routes/auth.route'
import validatorCompilerPlugin from './plugins/validatorCompiler.plugins'
import { errorHandlerPlugin } from './plugins/errorHandler.plugins'
import accountRoutes from './routes/account.route'
const fastify = Fastify({
  logger: false
})
//  Run the server!

const start = async () => {
  try {
    const whitelist = ['*']
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true // Cho phép trình duyệt gửi cookie đến server
    })
    fastify.register(fastifyAuth, {
      defaultRelation: 'and'
    })
    fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
    fastify.register(fastifyCookie)
    fastify.register(errorHandlerPlugin)
    fastify.register(validatorCompilerPlugin)
    fastify.register(authRoutes, {
      prefix: '/auth'
    })
    fastify.register(accountRoutes, {
      prefix: '/accounts'
    })
    await fastify.listen({
      port: envConfig.PORT
    })
    console.log(`Server đang chạy: ${API_URL}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
