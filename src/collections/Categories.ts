import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { revalidateEntity } from './hooks/revalidateEntity'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: revalidateEntity('/category'),
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'titleSr',
      type: 'text',
      label: 'Title (Serbian)',
      admin: {
        description: 'Serbian translation of the category title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'descriptionSr',
      type: 'textarea',
      label: 'Description (Serbian)',
      admin: {
        description: 'Serbian translation of the category description',
      },
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
    slugField({
      position: 'sidebar',
    }),
  ],
}
