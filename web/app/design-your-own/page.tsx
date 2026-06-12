import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CommissionForm from './commission-form'
import { submitCommission } from './actions'

export const metadata = {
  title: 'Design Your Own — PoppyLove Creations',
  description: 'Commission a bespoke set of hand-painted press-on nails, crafted entirely around your vision.',
}

export default async function DesignYourOwnPage(props: {
  searchParams: Promise<{ submitted?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/design-your-own')

  const { submitted } = await props.searchParams

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-16">

      {submitted ? (
        /* ── Success state ────────────────────────────────────────────── */
        <div className="max-w-lg mx-auto text-center py-16 space-y-6">
          <p className="type-label-sm text-[var(--color-secondary)]">Request received</p>
          <h1 className="type-headline-lg text-[var(--color-primary)]">Thank you!</h1>
          <p className="type-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
            Your custom commission request has been submitted. We'll review your brief and get back to you within 24 hours with a personalised quote. No payment is taken until your design is confirmed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/shop"
              className="px-8 py-3 border border-[var(--color-outline-variant)] type-label-md text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Browse the Shop
            </Link>
            <Link
              href="/account"
              className="px-8 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] type-label-md hover:opacity-90 transition-opacity"
            >
              View My Account
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ── Hero ──────────────────────────────────────────────────── */}
          <section className="mb-20 text-center max-w-3xl mx-auto">
            <span className="type-label-md text-[var(--color-secondary)] uppercase tracking-[0.2em] mb-4 block">
              Bespoke Artistry
            </span>
            <h1 className="type-display-lg text-[var(--color-primary)] mb-6">
              Bring your vision to life.
            </h1>
            <p className="type-body-lg text-[var(--color-on-surface-variant)]">
              Collaborate with our lead artists to create a set of custom-designed press-on nails that are as unique as your own signature.
            </p>
          </section>

          {/* ── Commission form ───────────────────────────────────────── */}
          <CommissionForm
            action={submitCommission}
            defaultName={session.user.name ?? ''}
            defaultEmail={session.user.email ?? ''}
          />
        </>
      )}
    </div>
  )
}
