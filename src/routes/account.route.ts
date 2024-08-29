import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify'
import {
  getMeController,
  logoutController,
  refreshTokenController,
  updateMeController
} from '@/controllers/account.controller'
import { changePasswordController } from '@/controllers/auth.controller'
import { requireAdminHook, requireLoginedHook } from '@/hooks/auth.hooks'
import {
  AccountRes,
  AccountResType,
  LogoutBody,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenRes,
  RefreshTokenResType,
  UpdateMeBody,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
import {
  AccountIdParam,
  AccountIdParamType,
  ChangePasswordBody,
  ChangePasswordBodyType,
  RefreshTokenBody
} from '@/schemaValidations/auth.schema'
import { MessageRes, MessageResType } from '@/schemaValidations/common.schema'

export default async function accountRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.addHook('preValidation', fastify.auth([requireLoginedHook]))
  fastify.post<{ Reply: MessageResType; Body: LogoutBodyType }>(
    '/logout',
    {
      schema: {
        response: {
          200: MessageRes
        },
        body: LogoutBody
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const message = await logoutController(request.body.refreshToken)
      reply.send({
        message
      })
    }
  )

  fastify.post<{
    Reply: RefreshTokenResType
    Body: RefreshTokenBodyType
  }>(
    '/refresh-token',
    {
      schema: {
        response: {
          200: RefreshTokenRes
        },
        body: RefreshTokenBody
      }
    },
    async (request, reply) => {
      const result = await refreshTokenController(request.body.refreshToken)
      reply.send({
        message: 'Lấy token mới thành công',
        data: result
      })
    }
  )
  fastify.get<{ Reply: AccountResType }>(
    '/me',
    {
      schema: {
        response: {
          200: AccountRes
        }
      }
    },
    async (request, reply) => {
      const account = await getMeController(request.decodedAccessToken?.userId as number)
      reply.send({
        data: account,
        message: 'Lấy thông tin thành công'
      })
    }
  )

  fastify.put<{
    Reply: AccountResType
    Body: UpdateMeBodyType
  }>(
    '/me',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: UpdateMeBody
      }
    },
    async (request, reply) => {
      const result = await updateMeController(request.decodedAccessToken?.userId as number, request.body)
      reply.send({
        data: result,
        message: 'Cập nhật thông tin thành công'
      })
    }
  )
  fastify.put<{
    Reply: AccountResType
    Body: ChangePasswordBodyType
  }>(
    '/change-password',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: ChangePasswordBody
      }
    },
    async (request, reply) => {
      const result = await changePasswordController(request.decodedAccessToken?.userId as number, request.body)
      reply.send({
        data: result,
        message: 'Đổi mật khẩu thành công'
      })
    }
  )
}
