import { eq, and, sql, desc, count } from 'drizzle-orm'
import { db } from './index'
import { products, orders, customCommissions } from './schema'
import type { Product, Order } from './schema'

export type { Product, Order }

export async function getAllProducts(): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(products.createdAt)
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        sql`${products.collections} @> ARRAY[${collection}]::text[]`
      )
    )
    .orderBy(products.createdAt)
}

export async function getProductBySku(sku: string): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.sku, sku), eq(products.isActive, true)))
    .limit(1)
  return product ?? null
}

export async function getProductById(id: string): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
  return product ?? null
}

// ─── Order queries ─────────────────────────────────────────────────────────────

export async function getOrders(status?: string): Promise<Order[]> {
  if (status && status !== 'all') {
    return db
      .select()
      .from(orders)
      .where(eq(orders.status, status))
      .orderBy(desc(orders.createdAt))
  }
  return db.select().from(orders).orderBy(desc(orders.createdAt))
}

export async function getOrderById(id: string): Promise<Order | null> {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  return order ?? null
}

export async function getOrderStats(): Promise<{ newRequests: number; inProduction: number }> {
  const [newReqs] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, 'new_request'))
  const [inProd] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, 'in_production'))
  return { newRequests: newReqs.value, inProduction: inProd.value }
}
