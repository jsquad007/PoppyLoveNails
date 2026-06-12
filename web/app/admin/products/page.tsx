import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { formatAUD } from '@/lib/cart'
import DeleteProductButton from './delete-product-button'

const COLLECTION_LABELS: Record<string, string> = {
  floral:           'Floral',
  bows_ribbons:     'Bows & Ribbons',
  glam_glitter:     'Glam & Glitter',
  soft_dreamy:      'Soft & Dreamy',
  bold_jewel_tones: 'Bold & Jewel Tones',
  bridal:           'Bridal',
}

export const metadata = { title: 'Product Inventory — Admin' }

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products).orderBy(products.createdAt)

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="type-label-sm text-[var(--color-outline)] mb-1">Inventory Management</p>
          <h1 className="type-headline-lg text-[var(--color-primary)]">Nail Art Collections</h1>
          <p className="type-body-md text-[var(--color-on-surface-variant)] mt-1">
            Oversee your curated selection of handcrafted press-on nails.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="type-label-md px-5 py-2.5 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 transition-opacity"
        >
          + Add New Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)]">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] gap-4 px-6 py-3 border-b border-[var(--color-outline-variant)]">
          {['Product', 'Category', 'Price', 'Stock Status', 'Actions'].map((h) => (
            <span key={h} className="type-label-sm text-[var(--color-outline)]">{h}</span>
          ))}
        </div>

        {allProducts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="type-body-md text-[var(--color-outline)] mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="type-label-md text-[var(--color-primary)] underline">
              Add your first product
            </Link>
          </div>
        ) : (
          allProducts.map((product) => {
            const isOutOfStock = product.stockCount === 0
            const isLowStock   = product.stockCount > 0 && product.stockCount <= 3

            return (
              <div
                key={product.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] gap-4 px-6 py-4 border-b border-[var(--color-outline-variant)] last:border-b-0 items-center hover:bg-[var(--color-surface-low)] transition-colors"
              >
                {/* Product */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 relative overflow-hidden border border-[var(--color-outline-variant)]">
                    {product.images[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full bg-[var(--color-surface-high)]" />
                    )}
                  </div>
                  <div>
                    <p className="type-body-md text-[var(--color-on-surface)]">{product.name}</p>
                    <p className="type-label-sm text-[var(--color-outline)]">SKU: {product.sku}</p>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {product.collections.slice(0, 2).map((c) => (
                    <span key={c} className="type-label-sm px-2 py-0.5 bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                      {COLLECTION_LABELS[c] ?? c}
                    </span>
                  ))}
                </div>

                {/* Price */}
                <span className="type-body-md text-[var(--color-on-surface)]">
                  {formatAUD(product.price)}
                </span>

                {/* Stock status */}
                <span className={`type-label-sm ${
                  isOutOfStock ? 'text-[var(--color-error)]' :
                  isLowStock   ? 'text-[#92400e]' :
                                 'text-[#065f46]'
                }`}>
                  {isOutOfStock
                    ? 'Out of Stock'
                    : isLowStock
                    ? `Low Stock (${product.stockCount})`
                    : `${product.stockCount} in stock`}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="type-label-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            )
          })
        )}
      </div>

      <p className="type-label-sm text-[var(--color-outline)] mt-4">
        Showing {allProducts.length} boutique set{allProducts.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
