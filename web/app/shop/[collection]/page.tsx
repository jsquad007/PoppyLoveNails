import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductsByCollection } from '@/lib/db/queries'
import ProductCard from '@/components/product-card'
import { slugToCollection } from '@/components/product-card'

const COLLECTION_META: Record<string, { label: string; description: string }> = {
  floral:           { label: 'Floral',                    description: 'Delicate florals and botanical motifs.' },
  bows_ribbons:     { label: 'Bows & Ribbons',            description: 'Playful ribbons and sweet bow details.' },
  glam_glitter:     { label: 'Glam & Glitter',            description: 'Dazzling glitter and high-shine finishes.' },
  soft_dreamy:      { label: 'Soft & Dreamy',             description: 'Pastel tones and soft, romantic textures.' },
  bold_jewel_tones: { label: 'Bold & Jewel Tones',        description: 'Rich jewel hues for a statement look.' },
  bridal:           { label: 'Bridal & Special Occasion', description: 'Timeless elegance for your most important moments.' },
}

const ALL_COLLECTIONS = Object.keys(COLLECTION_META)

const TABS = [
  { label: 'All',                       href: '/shop',               slug: null },
  { label: 'Floral',                    href: '/shop/floral',        slug: 'floral' },
  { label: 'Bows & Ribbons',            href: '/shop/bows-ribbons',  slug: 'bows-ribbons' },
  { label: 'Glam & Glitter',            href: '/shop/glam-glitter',  slug: 'glam-glitter' },
  { label: 'Soft & Dreamy',             href: '/shop/soft-dreamy',   slug: 'soft-dreamy' },
  { label: 'Bold & Jewel Tones',        href: '/shop/bold-jewel-tones', slug: 'bold-jewel-tones' },
  { label: 'Bridal & Special Occasion', href: '/shop/bridal',        slug: 'bridal' },
]

export async function generateStaticParams() {
  return ALL_COLLECTIONS.map((c) => ({ collection: c.replace(/_/g, '-') }))
}

export async function generateMetadata(props: { params: Promise<{ collection: string }> }) {
  const { collection } = await props.params
  const meta = COLLECTION_META[slugToCollection(collection)]
  if (!meta) return {}
  return { title: `${meta.label} — PoppyLove Creations` }
}

export default async function CollectionPage(props: {
  params: Promise<{ collection: string }>
}) {
  const { collection } = await props.params
  const dbCollection = slugToCollection(collection)

  if (!COLLECTION_META[dbCollection]) notFound()

  const { label, description } = COLLECTION_META[dbCollection]
  const products = await getProductsByCollection(dbCollection)

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-12 md:py-16">

      {/* Header */}
      <div className="mb-10 md:mb-14">
        <p className="type-label-sm text-[var(--color-outline)] mb-2">Collection</p>
        <h1 className="type-headline-lg text-[var(--color-primary)] mb-3">{label}</h1>
        <p className="type-body-md text-[var(--color-on-surface-variant)]">{description}</p>
      </div>

      {/* Collection filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10 md:mb-14 border-b border-[var(--color-outline-variant)] pb-6">
        {TABS.map((tab) => {
          const isActive = tab.slug === collection
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-4 py-2 type-label-sm border transition-colors ${
                isActive
                  ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]'
                  : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="py-24 text-center">
          <p className="type-body-lg text-[var(--color-outline)]">
            No designs in this collection yet. Check back soon.
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
