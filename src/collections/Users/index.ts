import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: () => true, // Allow public registration
    delete: authenticated,
    read: () => true, // Allow reading user profiles publicly
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Used in the public author page URL. Auto-generated from the name when left empty.',
      },
      hooks: {
        beforeValidate: [
          ({ data, value, originalDoc }) => {
            if (value) return value

            const name = typeof data?.name === 'string' ? data.name : originalDoc?.name
            const email = typeof data?.email === 'string' ? data.email : originalDoc?.email
            const source = name || (email ? email.split('@')[0] : '')

            return source ? slugify(source) : value
          },
        ],
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short author biography shown on the author page.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Square portrait image. Displayed as a circle on the author page.',
      },
    },
    {
      name: 'socials',
      type: 'group',
      admin: {
        description: 'Optional links shown as icons on the author page.',
      },
      fields: [
        { name: 'website', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'x', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
      ],
    },
  ],
  timestamps: true,
}
