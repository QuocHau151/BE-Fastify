export const TokenType = {
  ForgotPasswordToken: 'ForgotPasswordToken',
  AccessToken: 'AccessToken',
  RefreshToken: 'RefreshToken',
  TableToken: 'TableToken'
} as const

export const Role = {
  Admin: 'Admin',
  User: 'User'
} as const

export const RoleValues = [Role.Admin, Role.User] as const
