import Link from 'next/link'
import { createProduct } from '../../actions'
import ProductForm from '../product-form'

export const metadata = { title: 'Add New Product — Admin' }

export default function NewProductPage() {
  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 type-label-sm text-[var(--color-outline)] mb-8">
        <Link href="/admin/orders"   className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/products" className="hover:text-[var(--color-primary)] transition-colors">Products</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)]">New Product</span>
      </nav>

      <div className="mb-8">
        <h1 className="type-headline-lg text-[var(--color-primary)]">Add New Product</h1>
        <p className="type-body-md text-[var(--color-on-surface-variant)] mt-1">
          Curate the presentation of your handcrafted nail art.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] p-8">
        <ProductForm action={createProduct} />
      </div>
    </div>
  )
}
