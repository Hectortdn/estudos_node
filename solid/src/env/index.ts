import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number(),
  JWT_AUTH_SECRET: z.string(),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('⚠️ Invalid environments variables', _env.error.format())

  throw new Error('⚠️ Invalid environments variables')
}

export const env = _env.data
