import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type hasRole = (args: AccessArgs<User>, role: string) => boolean

export const hasRole: hasRole = ({ req: { user } }, role) => {
  return Boolean(user?.role === role)
}

export const isAdmin = (args: AccessArgs<User>) => hasRole(args, 'admin')
export const isEditor = (args: AccessArgs<User>) => hasRole(args, 'editor')
export const isAuthor = (args: AccessArgs<User>) => hasRole(args, 'author')

export const isAdminOrEditor = (args: AccessArgs<User>) => isAdmin(args) || isEditor(args)
