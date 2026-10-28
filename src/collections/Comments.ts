import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    create: () => true, // Allow anyone to create comments
    delete: () => false, // Only admins can delete (you can customize this)
    read: () => true, // Allow anyone to read comments
    update: () => false, // Only admins can update
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
      admin: {
        description: 'The comment content',
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
        description: 'The user who wrote this comment',
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
  timestamps: true,
}
