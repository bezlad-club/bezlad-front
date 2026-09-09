import type { CollectionConfig } from 'payload'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

const validateTime = (value: unknown): true | string => {
  if (typeof value === 'string' && TIME_PATTERN.test(value)) {
    return true
  }
  return 'Вкажіть час у форматі ГГ:ХХ, наприклад 10:00'
}

export const ServiceSlot: CollectionConfig = {
  slug: 'serviceSlot',
  labels: {
    singular: 'Часовий слот',
    plural: 'Часові слоти',
  },
  admin: {
    useAsTitle: 'startTime',
  },
  fields: [
    {
      name: 'service',
      label: 'Послуга',
      type: 'relationship',
      relationTo: 'service',
      required: true,
      admin: {
        description:
          'Виберіть послугу з типом «За часовими слотами» (звичайні послуги не використовують слоти)',
      },
    },
    {
      name: 'weekdays',
      label: 'Дні тижня',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        {
          label: 'Пн',
          value: 'mon',
        },
        {
          label: 'Вт',
          value: 'tue',
        },
        {
          label: 'Ср',
          value: 'wed',
        },
        {
          label: 'Чт',
          value: 'thu',
        },
        {
          label: 'Пт',
          value: 'fri',
        },
        {
          label: 'Сб',
          value: 'sat',
        },
        {
          label: 'Нд',
          value: 'sun',
        },
      ],
      admin: {
        description: 'Дні тижня, для яких діє слот',
      },
    },
    {
      name: 'startTime',
      label: 'Час початку',
      type: 'text',
      required: true,
      validate: validateTime,
      admin: {
        description: 'Формат ГГ:ХХ, наприклад 10:00',
      },
    },
    {
      name: 'endTime',
      label: 'Час завершення',
      type: 'text',
      required: true,
      validate: validateTime,
      admin: {
        description: 'Формат ГГ:ХХ, наприклад 14:30',
      },
    },
    {
      name: 'price',
      label: 'Ціна (грн)',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'adultPrice',
      label: 'Ціна для дорослих (грн)',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Ціна за одного дорослого відвідувача',
      },
    },
    {
      name: 'capacity',
      label: 'Кількість місць (квитків) на слот',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description:
          'Максимальна кількість дітей на один слот на один день (кількість дорослих не обмежена та не враховується у місця)',
      },
    },
  ],
}
