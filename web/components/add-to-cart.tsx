'use client'

import { useState } from 'react'
import { addToCart, formatAUD } from '@/lib/cart'
import type { Product } from '@/lib/db/queries'

const SHAPE_LABELS: Record<string, string> = {
  almond:   'Almond',
  coffin:   'Coffin',
  stiletto: 'Stiletto',
  oval:     'Oval',
  square:   'Square',
  squoval:  'Squoval',
}

const WIDTH_LABELS: Record<string, string> = {
  xs: 'XS',
  s:  'S',
  m:  'M',
  l:  'L',
}

const LENGTH_LABELS: Record<string, string> = {
  extra_short: 'Extra Short',
  short:       'Short',
  medium:      'Medium',
  long:        'Long',
}

export default function AddToCart({ product }: { product: Product }) {
  const [selectedShape,  setSelectedShape]  = useState<string | null>(null)
  const [selectedWidth,  setSelectedWidth]  = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  const isOutOfStock = product.stockCount === 0
  const allSelected  = selectedShape && selectedWidth && selectedLength
  const canAdd       = allSelected && !isOutOfStock

  function handleAddToCart() {
    if (!canAdd) return
    addToCart({
      productId:   product.id,
      productName: product.name,
      productSku:  product.sku,
      imageUrl:    product.images[0] ?? '',
      unitPrice:   product.price,
      shape:       selectedShape!,
      width:       selectedWidth!,
      length:      selectedLength!,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Shape */}
      {product.shapes.length > 0 && (
        <div className="space-y-3">
          <p className="type-label-sm text-[var(--color-primary)]">Nail Shape</p>
          <div className="flex flex-wrap gap-3">
            {product.shapes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedShape(s)}
                className={`px-4 py-2 border type-label-sm transition-colors ${
                  selectedShape === s
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
                }`}
              >
                {SHAPE_LABELS[s] ?? s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Width */}
      {product.widths.length > 0 && (
        <div className="space-y-3">
          <p className="type-label-sm text-[var(--color-primary)]">Nail Width</p>
          <div className="flex flex-wrap gap-2">
            {product.widths.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWidth(w)}
                className={`w-12 h-10 border type-label-sm transition-colors ${
                  selectedWidth === w
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
                }`}
              >
                {WIDTH_LABELS[w] ?? w.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="/faq#size-guide"
            className="type-label-sm text-[var(--color-outline)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-colors"
          >
            Size Guide
          </a>
        </div>
      )}

      {/* Length */}
      {product.lengths.length > 0 && (
        <div className="space-y-3">
          <p className="type-label-sm text-[var(--color-primary)]">Nail Length</p>
          <div className="flex flex-wrap gap-2">
            {product.lengths.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLength(l)}
                className={`px-4 py-2 border type-label-sm transition-colors ${
                  selectedLength === l
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                    : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
                }`}
              >
                {LENGTH_LABELS[l] ?? l}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Validation hint */}
      {!allSelected && !isOutOfStock && (
        <p className="type-label-sm text-[var(--color-outline)]">
          Please select a shape, width, and length before adding to your bag.
        </p>
      )}

      {/* Add to Bag */}
      <button
        onClick={handleAddToCart}
        disabled={!canAdd}
        className={`w-full py-4 type-label-md transition-all ${
          isOutOfStock
            ? 'bg-[var(--color-surface-high)] text-[var(--color-outline)] cursor-not-allowed'
            : canAdd
            ? added
              ? 'bg-[var(--color-secondary)] text-[var(--color-on-secondary)]'
              : 'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90'
            : 'bg-[var(--color-surface-container)] text-[var(--color-outline)] cursor-not-allowed'
        }`}
      >
        {isOutOfStock ? 'Sold Out' : added ? 'Added to Bag ✓' : `Add to Bag — ${formatAUD(product.price)}`}
      </button>

      {/* Add to Wishlist */}
      <button
        className="w-full py-4 border border-[var(--color-primary)] text-[var(--color-primary)] type-label-md hover:bg-[var(--color-surface-low)] transition-colors"
        onClick={() => {/* wishlist wired up in wishlist feature */}}
      >
        Add to Wishlist
      </button>
    </div>
  )
}
