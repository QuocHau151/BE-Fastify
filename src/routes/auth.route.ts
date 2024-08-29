import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify'
import { createAccount, forgotPasswordController, loginController } from '@/controllers/auth.controller'
import { AccountRes, AccountResType } from '@/schemaValidations/account.schema'
import {
  CreateAccountBody,
  CreateAccountBodyType,
  ForgotPasswordBody,
  ForgotPasswordBodyType,
  LoginBody,
  LoginBodyType,
  LoginRes,
  LoginResType
} from '@/schemaValidations/auth.schema'

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{ Reply: LoginResType; Body: LoginBodyType }>(
    '/login',
    {
      schema: {
        response: {
          200: LoginRes
        },
        body: LoginBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const { accessToken, refreshToken, account } = await loginController(body)
      reply.send({
        message: 'Đăng nhập thành công',
        data: {
          account: account as LoginResType['data']['account'],
          accessToken,
          refreshToken
        }
      })
    }
  )

  fastify.post<{
    Body: CreateAccountBodyType
    Reply: AccountResType
  }>(
    '/register',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: CreateAccountBody
      }
      // preValidation: fastify.auth([requireAdminHook])
    },
    async (request, reply) => {
      const account = await createAccount(request.body)
      reply.send({
        data: account,
        message: 'Tạo tài khoản thành công'
      })
    }
  )
  fastify.put<{
    Body: ForgotPasswordBodyType
    Reply: AccountResType
  }>(
    '/forgot-password',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: ForgotPasswordBody
      }
    },
    async (request, reply) => {
      const result = await forgotPasswordController(request.body.email, request.body)
      reply.send({
        data: result,
        message: 'Đổi mật khẩu thành công'
      })
    }
  )
}
