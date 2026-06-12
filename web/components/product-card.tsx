import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/db/queries'
import { formatAUD } from '@/lib/cart'

const COLLECTION_LABELS: Record<string, string> = {
  floral:           'Floral',
  bows_ribbons:     'Bows & Ribbons',
  glam_glitter:     'Glam & Glitter',
  soft_dreamy:      'Soft & Dreamy',
  bold_jewel_tones: 'Bold & Jewel Tones',
  bridal:           'Bridal & Special Occasion',
}

export default function ProductCard({ product }: { product: Product }) {
  // Use first collection for URL, fall back to 'all'
  const collection = product.collections[0] ?? 'all'
  const href = `/shop/${collectionSlug(collection)}/${product.sku}`
  const isOutOfStock = product.stockCount === 0
  const isLowStock   = product.stockCount > 0 && product.stockCount <= 3

  return (
    <Link href={href} className="group block">
      {/* Image */}
      <div className="gallery-frame aspect-square relative overflow-hidden mb-4">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface-high)]">
            <span className="type-label-sm text-[var(--color-outline)]">No image</span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="type-label-sm text-[var(--color-outline)]">Sold Out</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="space-y-1">
        {/* Collections chips */}
        <div className="flex flex-wrap gap-1">
          {product.collections.slice(0, 2).map((c) => (
            <span
              key={c}
              className="type-label-sm text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container)] px-2 py-0.5"
            >
              {COLLECTION_LABELS[c] ?? c}
            </span>
          ))}
        </div>

        <p className="type-headline-md text-[var(--color-primary)] group-hover:opacity-70 transition-opacity">
          {product.name}
        </p>

        <div className="flex items-center justify-between">
          <p className="type-label-md text-[var(--color-on-surface-variant)]">
            {formatAUD(product.price)}
          </p>
          {isLowStock && (
            <span className="type-label-sm text-[var(--color-error)]">
              Only {product.stockCount} left
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// Convert DB enum value to URL slug (bows_ribbons → bows-ribbons)
export function collectionSlug(dbValue: string): string {
  return dbValue.replace(/_/g, '-')
}

// Convert URL slug to DB enum value (bows-ribbons → bows_ribbons)
export function slugToCollection(slug: string): string {
  return slug.replace(/-/g, '_')
}
