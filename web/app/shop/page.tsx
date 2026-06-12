import Link from 'next/link'
import { getAllProducts } from '@/lib/db/queries'
import ProductCard from '@/components/product-card'

const COLLECTIONS = [
  { label: 'All',                       slug: null },
  { label: 'Floral',                    slug: 'floral' },
  { label: 'Bows & Ribbons',            slug: 'bows-ribbons' },
  { label: 'Glam & Glitter',            slug: 'glam-glitter' },
  { label: 'Soft & Dreamy',             slug: 'soft-dreamy' },
  { label: 'Bold & Jewel Tones',        slug: 'bold-jewel-tones' },
  { label: 'Bridal & Special Occasion', slug: 'bridal' },
]

export const metadata = {
  title: 'Shop All Designs — PoppyLove Creations',
}

export default async function ShopPage() {
  const products = await getAllProducts()

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-12 md:py-16">

      {/* Header */}
      <div className="mb-10 md:mb-14">
        <p className="type-label-sm text-[var(--color-outline)] mb-2">Browse</p>
        <h1 className="type-headline-lg text-[var(--color-primary)]">All Designs</h1>
      </div>

      {/* Collection filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10 md:mb-14 border-b border-[var(--color-outline-variant)] pb-6">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.label}
            href={c.slug ? `/shop/${c.slug}` : '/shop'}
            className={`px-4 py-2 type-label-sm border transition-colors ${
              c.slug === null
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="type-body-lg text-[var(--color-outline)]">
            No designs available yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  )
}
