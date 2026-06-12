'use client'

import { useState, useEffect, useCallback } from 'react'
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

const SHAPE_LENGTHS: Record<string, string[]> = {
  almond:   ['extra_short', 'short', 'medium'],
  coffin:   ['extra_short', 'short', 'medium', 'long'],
  oval:     ['extra_short', 'short', 'medium'],
  stiletto: ['short', 'medium', 'long'],
  square:   ['extra_short', 'short', 'medium'],
  squoval:  ['extra_short'],
}

export default function AddToCart({ product }: { product: Product }) {
  const [selectedShape,  setSelectedShape]  = useState<string | null>(null)
  const [selectedWidth,  setSelectedWidth]  = useState<string | null>(null)
  const [selectedLength, setSelectedLength] = useState<string | null>(null)

  function handleShapeChange(shape: string) {
    setSelectedShape(shape)
    const available = SHAPE_LENGTHS[shape] ?? []
    if (selectedLength && !available.includes(selectedLength)) {
      setSelectedLength(null)
    }
  }
  const [added,           setAdded]           = useState(false)
  const [shapeGuideOpen,  setShapeGuideOpen]  = useState(false)
  const [lengthGuideOpen, setLengthGuideOpen] = useState(false)
  const [widthGuideOpen,  setWidthGuideOpen]  = useState(false)

  const closeShapeGuide  = useCallback(() => setShapeGuideOpen(false),  [])
  const closeLengthGuide = useCallback(() => setLengthGuideOpen(false), [])
  const closeWidthGuide  = useCallback(() => setWidthGuideOpen(false),  [])

  useEffect(() => {
    if (!shapeGuideOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeShapeGuide() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [shapeGuideOpen, closeShapeGuide])

  useEffect(() => {
    if (!lengthGuideOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLengthGuide() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lengthGuideOpen, closeLengthGuide])

  useEffect(() => {
    if (!widthGuideOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeWidthGuide() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [widthGuideOpen, closeWidthGuide])

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
          <div className="flex items-center gap-3">
            <p className="type-label-sm text-[var(--color-primary)]">Nail Shape</p>
            <button
              type="button"
              onClick={() => setShapeGuideOpen(true)}
              className="type-label-sm text-[var(--color-outline)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-colors"
            >
              Shape Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.shapes.map((s) => (
              <button
                key={s}
                onClick={() => handleShapeChange(s)}
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
          <div className="flex items-center gap-3">
            <p className="type-label-sm text-[var(--color-primary)]">Nail Width</p>
            <button
              type="button"
              onClick={() => setWidthGuideOpen(true)}
              className="type-label-sm text-[var(--color-outline)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-colors"
            >
              Width Guide
            </button>
          </div>
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
        </div>
      )}

      {/* Length */}
      {product.lengths.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="type-label-sm text-[var(--color-primary)]">Nail Length</p>
            <button
              type="button"
              onClick={() => setLengthGuideOpen(true)}
              className="type-label-sm text-[var(--color-outline)] underline underline-offset-2 hover:text-[var(--color-primary)] transition-colors"
            >
              Length Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.lengths.map((l) => {
              const available = !selectedShape || (SHAPE_LENGTHS[selectedShape] ?? []).includes(l)
              return (
                <button
                  key={l}
                  disabled={!available}
                  onClick={() => available && setSelectedLength(l)}
                  className={`px-4 py-2 border type-label-sm transition-colors ${
                    !available
                      ? 'border-[var(--color-outline-variant)] text-[var(--color-outline)] opacity-35 cursor-not-allowed'
                      : selectedLength === l
                      ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                      : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  {LENGTH_LABELS[l] ?? l}
                </button>
              )
            })}
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

      {/* Width Guide Modal */}
      {widthGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={closeWidthGuide}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
            onClick={closeWidthGuide}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="bg-[var(--color-surface)] p-6 max-w-2xl w-full space-y-6 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Measurement image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nail-measurement-guide.png"
              alt="Nail measurement guide"
              className="w-full h-auto"
            />

            {/* Width chart */}
            <div>
              <p className="type-headline-md text-[var(--color-primary)] text-center mb-4">Width Chart</p>
              <div className="overflow-x-auto">
                <table className="w-full text-center type-label-sm text-[var(--color-on-surface-variant)]">
                  <thead>
                    <tr>
                      <th className="pb-1 px-3 text-right" colSpan={6}>
                        <span className="type-label-sm text-[var(--color-outline)]">「mm」</span>
                      </th>
                    </tr>
                    <tr className="border-b border-[var(--color-outline-variant)]">
                      <th className="py-2 px-3 text-left"></th>
                      {['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'].map((h) => (
                        <th key={h} className="py-2 px-3 text-[var(--color-primary)] font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: 'XS', widths: [14, 10, 11, 10, 7]  },
                      { size: 'S',  widths: [15, 11, 12, 11, 8]  },
                      { size: 'M',  widths: [16, 12, 13, 12, 9]  },
                      { size: 'L',  widths: [17, 13, 14, 13, 10] },
                    ].map((row) => (
                      <tr key={row.size} className="border-b border-[var(--color-outline-variant)] last:border-0">
                        <td className="py-2 px-3 type-label-md text-[var(--color-primary)] text-left font-medium">{row.size}</td>
                        {row.widths.map((w, i) => (
                          <td key={i} className="py-2 px-3">{w}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Length Guide Modal */}
      {lengthGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={closeLengthGuide}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
            onClick={closeLengthGuide}
            aria-label="Close"
          >
            ×
          </button>
          <div
            className="bg-[var(--color-surface)] p-6 max-w-2xl w-full overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="type-headline-md text-[var(--color-primary)] text-center mb-4">Length Guide</p>
            <table className="w-full text-center type-label-sm text-[var(--color-on-surface-variant)]">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)]">
                  {['Length (mm)', 'Almond', 'Coffin', 'Oval', 'Stiletto', 'Square', 'Squoval'].map((h) => (
                    <th key={h} className="px-3 py-2 text-[var(--color-primary)] font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Extra Short', '20.1-20.7', '16.5-17.5', '17.0-19.0', '',           '16.5-19.0', '15.2-17.7'],
                  ['Short',       '22.9-23.6', '19.5-21.5', '19.2-20.1', '21.0-22.0', '20.0-23.7', ''],
                  ['Medium',      '24.6-25.2', '24.4-25.4', '21.0-22.5', '28.0-29.0', '24.0-25.0', ''],
                  ['Long',        '',          '29.5-31.0', '',          '32.5-33.5',  '',          ''],
                ].map(([label, ...cells]) => (
                  <tr key={label} className="border-b border-[var(--color-outline-variant)] last:border-0">
                    <td className="px-3 py-2 text-[var(--color-primary)] font-medium whitespace-nowrap">{label}</td>
                    {cells.map((cell, i) => (
                      <td key={i} className="px-3 py-2 whitespace-nowrap">{cell || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Shape Guide Modal */}
      {shapeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeShapeGuide}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
            onClick={closeShapeGuide}
            aria-label="Close"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nail-shape-guide.png"
            alt="Nail shape guide"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  )
}
