'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const collections = [
  { label: 'Floral',                slug: 'floral' },
  { label: 'Bows & Ribbons',        slug: 'bows-ribbons' },
  { label: 'Glam & Glitter',        slug: 'glam-glitter' },
  { label: 'Soft & Dreamy',         slug: 'soft-dreamy' },
  { label: 'Bold & Jewel Tones',    slug: 'bold-jewel-tones' },
  { label: 'Bridal & Special Occasion', slug: 'bridal' },
]

export default function SiteNav() {
  const pathname = usePathname()

  // Hide the public nav on admin routes
  if (pathname.startsWith('/admin')) return null

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)]">
      <nav
        className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] h-14 flex items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="type-label-md text-[var(--color-primary)] tracking-widest shrink-0"
        >
          PoppyLove Creations
        </Link>

        {/* Centre links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Shop with hover dropdown */}
          <div className="group relative">
            <Link
              href="/shop"
              className="type-label-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
            >
              Shop
            </Link>
            {/* Collections dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block">
              <ul className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] py-2 min-w-[200px]">
                <li>
                  <Link
                    href="/shop"
                    className="block px-5 py-2 type-label-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-low)] transition-colors"
                  >
                    All Designs
                  </Link>
                </li>
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/shop/${c.slug}`}
                      className="block px-5 py-2 type-label-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-low)] transition-colors"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/design-your-own"
            className="type-label-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            Design Your Own
          </Link>

          <Link
            href="/about"
            className="type-label-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
          >
            About Us
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <Link href="/wishlist" aria-label="Wishlist">
            <HeartIcon />
          </Link>
          <Link href="/account" aria-label="Account">
            <PersonIcon />
          </Link>
          <Link href="/cart" aria-label="Cart">
            <BagIcon />
          </Link>

          {/* Mobile menu toggle — simple hamburger, expands below */}
          <button className="md:hidden" aria-label="Open menu">
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile nav (always rendered, toggled via CSS — no JS state needed for basic version) */}
      <div className="md:hidden border-t border-[var(--color-outline-variant)] px-[var(--spacing-margin-mobile)] py-4 flex flex-col gap-4 hidden">
        <Link href="/shop"            className="type-label-md text-[var(--color-on-surface-variant)]">Shop</Link>
        <Link href="/design-your-own" className="type-label-md text-[var(--color-on-surface-variant)]">Design Your Own</Link>
        <Link href="/about"           className="type-label-md text-[var(--color-on-surface-variant)]">About Us</Link>
      </div>
    </header>
  )
}

// ─── Inline SVG icons ──────────────────────────────────────────────────────────

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-on-surface-variant)]">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}
