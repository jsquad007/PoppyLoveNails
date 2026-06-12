'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/db/queries'

const MAX_FILES      = 4
const MAX_TOTAL_BYTES = 5 * 1024 * 1024 // 5 MB

const COLLECTIONS = [
  { value: 'floral',           label: 'Floral' },
  { value: 'bows_ribbons',     label: 'Bows & Ribbons' },
  { value: 'glam_glitter',     label: 'Glam & Glitter' },
  { value: 'soft_dreamy',      label: 'Soft & Dreamy' },
  { value: 'bold_jewel_tones', label: 'Bold & Jewel Tones' },
  { value: 'bridal',           label: 'Bridal & Special Occasion' },
]

const SHAPES = [
  { value: 'almond',   label: 'Almond' },
  { value: 'coffin',   label: 'Coffin' },
  { value: 'stiletto', label: 'Stiletto' },
  { value: 'oval',     label: 'Oval' },
  { value: 'square',   label: 'Square' },
  { value: 'squoval',  label: 'Squoval' },
]

const WIDTHS = [
  { value: 'xs', label: 'XS' },
  { value: 's',  label: 'S' },
  { value: 'm',  label: 'M' },
  { value: 'l',  label: 'L' },
]

const LENGTHS = [
  { value: 'extra_short', label: 'Extra Short' },
  { value: 'short',       label: 'Short' },
  { value: 'medium',      label: 'Medium' },
  { value: 'long',        label: 'Long' },
]

const SHAPE_LENGTHS: Record<string, string[]> = {
  almond:   ['extra_short', 'short', 'medium'],
  coffin:   ['extra_short', 'short', 'medium', 'long'],
  oval:     ['extra_short', 'short', 'medium'],
  stiletto: ['short', 'medium', 'long'],
  square:   ['extra_short', 'short', 'medium'],
  squoval:  ['extra_short'],
}

function availableLengthsFor(shapes: string[]): string[] {
  if (shapes.length === 0) return LENGTHS.map((l) => l.value)
  const set = new Set(shapes.flatMap((s) => SHAPE_LENGTHS[s] ?? []))
  return LENGTHS.map((l) => l.value).filter((l) => set.has(l))
}

