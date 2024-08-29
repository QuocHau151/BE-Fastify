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

export const AccountListRes = z.object({
  data: z.array(AccountSchema),
  message: z.string()
})

export type AccountListResType = z.TypeOf<typeof AccountListRes>

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string()
  })
  .strict()

export type AccountResType = z.TypeOf<typeof AccountRes>

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
})

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional()
  })
  .strict()

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>

export const AccountIdParam = z.object({
  id: z.coerce.number()
})

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>

export const GetListUsersRes = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date()
    })
  ),
  message: z.string()
})

export type GetListUsersResType = z.TypeOf<typeof GetListUsersRes>

export const GetUserListQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional()
})

export type GetUserListQueryParamsType = z.TypeOf<typeof GetUserListQueryParams>
