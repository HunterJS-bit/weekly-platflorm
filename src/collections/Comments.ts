import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    // Allow anyone to create comments (with anti-spam protection)
    create: () => true,
    delete: ({ req: { user } }) => Boolean(user),
    // Reading comments is public.
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    defaultColumns: ['content', 'post', 'author', 'authorName', 'createdAt'],
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
      required: false,
      admin: {
        readOnly: true,
        description: 'Set automatically from the signed-in user',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: false,
      admin: {
        description: 'Name for guest commenters (optional for authenticated users)',
      },
    },
    {
      name: 'authorEmail',
      type: 'text',
      required: false,
      // Contact details are collected for the editor, never published with comments.
      access: {
        // Only editors need the submitter's contact details or the spam trap.
        read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
      },
      admin: {
        description: 'Email for guest commenters (optional for authenticated users)',
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
    {
      name: 'honeypot',
      type: 'text',
      required: false,
      access: {
        // The spam trap is only useful to editors reviewing submissions.
        read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
      },
      admin: {
        description: 'Anti-spam honeypot field - should be empty for legitimate submissions',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Check honeypot field for spam detection
        if (operation === 'create' && data.honeypot) {
          throw new Error('Spam detected')
        }

        // For authenticated users, set author automatically
        if (operation === 'create' && req.user) {
          data.author = req.user.id
        }

        // For guest commenters, require name and validate/sanitize inputs
        if (operation === 'create' && !req.user) {
          if (!data.authorName) {
            throw new Error('Name is required for guest comments')
          }

          // Trim and validate name
          if (typeof data.authorName === 'string') {
            data.authorName = data.authorName.trim()
            if (data.authorName.length === 0) {
              throw new Error('Name cannot be empty')
            }
            if (data.authorName.length > 100) {
              throw new Error('Name is too long (maximum 100 characters)')
            }
          }

          // Trim and validate email if provided
          if (typeof data.authorEmail === 'string' && data.authorEmail.trim()) {
            data.authorEmail = data.authorEmail.trim()
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(data.authorEmail)) {
              throw new Error('Invalid email address')
            }
          } else {
            data.authorEmail = ''
          }
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
