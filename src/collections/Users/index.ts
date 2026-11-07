import type { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { authenticated } from '../../access/authenticated'
import { revalidateEntity } from '../hooks/revalidateEntity'

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
    // Accounts are provisioned by an administrator. Public self-registration
    // would let anyone create a user in the admin collection.
    create: authenticated,
    delete: authenticated,
    read: () => true, // Allow reading user profiles publicly
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  hooks: revalidateEntity('/author'),
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Author',
          value: 'author',
        },
      ],
      defaultValue: 'author',
      admin: {
        position: 'sidebar',
        description: 'User role determines permissions and access levels',
      },
      required: true,
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
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
  ],
  timestamps: true,
}
