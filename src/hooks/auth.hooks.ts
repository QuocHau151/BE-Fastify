import { Role } from '@/constants/type'
import { AuthError } from '@/utils/errors'
import { verifyAccessToken } from '@/utils/jwt'
import { FastifyRequest } from 'fastify'

export const requireLoginedHook = async (request: FastifyRequest) => {
  const accessToken = request.headers.authorization?.split(' ')[1]
  if (!accessToken) throw new AuthError('Không nhận được access token')
  try {
    const decodedAccessToken = verifyAccessToken(accessToken as string)
    request.decodedAccessToken = decodedAccessToken
  } catch (error) {
    throw new AuthError('Access token không hợp lệ')
  }
}
export const requireAdminHook = async (request: FastifyRequest) => {
  if (request.decodedAccessToken?.role !== Role.Admin) {
    throw new AuthError('Bạn không có quyền truy cập')
  }
}
