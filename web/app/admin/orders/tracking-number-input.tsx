'use client'

import { useState, useTransition } from 'react'
import { updateTrackingNumber } from '../actions'

export default function TrackingNumberInput({
  orderId,
  currentTracking,
}: {
  orderId:         string
  currentTracking: string | null
}) {
  const [value,   setValue]   = useState(currentTracking ?? '')
  const [saved,   setSaved]   = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      await updateTrackingNumber(orderId, value.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false) }}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        placeholder="AusPost tracking no."
        className="flex-1 border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 py-1.5 type-label-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] transition-colors min-w-0"
      />
      <button
        onClick={handleSave}
        disabled={pending}
        className="shrink-0 px-3 py-1.5 type-label-sm border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
      >
        {saved ? 'Saved ✓' : pending ? '…' : 'Save'}
      </button>
      {value && (
        <a
          href={`https://auspost.com.au/mypost/track/#/search?id=${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 type-label-sm text-[var(--color-outline)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-colors"
        >
          Track ↗
        </a>
      )}
    </div>
  )
}
