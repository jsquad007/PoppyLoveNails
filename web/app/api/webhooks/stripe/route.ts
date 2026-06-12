import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { orders, products } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId in metadata' }, { status: 400 })
    }

    // Fetch the order to decrement stock
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Move order to in_production
    await db
      .update(orders)
      .set({ status: 'in_production', updatedAt: new Date() })
      .where(eq(orders.id, orderId))

    // Decrement stock for each ready-made line item
    if (order.type === 'ready_made') {
      const lineItems = order.lineItems as Array<{ productId: string; quantity: number }>
      for (const item of lineItems) {
        await db
          .update(products)
          .set({ stockCount: sql`${products.stockCount} - ${item.quantity}` })
          .where(eq(products.id, item.productId))
      }
    }
  }

  return NextResponse.json({ received: true })
}
