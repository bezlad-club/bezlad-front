import type { CollectionConfig } from 'payload'

export const PromoCodeReservation: CollectionConfig = {
  slug: 'promoCodeReservation',
  labels: {
    singular: 'Резервація промокодів',
    plural: 'Резервації промокодів',
  },
  admin: {
    useAsTitle: 'orderReference',
  },
  fields: [
    {
      name: 'promoCode',
      label: 'Промокод',
      type: 'relationship',
      relationTo: 'promoCode',
      required: true,
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'reserved',
      admin: {
        readOnly: true,
      },
      options: [
        {
          label: 'Зарезервовано',
          value: 'reserved',
        },
        {
          label: 'Підтверджено (Оплачено)',
          value: 'confirmed',
        },
        {
          label: 'Скасовано',
          value: 'cancelled',
        },
        {
          label: 'Минув термін',
          value: 'expired',
        },
      ],
    },
    {
      name: 'reservedAt',
      label: 'Час резервації',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'validUntil',
      label: 'Діє до',
      type: 'date',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'orderReference',
      label: 'ID замовлення WayForPay',
      type: 'text',
    },
    {
      name: 'finalAmount',
      label: 'Сума зі знижкою',
      type: 'number',
    },
  ],
}
