import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
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
    slugField({
      position: 'sidebar',
    }),
  ],
}
