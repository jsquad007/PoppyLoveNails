import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from 'drizzle-orm/pg-core'

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const products = pgTable('products', {
  id:          text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sku:         varchar('sku', { length: 30 }).notNull().unique(),
  name:        text('name').notNull(),
  description: text('description'),
  price:       integer('price').notNull(), // cents AUD — e.g. 8400 = $84.00
  images:      text('images').array().notNull().default([]),

  // Multi-value attributes stored as text arrays (enum-validated in app layer)
  // collections: floral | bows_ribbons | glam_glitter | soft_dreamy | bold_jewel | bridal
  collections: text('collections').array().notNull().default([]),
  // shapes: almond | coffin | stiletto | oval | square | squoval
  shapes:      text('shapes').array().notNull().default([]),
  // widths: xs | s | m | l
  widths:      text('widths').array().notNull().default([]),
  // lengths: short | medium | long | extra_long
  lengths:     text('lengths').array().notNull().default([]),

  stockCount:  integer('stock_count').notNull().default(0),
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Auth — users, OAuth accounts, sessions, verification tokens (Auth.js v5)
// ---------------------------------------------------------------------------

export const users = pgTable('users', {
  id:           text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:         text('name'),
  email:        text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image:        text('image'),
  passwordHash: text('password_hash'), // null for OAuth-only users
  // role: customer | admin  (admin is env-var only; this column is always 'customer')
  role:         text('role').notNull().default('customer'),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

// Column names must match the JS property names expected by @auth/drizzle-adapter
export const accounts = pgTable('accounts', {
  id:                text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:            text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type:              text('type').notNull(),
  provider:          text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token:     text('refresh_token'),
  access_token:      text('access_token'),
  expires_at:        integer('expires_at'),
  token_type:        text('token_type'),
  scope:             text('scope'),
  id_token:          text('id_token'),
  session_state:     text('session_state'),
})

// sessionToken must be the primary key for @auth/drizzle-adapter
export const sessions = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId:       text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires:      timestamp('expires').notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token:      text('token').notNull(),
  expires:    timestamp('expires').notNull(),
})

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

// line_items shape (stored as JSONB):
// { productId: string, shape: string, width: string, length: string, quantity: number, unitPrice: number }[]
//
// Order ID format: PL-XXXX (generated in app layer, not DB default)
// status: new_request | awaiting_payment | in_production | shipped | delivered | cancelled
// type:   ready_made  | custom

export const orders = pgTable('orders', {
  id:                   varchar('id', { length: 20 }).primaryKey(), // PL-XXXX
  type:                 text('type').notNull(), // ready_made | custom
  status:               text('status').notNull().default('new_request'),
  customerName:         text('customer_name').notNull(),
  customerEmail:        text('customer_email').notNull(),
  customerPhone:        text('customer_phone'),
  shippingAddress:      jsonb('shipping_address'),
  lineItems:            jsonb('line_items').notNull().default([]),
  stripeSessionId:      text('stripe_session_id'),
  auspostTrackingNumber: text('auspost_tracking_number'),
  shippingAmount:       integer('shipping_amount').notNull().default(900), // 900 cents = $9.00
  totalAmount:          integer('total_amount').notNull(), // cents AUD
  userId:               text('user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt:            timestamp('created_at').notNull().defaultNow(),
  updatedAt:            timestamp('updated_at').notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Custom Commissions
// ---------------------------------------------------------------------------

export const customCommissions = pgTable('custom_commissions', {
  id:               text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId:          varchar('order_id', { length: 20 }).notNull().references(() => orders.id),
  nailShape:        text('nail_shape').notNull(), // almond | coffin | stiletto | oval | square | squoval
  nailLength:       text('nail_length').notNull(), // short | medium | long | extra_long
  nailWidth:        text('nail_width').notNull(),  // xs | s | m | l
  referenceImages:  text('reference_images').array().notNull().default([]),
  description:      text('description'),
  quotedPrice:      integer('quoted_price'), // cents AUD; null until admin reviews
  createdAt:        timestamp('created_at').notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------

export const wishlistItems = pgTable('wishlist_items', {
  id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// ---------------------------------------------------------------------------
// TypeScript types inferred from schema
// ---------------------------------------------------------------------------

export type Product          = typeof products.$inferSelect
export type NewProduct       = typeof products.$inferInsert
export type Order            = typeof orders.$inferSelect
export type NewOrder         = typeof orders.$inferInsert
export type CustomCommission = typeof customCommissions.$inferSelect
export type User             = typeof users.$inferSelect
export type WishlistItem     = typeof wishlistItems.$inferSelect
