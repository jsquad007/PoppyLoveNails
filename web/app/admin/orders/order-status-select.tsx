'use client'

import { useTransition } from 'react'
import { updateOrderStatus } from '../actions'

const STATUSES = [
  { value: 'new_request',      label: 'New Request' },
  { value: 'awaiting_payment', label: 'Awaiting Payment' },
  { value: 'in_production',    label: 'In Production' },
  { value: 'shipped',          label: 'Shipped' },
  { value: 'cancelled',        label: 'Cancelled' },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId:       string
  currentStatus: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      defaultValue={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        const status = e.target.value
        startTransition(() => updateOrderStatus(orderId, status))
      }}
      className="type-label-sm border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface)] px-2 py-1 cursor-pointer hover:border-[var(--color-primary)] transition-colors disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
