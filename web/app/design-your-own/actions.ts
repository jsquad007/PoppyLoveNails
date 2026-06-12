'use server'

import { redirect } from 'next/navigation'
import { put }      from '@vercel/blob'
import { db }       from '@/lib/db'
import { orders, customCommissions } from '@/lib/db/schema'
import { auth }     from '@/lib/auth'

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `PL-C-${suffix}`
}

export async function submitCommission(formData: FormData) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/design-your-own')

  const name        = (formData.get('name')        as string).trim()
  const email       = (formData.get('email')       as string).trim()
  const phone       = (formData.get('phone')       as string | null)?.trim() || null
  const nailShape   =  formData.get('nailShape')   as string
  const nailLength  =  formData.get('nailLength')  as string
  const nailWidth   =  formData.get('nailWidth')   as string
  const description = (formData.get('description') as string | null)?.trim() || null
  const files       =  formData.getAll('referenceImages') as File[]

  // Upload reference images
  const imageUrls: string[] = []
  for (const file of files) {
    if (file.size === 0) continue
    const blob = await put(`commissions/${Date.now()}-${file.name}`, file, { access: 'public' })
    imageUrls.push(blob.url)
  }

  const orderId = generateOrderId()

  await db.insert(orders).values({
    id:            orderId,
    type:          'custom',
    status:        'new_request',
    customerName:  name,
    customerEmail: email,
    customerPhone: phone,
    lineItems:     [],
    totalAmount:   0, // quoted later by admin
    userId:        session.user.id ?? null,
  })

  await db.insert(customCommissions).values({
    orderId,
    nailShape,
    nailLength,
    nailWidth,
    referenceImages: imageUrls,
    description,
  })

  redirect('/design-your-own?submitted=true')
}
