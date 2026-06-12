'use client'

import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-12 md:py-16">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="type-label-md text-[var(--color-primary)]">
              PoppyLove Creations
            </Link>
            <p className="type-body-md text-[var(--color-on-surface-variant)] max-w-[220px]">
              Artistry in every detail. Hand-painted press-on nails for the discerning individual.
            </p>
            {/* Social icons — email obfuscated via JS, Instagram link */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://instagram.com/poppylovecreations"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
              >
                <InstagramIcon />
              </a>
              {/* Email rendered via JS to prevent bot scraping */}
              <ContactEmailLink />
            </div>
          </div>

          {/* Shop column */}
          <div className="flex flex-col gap-4">
            <p className="type-label-sm text-[var(--color-primary)]">Shop</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Collections',    href: '/shop' },
                { label: 'Design Your Own', href: '/design-your-own' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="type-body-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div className="flex flex-col gap-4">
            <p className="type-label-sm text-[var(--color-primary)]">Support</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'FAQ',               href: '/faq' },
                { label: 'Size Guide',        href: '/faq#size-guide' },
                { label: 'Track My Order',    href: '/track' },
                { label: 'Shipping & Returns', href: '/faq#shipping' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="type-body-md text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div className="flex flex-col gap-4">
            <p className="type-label-sm text-[var(--color-primary)]">Newsletter</p>
            <p className="type-body-md text-[var(--color-on-surface-variant)]">
              Join our inner circle for exclusive collection drops and artistic insights.
            </p>
            <form className="flex items-center border-b border-[var(--color-on-surface)] mt-1" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="YOUR EMAIL"
                className="flex-1 bg-transparent py-2 type-label-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="text-[var(--color-primary)] hover:opacity-70 transition-opacity pl-2">
                <ArrowRightIcon />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-outline-variant)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="type-label-sm text-[var(--color-outline)]">
            © {new Date().getFullYear()} PoppyLove Creations. Artistry in every detail.
          </p>
          <div className="flex gap-6">
            <Link href="/faq#privacy"  className="type-label-sm text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link>
            <Link href="/faq#terms"    className="type-label-sm text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

// Email link rendered client-side only to prevent bot scraping
function ContactEmailLink() {
  const handleClick = () => {
    // Assembled at runtime — never a plain string in the HTML source
    const user   = 'hello'
    const domain = 'poppylove.au'
    window.location.href = `mailto:${user}@${domain}`
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Email us"
      className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
    >
      <MailIcon />
    </button>
  )
}

// ─── Inline SVG icons ──────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}
