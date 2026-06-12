import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-low)]">
      {/* Admin top bar */}
      <header className="bg-[var(--color-primary)] px-8 h-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="type-label-md text-[var(--color-on-primary)] opacity-80 hover:opacity-100 transition-opacity">
            PoppyLove Creations
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin/orders"   className="type-label-sm text-[var(--color-on-primary)] opacity-70 hover:opacity-100 transition-opacity">Orders</Link>
            <Link href="/admin/products" className="type-label-sm text-[var(--color-on-primary)] opacity-70 hover:opacity-100 transition-opacity">Products</Link>
          </nav>
        </div>
        <Link href="/" className="type-label-sm text-[var(--color-on-primary)] opacity-60 hover:opacity-100 transition-opacity">
          ← Back to site
        </Link>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  )
}
