import type { CollectionConfig } from 'payload'

export const SlotBooking: CollectionConfig = {
  slug: 'slotBooking',
  labels: {
    singular: 'Бронювання слоту',
    plural: 'Бронювання слотів',
  },
  admin: {
    useAsTitle: 'ticketCode',
  },
  fields: [
    {
      name: 'orderReference',
      label: 'ID замовлення WayForPay',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'ticketCode',
      label: 'Код квитка',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Код для перевірки квитка на вході (надсилається клієнту)',
      },
    },
    {
      name: 'service',
      label: 'Послуга',
      type: 'relationship',
      relationTo: 'service',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'slot',
      label: 'Часовий слот',
      type: 'relationship',
      relationTo: 'serviceSlot',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'date',
      label: 'Дата відвідування',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'd.MM.yyyy',
        },
      },
    },
    {
      name: 'childrenQty',
      label: 'Кількість дітей',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'adultsQty',
      label: 'Кількість дорослих',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalAmount',
      label: 'Сума',
      type: 'number',
      admin: {
        readOnly: true,
      },
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
      ],
    },
    {
      name: 'validUntil',
      label: 'Діє до',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'clientName',
      label: "Ім'я клієнта",
      type: 'text',
    },
    {
      name: 'clientPhone',
      label: 'Телефон клієнта',
      type: 'text',
    },
    {
      name: 'clientEmail',
      label: 'Email клієнта',
      type: 'text',
    },
  ],
}
