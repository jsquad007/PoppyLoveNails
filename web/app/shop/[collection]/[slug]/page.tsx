import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductBySku } from '@/lib/db/queries'
import { formatAUD } from '@/lib/cart'
import AddToCart from '@/components/add-to-cart'
import { slugToCollection } from '@/components/product-card'

const COLLECTION_LABELS: Record<string, string> = {
  floral:           'Floral',
  bows_ribbons:     'Bows & Ribbons',
  glam_glitter:     'Glam & Glitter',
  soft_dreamy:      'Soft & Dreamy',
  bold_jewel_tones: 'Bold & Jewel Tones',
  bridal:           'Bridal & Special Occasion',
}

export async function generateMetadata(props: {
  params: Promise<{ collection: string; slug: string }>
}) {
  const { slug } = await props.params
  const product = await getProductBySku(slug)
  if (!product) return {}
  return {
    title:       `${product.name} — PoppyLove Creations`,
    description: product.description ?? undefined,
  }
}

export default async function ProductDetailPage(props: {
  params: Promise<{ collection: string; slug: string }>
}) {
  const { collection, slug } = await props.params
  const product = await getProductBySku(slug)
  if (!product) notFound()

  const collectionLabel = COLLECTION_LABELS[slugToCollection(collection)] ?? 'Shop'
  const isLowStock = product.stockCount > 0 && product.stockCount <= 3

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-10 md:py-16">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 type-label-sm text-[var(--color-outline)] mb-10" aria-label="Breadcrumb">
        <Link href="/shop"                 className="hover:text-[var(--color-primary)] transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop/${collection}`} className="hover:text-[var(--color-primary)] transition-colors">{collectionLabel}</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Left: Images ──────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="gallery-frame aspect-square relative overflow-hidden">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface-high)]">
                <span className="type-label-sm text-[var(--color-outline)]">No image</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {product.images.slice(1, 4).map((src, i) => (
                <div key={i} className="gallery-frame aspect-square relative overflow-hidden">
                  <Image
                    src={src}
                    alt={`${product.name} view ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="20vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Details ────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Label + name + price */}
          <div>
            <p className="type-label-sm text-[var(--color-outline)] mb-3">Artisan Series</p>
            <h1 className="type-headline-lg text-[var(--color-primary)] mb-3">{product.name}</h1>
            <p className="type-body-lg text-[var(--color-on-surface-variant)]">
              {formatAUD(product.price)}
            </p>
            {isLowStock && (
              <p className="type-label-sm text-[var(--color-error)] mt-1">
                Only {product.stockCount} left — order soon
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="type-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Includes */}
          <ul className="space-y-1">
            {['Includes complete application kit', 'Reusable with proper care'].map((item) => (
              <li key={item} className="flex items-start gap-2 type-body-md text-[var(--color-on-surface-variant)]">
                <span className="mt-1 text-[var(--color-secondary)]">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-[var(--color-outline-variant)]" />

          {/* Shape / Width / Length selectors + Add to Cart */}
          <AddToCart product={product} />

          {/* Divider */}
          <div className="border-t border-[var(--color-outline-variant)]" />

          {/* Accordions */}
          <Accordion title="What's Included">
            <p className="type-body-md text-[var(--color-on-surface-variant)]">
              Each set includes 10 hand-painted press-on nails, a mini nail file, cuticle stick, and adhesive tabs.
            </p>
          </Accordion>

          <Accordion title="Shipping & Returns">
            <p className="type-body-md text-[var(--color-on-surface-variant)]">
              Flat rate shipping $9.00 AUD — Australia wide. Dispatched within 2 business days. As these are hand-crafted items, we do not accept returns unless the item is damaged in transit.
            </p>
          </Accordion>
        </div>

      </div>
    </div>
  )
}

// ─── Simple accordion (no JS — CSS only via details/summary) ──────────────────

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-[var(--color-outline-variant)] pb-4">
      <summary className="flex items-center justify-between cursor-pointer list-none py-1">
        <span className="type-label-md text-[var(--color-primary)]">{title}</span>
        <span className="type-label-sm text-[var(--color-outline)] group-open:rotate-180 transition-transform">
          ↓
        </span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  )
}
