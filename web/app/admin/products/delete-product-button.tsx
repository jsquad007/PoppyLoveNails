'use client'

import { useTransition } from 'react'
import { deleteProduct } from '../actions'

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId:   string
  productName: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return
        startTransition(() => deleteProduct(productId))
      }}
      className="type-label-sm text-[var(--color-error)] hover:opacity-70 transition-opacity disabled:opacity-40"
    >
      {isPending ? '…' : 'Delete'}
    </button>
  )
}
