import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'captionPosition',
      type: 'select',
      defaultValue: 'below',
      options: [
        { label: 'Ispod slike', value: 'below' },
        { label: 'Preko slike', value: 'overlay' },
      ],
      admin: {
        description: 'Gde se prikazuje natpis i zasluga autora slike.',
      },
    },
  ],
}
