import type { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: {
    singular: 'Галерея',
    plural: 'Галереї',
  },
  admin: {
    description: 'Секція «Атмосфера, яку хочеться відчути».',
  },
  fields: [
    {
      name: 'photo1',
      label: 'Фото 1',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photo2',
      label: 'Фото 2',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photo3',
      label: 'Фото 3',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photo4',
      label: 'Фото 4',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photo5',
      label: 'Фото 5',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
  ],
}
