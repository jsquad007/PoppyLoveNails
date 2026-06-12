import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — PoppyLove Creations',
  description: 'The story behind PoppyLove Creations — handcrafted press-on nails made with love.',
}

export default function AboutPage() {
  return (
    <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-12 md:py-20">

      {/* Hero */}
      <div className="max-w-2xl mb-16 md:mb-24">
        <p className="type-label-sm text-[var(--color-outline)] mb-3 tracking-widest uppercase">Our Story</p>
        <h1 className="type-headline-lg text-[var(--color-primary)] mb-6">
          Crafted with intention.<br />Worn with confidence.
        </h1>
        <p className="type-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          PoppyLove Creations was born from a love of beauty, detail, and self-expression.
          Every set is hand-painted by a single pair of hands — never rushed, never mass-produced.
        </p>
      </div>

      {/* Story sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-20">

        <div className="space-y-4">
          <h2 className="type-headline-md text-[var(--color-primary)]">Where it began</h2>
          <p className="type-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
            {/* Replace with your founding story */}
            It started at a kitchen table, a set of tiny brushes, and an obsession with getting the details right.
            What began as a hobby quickly became something more — a way to bring a little artistry into everyday life.
          </p>
          <p className="type-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
            {/* Replace with your background */}
            Each design starts as a sketch, becomes a colour story, and is finally brought to life one nail at a time.
            No two sets are ever exactly alike.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="type-headline-md text-[var(--color-primary)]">The philosophy</h2>
          <p className="type-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
            {/* Replace with your values/approach */}
            We believe that beautiful nails shouldn't require hours at a salon. Press-ons done right — with quality
            materials, precise sizing, and genuine care — can look just as stunning as anything done in-chair.
          </p>
          <p className="type-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
            Every order is packed by hand and sent with love. If something isn't right, we make it right.
          </p>
        </div>

      </div>

      {/* Values strip */}
      <div className="border-t border-b border-[var(--color-outline-variant)] py-12 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { heading: 'Hand-painted',   body: 'Every set is painted by hand — no decals, no shortcuts.' },
            { heading: 'Made to order',  body: 'Your nails are made after you order, never sitting in a warehouse.' },
            { heading: 'Size-inclusive', body: 'XS to L widths and multiple lengths so every hand is catered for.' },
          ].map(({ heading, body }) => (
            <div key={heading} className="space-y-2">
              <p className="type-label-md text-[var(--color-primary)] tracking-widest uppercase">{heading}</p>
              <p className="type-body-md text-[var(--color-on-surface-variant)]">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="type-headline-md text-[var(--color-primary)]">Ready to find your set?</p>
        <p className="type-body-md text-[var(--color-on-surface-variant)]">
          Browse the full collection or design something entirely your own.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link
            href="/shop"
            className="px-8 py-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] type-label-md hover:opacity-90 transition-opacity"
          >
            Shop All Designs
          </Link>
          <Link
            href="/design-your-own"
            className="px-8 py-4 border border-[var(--color-primary)] text-[var(--color-primary)] type-label-md hover:bg-[var(--color-surface-low)] transition-colors"
          >
            Design Your Own
          </Link>
        </div>
      </div>

    </div>
  )
}