export default function ProductForm({
  product,
  action,
}: {
  product?: Product
  action:   (formData: FormData) => Promise<void>
}) {
  const formRef     = useRef<HTMLFormElement>(null)
  const isEdit      = !!product
  const [imageError,      setImageError]      = useState<string | null>(null)
  const [selectedShapes,  setSelectedShapes]  = useState<string[]>(product?.shapes  ?? [])
  const [selectedLengths, setSelectedLengths] = useState<string[]>(product?.lengths ?? [])

  function handleShapeChange(value: string, checked: boolean) {
    const next = checked ? [...selectedShapes, value] : selectedShapes.filter((s) => s !== value)
    setSelectedShapes(next)
    const available = availableLengthsFor(next)
    setSelectedLengths((prev) => prev.filter((l) => available.includes(l)))
  }

  function handleLengthChange(value: string, checked: boolean) {
    setSelectedLengths(checked ? [...selectedLengths, value] : selectedLengths.filter((l) => l !== value))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError(null)
    const files = Array.from(e.target.files ?? [])
    if (files.length > MAX_FILES) {
      setImageError(`Too many images — please select at most ${MAX_FILES}.`)
      e.target.value = ''
      return
    }
    const totalBytes = files.reduce((sum, f) => sum + f.size, 0)
    if (totalBytes > MAX_TOTAL_BYTES) {
      const totalMB = (totalBytes / 1024 / 1024).toFixed(1)
      setImageError(`Total file size is ${totalMB} MB — please keep the combined size under 5 MB.`)
      e.target.value = ''
    }
  }

  return (
    <form ref={formRef} action={action} className="space-y-10">

      {/* Product Name */}
      <Field label="Product Name" required>
        <input
          type="text"
          name="name"
          defaultValue={product?.name}
          placeholder="e.g., Ethereal Whisper Press-Ons"
          required
          className={inputClass}
        />
      </Field>

      {/* SKU */}
      <Field label="SKU" hint="Format: PL-CAT-001" required>
        <input
          type="text"
          name="sku"
          defaultValue={product?.sku}
          placeholder="PL-FLO-001"
          required
          className={inputClass}
        />
      </Field>

      {/* Description */}
      <Field label="Artistic Description">
        <textarea
          name="description"
          defaultValue={product?.description ?? ''}
          placeholder="Describe the inspiration, texture, and visual story of this set…"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </Field>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-6">
        <Field label="Listing Price (AUD)" required>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 type-body-md text-[var(--color-outline)]">$</span>
            <input
              type="number"
              name="price"
              defaultValue={product ? (product.price / 100).toFixed(2) : ''}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className={`${inputClass} pl-7`}
            />
          </div>
        </Field>

        <Field label="Stock Count" required>
          <input
            type="number"
            name="stock"
            defaultValue={product?.stockCount ?? 0}
            min="0"
            required
            className={inputClass}
          />
        </Field>
      </div>

      {/* Collections */}
      <Field label="Collections" hint="Select all that apply">
        <CheckboxGroup
          name="collections"
          options={COLLECTIONS}
          selected={product?.collections ?? []}
        />
      </Field>

      {/* Shapes */}
      <Field label="Available Shapes">
        <CheckboxGroup
          name="shapes"
          options={SHAPES}
          selected={selectedShapes}
          onChange={handleShapeChange}
        />
      </Field>

      {/* Widths */}
      <Field label="Available Widths">
        <CheckboxGroup
          name="widths"
          options={WIDTHS}
          selected={product?.widths ?? []}
        />
      </Field>

      {/* Lengths */}
      <Field label="Available Lengths" hint="Only lengths valid for the selected shapes are enabled">
        <CheckboxGroup
          name="lengths"
          options={LENGTHS}
          selected={selectedLengths}
          onChange={handleLengthChange}
          disabled={LENGTHS.map((l) => l.value).filter((l) => !availableLengthsFor(selectedShapes).includes(l))}
        />
      </Field>

      {/* Existing images */}
      {product && product.images.length > 0 && (
        <Field label="Current Images" hint="Existing images are kept unless you remove them">
          <div className="flex flex-wrap gap-3">
            {product.images.map((url, i) => (
              <div key={i} className="relative w-20 h-20 border border-[var(--color-outline-variant)]">
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="80px" />
                <input type="hidden" name="existingImages" value={url} />
              </div>
            ))}
          </div>
        </Field>
      )}

      {/* Image upload */}
      <Field label="Upload New Images" hint="JPG, PNG or WebP · max 4 images · max 5 MB combined">
        <input
          type="file"
          name="images"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="type-body-md text-[var(--color-on-surface-variant)] file:mr-4 file:type-label-sm file:border file:border-[var(--color-outline-variant)] file:px-4 file:py-2 file:bg-[var(--color-surface)] file:text-[var(--color-primary)] file:cursor-pointer hover:file:border-[var(--color-primary)] transition-colors"
        />
        {imageError && (
          <p className="type-label-sm text-[var(--color-error)] mt-2">{imageError}</p>
        )}
      </Field>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-outline-variant)]">
        <button
          type="submit"
          className="type-label-md px-8 py-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 transition-opacity"
        >
          {isEdit ? 'Save Product' : 'Add Product'}
        </button>
        <a
          href="/admin/products"
          className="type-label-md px-8 py-3 border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)] transition-colors"
        >
          Discard
        </a>
      </div>

    </form>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass =
  'w-full border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-3 type-body-md text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] focus:outline-none focus:border-[var(--color-primary)] transition-colors'

function Field({
  label,
  hint,
  required,
  children,
}: {
  label:    string
  hint?:    string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="block type-label-sm text-[var(--color-primary)]">
        {label.toUpperCase()}{required && <span className="text-[var(--color-error)] ml-1">*</span>}
      </label>
      {hint && <p className="type-label-sm text-[var(--color-outline)]">{hint}</p>}
      {children}
    </div>
  )
}

function CheckboxGroup({
  name,
  options,
  selected,
  onChange,
  disabled = [],
}: {
  name:      string
  options:   { value: string; label: string }[]
  selected:  string[]
  onChange?: (value: string, checked: boolean) => void
  disabled?: string[]
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isDisabled = disabled.includes(opt.value)
        const isChecked  = selected.includes(opt.value)
        return (
          <label
            key={opt.value}
            className={`flex items-center gap-2 px-4 py-2 border transition-colors ${
              isDisabled
                ? 'border-[var(--color-outline-variant)] text-[var(--color-outline)] opacity-35 cursor-not-allowed'
                : onChange
                ? isChecked
                  ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)] cursor-pointer'
                  : 'border-[var(--color-outline-variant)] cursor-pointer hover:border-[var(--color-primary)]'
                : 'border-[var(--color-outline-variant)] cursor-pointer hover:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:text-[var(--color-on-primary)]'
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              disabled={isDisabled}
              {...(onChange
                ? { checked: isChecked, onChange: (e) => onChange(opt.value, e.target.checked) }
                : { defaultChecked: isChecked }
              )}
              className="sr-only"
            />
            <span className="type-label-sm">{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}
