import type { CollectionConfig } from 'payload'
import { revalidateHomepage } from './hooks/revalidateHomepage'

export const Service: CollectionConfig = {
  slug: 'service',
  labels: {
    singular: 'Послуга',
    plural: 'Послуги',
  },
  admin: {
    useAsTitle: 'title',
  },
  hooks: {
    afterChange: [revalidateHomepage],
    afterDelete: [revalidateHomepage],
  },
  fields: [
    {
      name: 'type',
      label: 'Тип послуги',
      type: 'select',
      required: true,
      defaultValue: 'simple',
      options: [
        {
          label: 'Звичайний квиток',
          value: 'simple',
        },
        {
          label: 'За часовими слотами',
          value: 'slotted',
        },
      ],
    },
    {
      name: 'title',
      label: 'Назва',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Опис',
      type: 'text',
      required: true,
    },
    {
      name: 'second_description',
      label: 'Додатковий опис',
      type: 'text',
    },
    {
      name: 'image',
      label: 'Зображення',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'price',
      label: 'Ціна',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        condition: (data) => data.type !== 'slotted',
        description:
          'Використовується лише для звичайних квитків (ціни для послуг за часовими слотами задаються у самих слотах)',
      },
    },
    {
      name: 'menuOrder',
      label: 'Порядок відображення',
      type: 'number',
      required: true,
      min: 0,
    },
  ],
}
