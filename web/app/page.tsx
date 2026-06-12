import Link from 'next/link'

const collections = [
  { label: 'Floral',                    slug: 'floral',           accent: '#d4e4c8' },
  { label: 'Bows & Ribbons',            slug: 'bows-ribbons',     accent: '#e8d4dc' },
  { label: 'Glam & Glitter',            slug: 'glam-glitter',     accent: '#e5e0c8' },
  { label: 'Soft & Dreamy',             slug: 'soft-dreamy',      accent: '#d8d4e8' },
  { label: 'Bold & Jewel Tones',        slug: 'bold-jewel-tones', accent: '#c8d4e0' },
  { label: 'Bridal & Special Occasion', slug: 'bridal',           accent: '#f0ece4' },
]

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionsSection />
      <DesignYourOwnSection />
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-high)]" style={{ minHeight: '80vh' }}>
      {/* Placeholder image area */}
      <div
        className="absolute inset-0 bg-[var(--color-surface-highest)]"
        aria-hidden="true"
      >
        {/* Replace this div with an <Image> once photography is ready */}
        <div className="w-full h-full flex items-center justify-center">
          <span className="type-label-sm text-[var(--color-outline)]">Hero photography</span>
        </div>
      </div>

      {/* Overlay content */}
      <div className="relative z-10 max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] flex items-end pb-16 md:pb-24" style={{ minHeight: '80vh' }}>
        <div className="max-w-lg">
          <p className="type-label-sm text-[var(--color-on-surface-variant)] mb-4">
            Bespoke Artistry
          </p>
          <h1 className="type-display-lg text-[var(--color-primary)] mb-6">
            Wear something<br />worth remembering.
          </h1>
          <p className="type-body-lg text-[var(--color-on-surface-variant)] mb-8 max-w-sm">
            Hand-painted press-on nail sets crafted for the discerning individual.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-block bg-[var(--color-primary)] text-[var(--color-on-primary)] type-label-md px-8 py-3 hover:opacity-90 transition-opacity"
            >
              Shop All Designs
            </Link>
            <Link
              href="/design-your-own"
              className="inline-block border border-[var(--color-primary)] text-[var(--color-primary)] type-label-md px-8 py-3 hover:bg-[var(--color-surface-high)] transition-colors"
            >
              Design Your Own
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Collections ──────────────────────────────────────────────────────────────

function CollectionsSection() {
  return (
    <section className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-20 md:py-28">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="type-label-sm text-[var(--color-outline)] mb-2">Browse</p>
          <h2 className="type-headline-lg text-[var(--color-primary)]">Collections</h2>
        </div>
        <Link
          href="/shop"
          className="type-label-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors hidden md:block"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {collections.map((col) => (
          <Link
            key={col.slug}
            href={`/shop/${col.slug}`}
            className="group block"
          >
            {/* Placeholder image tile */}
            <div
              className="gallery-frame aspect-square flex items-center justify-center mb-3 group-hover:border-[var(--color-outline)] transition-colors"
              style={{ backgroundColor: col.accent }}
            >
              <span className="type-label-sm text-[var(--color-on-surface-variant)]">
                {col.label}
              </span>
            </div>
            <p className="type-label-md text-[var(--color-primary)] group-hover:opacity-70 transition-opacity">
              {col.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 md:hidden">
        <Link href="/shop" className="type-label-md text-[var(--color-on-surface-variant)]">
          View All →
        </Link>
      </div>
    </section>
  )
}

// ─── Design Your Own promo ────────────────────────────────────────────────────

function DesignYourOwnSection() {
  return (
    <section className="bg-[var(--color-primary)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Text */}
          <div>
            <p className="type-label-sm text-[var(--color-on-primary-container)] mb-4">
              Commission
            </p>
            <h2 className="type-headline-lg text-[var(--color-on-primary)] mb-6">
              Something unique in mind?
            </h2>
            <p className="type-body-lg mb-8 max-w-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Work with us to design a bespoke set from scratch — your shape, your palette, your vision. Turnaround 1–2 weeks.
            </p>
            <Link
              href="/design-your-own"
              className="inline-block bg-[var(--color-on-primary)] text-[var(--color-primary)] type-label-md px-8 py-3 hover:opacity-90 transition-opacity"
            >
              Start Your Design
            </Link>
          </div>

          {/* Placeholder image */}
          <div
            className="aspect-square bg-[var(--color-primary-container)] flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="type-label-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Commission photography
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
