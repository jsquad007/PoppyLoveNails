import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/db/queries'
import { updateProduct } from '../../../actions'
import ProductForm from '../../product-form'

export const metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const product = await getProductById(id)
  if (!product) notFound()

  // Bind the product id into the action
  const updateWithId = updateProduct.bind(null, id)

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 type-label-sm text-[var(--color-outline)] mb-8">
        <Link href="/admin/orders"   className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/products" className="hover:text-[var(--color-primary)] transition-colors">Products</Link>
        <span>/</span>
        <span className="text-[var(--color-on-surface-variant)]">Edit Product</span>
      </nav>

      <div className="mb-8">
        <p className="type-label-sm text-[var(--color-outline)] mb-1">Product Editor</p>
        <h1 className="type-headline-lg text-[var(--color-primary)]">Edit Artistry Detail</h1>
        <p className="type-body-md text-[var(--color-on-surface-variant)] mt-1">
          Curate the presentation of your handcrafted nail art. Every detail contributes to the boutique experience.
        </p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] p-8">
        <ProductForm product={product} action={updateWithId} />
      </div>
    </div>
  )
}
