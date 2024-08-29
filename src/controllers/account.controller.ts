import envConfig from '@/config'
import { PrismaErrorCode } from '@/constants/error-reference'
import { Role } from '@/constants/type'
import prisma from '@/database'
import { UpdateMeBodyType } from '@/schemaValidations/account.schema'
import {} from '@/schemaValidations/auth.schema'
import { RoleType, TokenPayload } from '@/types/jwt.types'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { AuthError, EntityError, isPrismaClientKnownRequestError } from '@/utils/errors'
import { getChalk } from '@/utils/helpers'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt'

export const logoutController = async (refreshToken: string) => {
  await prisma.refreshToken.delete({
    where: {
      token: refreshToken
    }
  })
  return 'Đăng xuất thành công'
}

export const refreshTokenController = async (refreshToken: string) => {
  let decodedRefreshToken: TokenPayload
  try {
    decodedRefreshToken = verifyRefreshToken(refreshToken)
  } catch (error) {
    throw new AuthError('Refresh token không hợp lệ')
  }
  const refreshTokenDoc = await prisma.refreshToken.findUniqueOrThrow({
    where: {
      token: refreshToken
    },
    include: {
      account: true
    }
  })
  const account = refreshTokenDoc.account
  const newAccessToken = signAccessToken({
    userId: account.id,
    role: account.role as RoleType
  })
  const newRefreshToken = signRefreshToken({
    userId: account.id,
    role: account.role as RoleType,
    exp: decodedRefreshToken.exp
  })
  await prisma.refreshToken.delete({
    where: {
      token: refreshToken
    }
  })
  await prisma.refreshToken.create({
    data: {
      accountId: account.id,
      token: newRefreshToken,
      expiresAt: refreshTokenDoc.expiresAt
    }
  })
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
}
export const getAccounts = async () => {
  const accounts = await prisma.account.findMany({
    where: {
      role: Role.User
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return accounts
}

export const getAccount = async (accountId: number) => {
  const account = await prisma.account.findUniqueOrThrow({
    where: {
      id: accountId
    }
  })
  return account
}

export const getAccountList = async (accountId: number) => {
  const account = await prisma.account.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      id: {
        not: accountId
      }
    }
  })
  return account
}

export const getMeController = async (accountId: number) => {
  const account = prisma.account.findUniqueOrThrow({
    where: {
      id: accountId
    }
  })
  return account
}
export const updateMeController = async (accountId: number, body: UpdateMeBodyType) => {
  const account = prisma.account.update({
    where: {
      id: accountId
    },
    data: body
  })
  return account
}
