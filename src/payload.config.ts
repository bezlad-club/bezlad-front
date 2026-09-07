import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import { uk } from '@payloadcms/translations/languages/uk'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Gallery } from './collections/Gallery'
import { Media } from './collections/Media'
import { PromoCode } from './collections/PromoCode'
import { PromoCodeReservation } from './collections/PromoCodeReservation'
import { Service } from './collections/Service'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  i18n: {
    supportedLanguages: { en, ru, uk },
    fallbackLanguage: 'en',
  },
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
    }),
  ],
  collections: [Users, Media, Service, Gallery, PromoCode, PromoCodeReservation],
  db: postgresAdapter({
    // Auto-create the schema on an empty database during production builds.
    // Default behavior otherwise
    push: process.env.NEXT_PHASE === 'phase-production-build' ? true : undefined,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor(),
  endpoints: [],
  globals: [],
  secret: process.env.PAYLOAD_SECRET || '',
  telemetry: false,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
  graphQL: {
    disable: true
  },
})
