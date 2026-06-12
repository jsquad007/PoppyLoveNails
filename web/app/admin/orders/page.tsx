import { getOrders, getOrderStats } from '@/lib/db/queries'
import { formatAUD } from '@/lib/cart'
import OrderStatusSelect from './order-status-select'
import TrackingNumberInput from './tracking-number-input'

const STATUS_STYLES: Record<string, string> = {
  new_request:      'bg-[var(--color-surface-highest)] text-[var(--color-on-surface-variant)]',
  awaiting_payment: 'bg-[#fef3c7] text-[#92400e]',
  in_production:    'bg-[var(--color-primary)] text-[var(--color-on-primary)]',
  shipped:          'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]',
  cancelled:        'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
}

const STATUS_LABELS: Record<string, string> = {
  new_request:      'New Request',
  awaiting_payment: 'Awaiting Payment',
  in_production:    'In Production',
  shipped:          'Shipped',
  cancelled:        'Cancelled',
}

export const metadata = { title: 'Order Management — Admin' }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const [orderList, stats] = await Promise.all([
    getOrders(status),
    getOrderStats(),
  ])

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="type-headline-lg text-[var(--color-primary)]">Order Management</h1>
          <p className="type-body-md text-[var(--color-on-surface-variant)] mt-1">
            Overseeing the delicate lifecycle of every custom creation.
          </p>
        </div>
        <a
          href="/api/admin/orders-csv"
          className="type-label-md px-5 py-2.5 border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          Export CSV
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="New Requests"  value={stats.newRequests} />
        <StatCard label="In Production" value={stats.inProduction} />
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'All Statuses',   value: undefined },
          { label: 'New Request',      value: 'new_request' },
          { label: 'Awaiting Payment', value: 'awaiting_payment' },
          { label: 'In Production',    value: 'in_production' },
          { label: 'Shipped',          value: 'shipped' },
          { label: 'Cancelled',        value: 'cancelled' },
        ].map((f) => {
          const isActive = (status ?? undefined) === f.value
          return (
            <a
              key={f.label}
              href={f.value ? `/admin/orders?status=${f.value}` : '/admin/orders'}
              className={`px-4 py-1.5 type-label-sm border transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                  : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
              }`}
            >
              {f.label}
            </a>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_2fr_2fr_1fr_1.5fr_1fr] gap-4 px-6 py-3 border-b border-[var(--color-outline-variant)]">
          {['Order ID', 'Customer', 'Product / Set', 'Date', 'Status', 'Total'].map((h) => (
            <span key={h} className="type-label-sm text-[var(--color-outline)]">{h}</span>
          ))}
        </div>

        {orderList.length === 0 ? (
          <div className="py-16 text-center">
            <p className="type-body-md text-[var(--color-outline)]">No orders found.</p>
          </div>
        ) : (
          orderList.map((order) => {
            const lineItems = (order.lineItems as any[]) ?? []
            const productSummary = lineItems.length > 0
              ? `${lineItems[0].productName ?? 'Custom Set'} (${lineItems[0].length ?? ''})`
              : order.type === 'custom' ? 'Custom Commission' : '—'

            return (
              <div
                key={order.id}
                className="px-6 py-4 border-b border-[var(--color-outline-variant)] last:border-b-0 hover:bg-[var(--color-surface-low)] transition-colors space-y-3"
              >
                {/* Main row */}
                <div className="grid grid-cols-[1fr_2fr_2fr_1fr_1.5fr_1fr] gap-4 items-center">
                  <span className="type-label-sm text-[var(--color-outline)]">#{order.id}</span>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center shrink-0">
                      <span className="type-label-sm text-[var(--color-on-secondary-container)]">
                        {order.customerName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="type-body-md text-[var(--color-on-surface)] truncate">{order.customerName}</span>
                  </div>

                  <span className="type-body-md text-[var(--color-on-surface-variant)] truncate">{productSummary}</span>

                  <span className="type-label-sm text-[var(--color-outline)]">
                    {new Date(order.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>

                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />

                  <span className="type-label-md text-[var(--color-on-surface)]">
                    {formatAUD(order.totalAmount)}
                  </span>
                </div>

                {/* Tracking row — only shown when shipped */}
                {order.status === 'shipped' && (
                  <div className="flex items-center gap-3">
                    <span className="type-label-sm text-[var(--color-outline)] w-24 shrink-0">Tracking</span>
                    <div className="flex-1 max-w-sm">
                      <TrackingNumberInput orderId={order.id} currentTracking={order.auspostTrackingNumber ?? null} />
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <p className="type-label-sm text-[var(--color-outline)] mt-4">
        Showing {orderList.length} order{orderList.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] px-6 py-5">
      <p className="type-label-sm text-[var(--color-outline)] mb-1">{label.toUpperCase()}</p>
      <p className="type-display-lg text-[var(--color-primary)]">{value}</p>
    </div>
  )
}
