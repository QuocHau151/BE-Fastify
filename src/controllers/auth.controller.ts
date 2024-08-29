import envConfig from '@/config'
import { PrismaErrorCode } from '@/constants/error-reference'
import { Role } from '@/constants/type'
import prisma from '@/database'
import {
  ChangePasswordBodyType,
  CreateAccountBodyType,
  ForgotPasswordBodyType,
  LoginBodyType
} from '@/schemaValidations/auth.schema'
import { RoleType, TokenPayload } from '@/types/jwt.types'
import { comparePassword, hashPassword } from '@/utils/crypto'
import { AuthError, EntityError, isPrismaClientKnownRequestError } from '@/utils/errors'
import { getChalk } from '@/utils/helpers'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt'

export const createAccount = async (body: CreateAccountBodyType) => {
  try {
    const hashedPassword = await hashPassword(body.password)
    const account = await prisma.account.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: Role.User
      }
    })
    return account
  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new EntityError([{ field: 'email', message: 'Email đã tồn tại' }])
      }
    }
    throw error
  }
}

export const loginController = async (body: LoginBodyType) => {
  const account = await prisma.account.findUnique({
    where: {
      email: body.email
    }
  })
  if (!account) {
    throw new EntityError([{ field: 'email', message: 'Email không tồn tại' }])
  }
  const isPasswordMatch = await comparePassword(body.password, account.password)
  if (!isPasswordMatch) {
    throw new EntityError([{ field: 'password', message: 'Email hoặc mật khẩu không đúng' }])
  }
  const accessToken = signAccessToken({
    userId: account.id,
    role: account.role as RoleType
  })
  const refreshToken = signRefreshToken({
    userId: account.id,
    role: account.role as RoleType
  })
  const decodedRefreshToken = verifyRefreshToken(refreshToken)
  const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000)

  await prisma.refreshToken.create({
    data: {
      accountId: account.id,
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt
    }
  })
  return {
    account,
    accessToken,
    refreshToken
  }
}

export const changePasswordController = async (accountId: number, body: ChangePasswordBodyType) => {
  const account = await prisma.account.findUniqueOrThrow({
    where: {
      id: accountId
    }
  })
  const isSame = await comparePassword(body.oldPassword, account.password)
  if (!isSame) {
    throw new EntityError([{ field: 'oldPassword', message: 'Mật khẩu cũ không đúng' }])
  }
  const hashedPassword = await hashPassword(body.password)
  const newAccount = await prisma.account.update({
    where: {
      id: accountId
    },
    data: {
      password: hashedPassword
    }
  })
  return newAccount
}
export const forgotPasswordController = async (email: string, body: ForgotPasswordBodyType) => {
  const hashedPassword = await hashPassword(body.newPassword)
  const newPassword = await prisma.account.update({
    where: {
      email: email
    },
    data: {
      password: hashedPassword
    }
  })
  return newPassword
}
