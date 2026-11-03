import type { Access } from 'payload'

import { isAdminOrEditor } from './roles'

export const authenticatedOrPublished: Access = (args) => {
  const { req: { user } } = args

  // Admins and editors can see all content
  if (isAdminOrEditor(args)) {
    return true
  }

  // Public can only see published content
  return {
    _status: {
      equals: 'published',
    },
  }
}
