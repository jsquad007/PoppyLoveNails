'use server'

import { revalidatePath } from 'next/cache'
import { redirect }        from 'next/navigation'
import { put, del }        from '@vercel/blob'
import { eq }              from 'drizzle-orm'
import { db }              from '@/lib/db'
import { products, orders } from '@/lib/db/schema'
import { auth }            from '@/lib/auth'

// ─── Guard: admin only ─────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }
}

// ─── Products ──────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const name        = formData.get('name')        as string
  const sku         = formData.get('sku')         as string
  const description = formData.get('description') as string | null
  const priceRaw    = formData.get('price')       as string
  const stockRaw    = formData.get('stock')       as string
  const collections = formData.getAll('collections') as string[]
  const shapes      = formData.getAll('shapes')      as string[]
  const widths      = formData.getAll('widths')       as string[]
  const lengths     = formData.getAll('lengths')      as string[]
  const files       = formData.getAll('images')       as File[]

  const price      = Math.round(parseFloat(priceRaw)  * 100)
  const stockCount = parseInt(stockRaw, 10)

  // Upload images to Vercel Blob
  const imageUrls: string[] = []
  for (const file of files) {
    if (file.size === 0) continue
    const blob = await put(`products/${sku}/${file.name}`, file, { access: 'public' })
    imageUrls.push(blob.url)
  }

  await db.insert(products).values({
    sku,
    name,
    description: description || null,
    price,
    stockCount,
    collections,
    shapes,
    widths,
    lengths,
    images: imageUrls,
    isActive: true,
  })

  revalidatePath('/shop')
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()

  const name        = formData.get('name')        as string
  const sku         = formData.get('sku')         as string
  const description = formData.get('description') as string | null
  const priceRaw    = formData.get('price')       as string
  const stockRaw    = formData.get('stock')       as string
  const collections = formData.getAll('collections') as string[]
  const shapes      = formData.getAll('shapes')      as string[]
  const widths      = formData.getAll('widths')       as string[]
  const lengths     = formData.getAll('lengths')      as string[]
  const files       = formData.getAll('images')       as File[]
  const existingImages = formData.getAll('existingImages') as string[]

  const price      = Math.round(parseFloat(priceRaw) * 100)
  const stockCount = parseInt(stockRaw, 10)

  // Upload any new images
  const newImageUrls: string[] = []
  for (const file of files) {
    if (file.size === 0) continue
    const blob = await put(`products/${sku}/${file.name}`, file, { access: 'public' })
    newImageUrls.push(blob.url)
  }

  await db.update(products)
    .set({
      sku,
      name,
      description: description || null,
      price,
      stockCount,
      collections,
      shapes,
      widths,
      lengths,
      images: [...existingImages, ...newImageUrls],
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))

  revalidatePath('/shop')
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath('/shop')
  revalidatePath('/admin/products')
}

export async function toggleProductActive(id: string, isActive: boolean) {
  await requireAdmin()
  await db.update(products).set({ isActive, updatedAt: new Date() }).where(eq(products.id, id))
  revalidatePath('/shop')
  revalidatePath('/admin/products')
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()
  await db.update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
  revalidatePath('/admin/orders')
}

export async function updateTrackingNumber(orderId: string, trackingNumber: string) {
  await requireAdmin()
  await db.update(orders)
    .set({ auspostTrackingNumber: trackingNumber, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
  revalidatePath('/admin/orders')
}
