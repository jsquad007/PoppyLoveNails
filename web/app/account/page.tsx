import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { getOrdersByUser } from '@/lib/db/queries'
import { formatAUD } from '@/lib/cart'
import type { Order } from '@/lib/db/schema'

export const metadata = {
  title: 'My Account — PoppyLove Creations',
}

const STATUS_LABELS: Record<string, { label: string; colour: string }> = {
  new_request:      { label: 'New Request',      colour: 'text-[var(--color-on-surface-variant)]' },
  awaiting_payment: { label: 'Awaiting Payment', colour: 'text-[#92400e]' },
  in_production:    { label: 'In Production',    colour: 'text-[var(--color-primary)]' },
  shipped:          { label: 'Shipped',          colour: 'text-[var(--color-on-secondary-container)]' },
  cancelled:        { label: 'Cancelled',        colour: 'text-[var(--color-error)]' },
}

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const orders = await getOrdersByUser(session.user.id)

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-12 md:py-16">

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="type-label-sm text-[var(--color-outline)] mb-2 tracking-widest uppercase">Welcome back</p>
          <h1 className="type-headline-lg text-[var(--color-primary)]">
            {session.user.name ?? session.user.email}
          </h1>
          <p className="type-body-md text-[var(--color-on-surface-variant)] mt-1">{session.user.email}</p>
        </div>

        <form action={async () => {
          'use server'
          await signOut({ redirectTo: '/' })
        }}>
          <button
            type="submit"
            className="type-label-sm text-[var(--color-outline)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-colors mt-1"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="border-t border-[var(--color-outline-variant)] mb-10" />

      {/* Order history */}
      <div>
        <h2 className="type-headline-md text-[var(--color-primary)] mb-6">Order History</h2>

        {orders.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <p className="type-body-md text-[var(--color-on-surface-variant)]">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] type-label-md hover:opacity-90 transition-opacity"
            >
              Browse Designs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function OrderRow({ order }: { order: Order }) {
  const status = STATUS_LABELS[order.status] ?? { label: order.status, colour: 'text-[var(--color-outline)]' }
  const lineItems = (order.lineItems as { productName?: string; quantity?: number }[]) ?? []
  const itemSummary = lineItems
    .map((i) => `${i.productName ?? 'Item'}${i.quantity && i.quantity > 1 ? ` ×${i.quantity}` : ''}`)
    .join(', ')

  return (
    <div className="gallery-frame p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <p className="type-label-md text-[var(--color-primary)]">{order.id}</p>
          <span className={`type-label-sm ${status.colour}`}>{status.label}</span>
        </div>
        <p className="type-body-md text-[var(--color-on-surface-variant)]">
          {itemSummary || 'Custom commission'}
        </p>
        <p className="type-label-sm text-[var(--color-outline)]">
          {new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <p className="type-label-md text-[var(--color-primary)]">{formatAUD(order.totalAmount)}</p>
        {order.auspostTrackingNumber && (
          <a
            href={`https://auspost.com.au/mypost/track/#/search?id=${order.auspostTrackingNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="type-label-sm text-[var(--color-outline)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-colors"
          >
            Track: {order.auspostTrackingNumber}
          </a>
        )}
      </div>
    </div>
  )
}
