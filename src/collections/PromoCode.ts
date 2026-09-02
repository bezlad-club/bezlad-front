import type { CollectionConfig } from 'payload'

export const PromoCode: CollectionConfig = {
  slug: 'promoCode',
  labels: {
    singular: 'Промокод',
    plural: 'Промокоди',
  },
  admin: {
    useAsTitle: 'code',
  },
  fields: [
    {
      name: 'code',
      label: 'Код',
      type: 'text',
      required: true,
    },
    {
      name: 'discountPercent',
      label: 'Відсоток знижки',
      type: 'number',
      required: true,
      min: 1,
      max: 100,
      admin: {
        description: 'Введіть значення від 1 до 100',
      },
    },
    {
      name: 'applicableServices',
      label: 'Застосовується до послуг',
      type: 'relationship',
      relationTo: 'service',
      hasMany: true,
      required: true,
      admin: {
        description: 'Виберіть послуги, до яких застосовується промокод',
      },
    },
    {
      name: 'type',
      label: 'Тип',
      type: 'select',
      required: true,
      defaultValue: 'reusable',
      options: [
        {
          label: 'Багаторазовий',
          value: 'reusable',
        },
        {
          label: 'Персональний (одноразовий)',
          value: 'personal',
        },
      ],
    },
    {
      name: 'isActive',
      label: 'Активний',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'validFrom',
      label: 'Діє з',
      type: 'date',
    },
    {
      name: 'validUntil',
      label: 'Діє до',
      type: 'date',
    },
    {
      name: 'usageLimit',
      label: 'Ліміт використань (загальний)',
      type: 'number',
      admin: {
        description: 'Залиште пустим для безлімітного',
      },
    },
    {
      name: 'usageCount',
      label: 'Кількість використань',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
