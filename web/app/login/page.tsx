import { redirect } from 'next/navigation'
import { auth, signIn } from '@/lib/auth'

export const metadata = { title: 'Sign In — PoppyLove Creations' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const session = await auth()
  if (session) redirect('/')

  const { callbackUrl, error } = await searchParams

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-[var(--spacing-margin-mobile)]">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <p className="type-label-sm text-[var(--color-outline)] mb-2">Welcome back</p>
          <h1 className="type-headline-md text-[var(--color-primary)]">Sign In</h1>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-[var(--color-error-container)] border border-[var(--color-error)]">
            <p className="type-label-sm text-[var(--color-on-error-container)]">
              {error === 'CredentialsSignin'
                ? 'Incorrect email or password.'
                : 'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        {/* Email / password form */}
        <form
          action={async (formData: FormData) => {
            'use server'
            await signIn('credentials', {
              email:       formData.get('email'),
              password:    formData.get('password'),
              redirectTo:  callbackUrl ?? '/',
            })
          }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="type-label-sm text-[var(--color-primary)]">EMAIL</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="w-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 type-body-md text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="type-label-sm text-[var(--color-primary)]">PASSWORD</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 type-body-md text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] type-label-md py-3 hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-[var(--color-outline-variant)]" />
          <span className="type-label-sm text-[var(--color-outline)]">or</span>
          <div className="flex-1 border-t border-[var(--color-outline-variant)]" />
        </div>

        {/* Google sign-in */}
        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: callbackUrl ?? '/' })
          }}
        >
          <button
            type="submit"
            className="w-full border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] type-label-md py-3 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <p className="mt-8 text-center type-body-md text-[var(--color-on-surface-variant)]">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-[var(--color-primary)] underline underline-offset-2">
            Create one
          </a>
        </p>

      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
