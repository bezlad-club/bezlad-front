import type { CollectionConfig } from 'payload'

export const Service: CollectionConfig = {
  slug: 'service',
  labels: {
    singular: 'Послуга',
    plural: 'Послуги',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
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
      min: 0,
    },
    {
      name: 'menuOrder',
      label: 'Порядок відображення',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'paymentUrl',
      label: 'Посилання на оплату',
      type: 'text',
      required: true,
    },
  ],
}
