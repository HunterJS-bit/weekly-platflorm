import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    // Only signed-in users may write or moderate comments.
    create: () => true, // Allow anyone to create comments
    delete: ({ req: { user } }) => Boolean(user),
    // Reading comments is public.
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    defaultColumns: ['content', 'post', 'author', 'createdAt'],
    useAsTitle: 'content',
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      minLength: 1,
      maxLength: 2000,
      admin: {
        description: 'The comment content (maximum 2000 characters)',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: {
        description: 'The post this comment belongs to',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        description: 'Set automatically from the signed-in user and cannot be spoofed',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments' as const,
      admin: {
        description: 'Parent comment for nested replies',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Never trust a client-supplied author. On create it is always the
        // authenticated user making the request.
        if (operation === 'create') {
          if (!req.user) {
            throw new Error('You must be signed in to comment.')
          }

          data.author = req.user.id
        }

        if (typeof data.content === 'string') {
          data.content = data.content.trim()
        }

        return data
      },
    ],
  },
  timestamps: true,
}
