import { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt', 'isSpam'],
  },
  access: {
    read: ({ req: { user } }: { req: { user?: unknown } }) => {
      if (user) {
        return true
      }
      return false
    },
    create: () => true,
    update: ({ req: { user } }: { req: { user?: unknown } }) => !!user,
    delete: ({ req: { user } }: { req: { user?: unknown } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'isSpam',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Marked as spam by anti-spam protection',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
