/**
 * Run once to create the admin user in the database.
 * Usage: npx tsx scripts/seed-admin.ts
 */
import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import bcrypt from 'bcryptjs'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { users } from '../lib/db/schema'
import { eq } from 'drizzle-orm'

const sql = neon(process.env.DATABASE_URL!)
const db  = drizzle(sql)

const email    = process.env.ADMIN_EMAIL!
const password = process.env.ADMIN_PASSWORD!

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local')
  process.exit(1)
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 12)

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (existing.length > 0) {
    await db.update(users).set({ passwordHash }).where(eq(users.email, email))
    console.log(`✓ Updated password for existing admin user: ${email}`)
  } else {
    await db.insert(users).values({
      email,
      passwordHash,
      name: 'Admin',
      role: 'customer',
    })
    console.log(`✓ Created admin user: ${email}`)
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
