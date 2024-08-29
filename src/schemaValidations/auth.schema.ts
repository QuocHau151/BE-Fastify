import z from 'zod'
import { RoleValues } from '@/constants/type'

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  avatar: z.string().nullable()
})

export type AccountType = z.TypeOf<typeof AccountSchema>

export const CreateAccountBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type CreateAccountBodyType = z.TypeOf<typeof CreateAccountBody>
export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum(RoleValues)
    })
  }),
  message: z.string()
})

export type LoginResType = z.TypeOf<typeof LoginRes>

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>

export const ForgotPasswordBody = z
  .object({
    email: z.string().email(),
    newPassword: z.string().min(6).max(100),
    confirmNewPassword: z.string().min(6).max(100)
  })
  .strict()
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Mật khẩu mới không khớp',
        path: ['confirmPassword']
      })
    }
  })

export type ForgotPasswordBodyType = z.TypeOf<typeof ForgotPasswordBody>

export const AccountIdParam = z.object({
  id: z.coerce.number()
})

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>
