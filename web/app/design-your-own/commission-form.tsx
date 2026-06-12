'use client'

import { useState, useRef } from 'react'

// ─── Shape data with nail silhouette styles ────────────────────────────────────

const SHAPES = [
  { value: 'almond',   label: 'Almond',   style: { borderRadius: '60% 60% 40% 40% / 80% 80% 20% 20%' } },
  { value: 'coffin',   label: 'Coffin',   style: { borderRadius: '4px 4px 0 0', clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' } },
  { value: 'stiletto', label: 'Stiletto', style: { clipPath: 'polygon(50% 0%, 85% 100%, 15% 100%)' } },
  { value: 'oval',     label: 'Oval',     style: { borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%' } },
  { value: 'square',   label: 'Square',   style: { borderRadius: '2px' } },
  { value: 'squoval',  label: 'Squoval',  style: { borderRadius: '16px 16px 6px 6px' } },
]

const LENGTHS = [
  { value: 'short',      label: 'Short' },
  { value: 'medium',     label: 'Medium' },
  { value: 'long',       label: 'Long' },
  { value: 'extra_long', label: 'Extra Long' },
]

const WIDTHS = [
  { value: 'xs', label: 'XS' },
  { value: 's',  label: 'S' },
  { value: 'm',  label: 'M' },
  { value: 'l',  label: 'L' },
]

const MAX_FILES       = 3
const MAX_TOTAL_BYTES = 5 * 1024 * 1024

export default function CommissionForm({
  action,
  defaultName,
  defaultEmail,
}: {
  action:       (formData: FormData) => Promise<void>
  defaultName:  string
  defaultEmail: string
}) {
  const [selectedShape,  setSelectedShape]  = useState<string>('almond')
  const [selectedLength, setSelectedLength] = useState<string>('medium')
  const [selectedWidth,  setSelectedWidth]  = useState<string>('m')
  const [fileNames,      setFileNames]      = useState<string[]>([])
  const [fileError,      setFileError]      = useState<string | null>(null)
  const [submitting,     setSubmitting]     = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    const files = Array.from(e.target.files ?? [])
    if (files.length > MAX_FILES) {
      setFileError(`Please select at most ${MAX_FILES} images.`)
      e.target.value = ''
      setFileNames([])
      return
    }
    const total = files.reduce((s, f) => s + f.size, 0)
    if (total > MAX_TOTAL_BYTES) {
      setFileError('Images exceed 5 MB combined — please reduce file sizes.')
      e.target.value = ''
      setFileNames([])
      return
    }
    setFileNames(files.map(f => f.name))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    await action(formData)
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* ── Left column: form steps ───────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-16">

          {/* Hidden controlled inputs */}
          <input type="hidden" name="nailShape"  value={selectedShape} />
          <input type="hidden" name="nailLength" value={selectedLength} />
          <input type="hidden" name="nailWidth"  value={selectedWidth} />

          {/* 1. Shape */}
          <fieldset>
            <legend className="type-headline-md text-[var(--color-primary)] mb-8">
              1. Select your shape
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {SHAPES.map((s) => {
                const active = selectedShape === s.value
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSelectedShape(s.value)}
                    className={`gallery-frame flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 ${
                      active
                        ? 'border-[var(--color-primary)] bg-[var(--color-surface-low)]'
                        : 'hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {/* Nail shape illustration */}
                    <div className="w-full aspect-[4/5] flex items-center justify-center bg-[var(--color-surface-high)]">
                      <div
                        className={`w-12 h-16 transition-colors duration-300 ${
                          active
                            ? 'bg-[var(--color-primary)]'
                            : 'bg-[var(--color-outline)]'
                        }`}
                        style={s.style}
                      />
                    </div>
                    <span className={`type-label-md transition-colors ${
                      active ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'
                    }`}>
                      {s.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* 2. Length */}
          <fieldset>
            <legend className="type-headline-md text-[var(--color-primary)] mb-8">
              2. Choose your length
            </legend>
            <div className="flex flex-wrap gap-4">
              {LENGTHS.map((l) => {
                const active = selectedLength === l.value
                return (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setSelectedLength(l.value)}
                    className={`px-8 py-4 border type-label-md uppercase tracking-widest transition-all duration-200 ${
                      active
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)]'
                        : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {l.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* 3. Width */}
          <fieldset>
            <legend className="type-headline-md text-[var(--color-primary)] mb-6">
              3. Measure your width
            </legend>
            <p className="type-body-md text-[var(--color-on-surface-variant)] mb-6">
              Measure across the widest part of your nail bed. When in doubt, size up — nails can be filed down for a perfect fit.
            </p>
            {/* Measurement guide illustration */}
            <div className="gallery-frame mb-6">
              <img
                src="/nail-measurement-guide.png"
                alt="How to measure your nail width — 4 step guide"
                className="w-full h-auto"
              />
            </div>

            {/* Size reference table */}
            <div className="gallery-frame mb-6 overflow-x-auto">
              <p className="type-headline-md text-[var(--color-primary)] text-center mb-4">Size Chart</p>
              <table className="w-full text-center type-label-sm text-[var(--color-on-surface-variant)]">
                <thead>
                  <tr>
                    <th className="pb-1 px-3 text-right" colSpan={6}>
                      <span className="type-label-sm text-[var(--color-outline)]">「mm」</span>
                    </th>
                  </tr>
                  <tr className="border-b border-[var(--color-outline-variant)]">
                    <th className="py-2 px-3 type-label-sm text-[var(--color-on-surface-variant)] text-left"></th>
                    <th className="py-2 px-3">Thumb</th>
                    <th className="py-2 px-3">Index</th>
                    <th className="py-2 px-3">Middle</th>
                    <th className="py-2 px-3">Ring</th>
                    <th className="py-2 px-3">Pinky</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', widths: [14, 10, 11, 10, 7] },
                    { size: 'S',  widths: [15, 11, 12, 11, 8] },
                    { size: 'M',  widths: [16, 12, 13, 12, 9] },
                    { size: 'L',  widths: [17, 13, 14, 13, 10] },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-[var(--color-outline-variant)] last:border-0">
                      <td className="py-2 px-3 type-label-md text-[var(--color-primary)] text-left">{row.size}</td>
                      {row.widths.map((w, i) => (
                        <td key={i} className="py-2 px-3">{w}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-4">
              {WIDTHS.map((w) => {
                const active = selectedWidth === w.value
                return (
                  <button
                    key={w.value}
                    type="button"
                    onClick={() => setSelectedWidth(w.value)}
                    className={`px-8 py-4 border type-label-md uppercase tracking-widest transition-all duration-200 ${
                      active
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)]'
                        : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {w.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* 4. Reference images */}
          <div>
            <h2 className="type-headline-md text-[var(--color-primary)] mb-8">
              4. Upload reference images
            </h2>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full gallery-frame border-2 border-dashed border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] transition-all duration-300 text-center py-16 group"
            >
              {/* Upload icon */}
              <svg
                className="mx-auto mb-4 w-10 h-10 text-[var(--color-outline)] group-hover:scale-110 transition-transform"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="type-body-md text-[var(--color-on-surface-variant)] max-w-[240px] mx-auto mb-4">
                Add a screenshot or photo to help our artists understand your style.
              </p>
              <span className="type-label-md text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-0.5">
                Browse Files
              </span>
              {fileNames.length > 0 && (
                <p className="type-label-sm text-[var(--color-secondary)] mt-4">
                  {fileNames.join(', ')}
                </p>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              name="referenceImages"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileError && (
              <p className="type-label-sm text-[var(--color-error)] mt-2">{fileError}</p>
            )}
            <p className="type-label-sm text-[var(--color-outline)] mt-2">
              Optional · JPG, PNG or WebP · up to {MAX_FILES} images · max 5 MB combined
            </p>
          </div>

          {/* 5. Description */}
          <div>
            <h2 className="type-headline-md text-[var(--color-primary)] mb-8">
              5. Describe your vision
            </h2>
            <div>
              <label className="type-label-sm text-[var(--color-on-surface-variant)] uppercase tracking-widest block mb-2">
                Custom Notes for Artist
              </label>
              <textarea
                name="description"
                rows={5}
                placeholder="Describe colours, patterns, textures, or specific moods you'd like us to capture…"
                className="w-full bg-transparent border-b border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:outline-none px-0 py-4 type-body-md text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] placeholder:italic transition-colors resize-none"
              />
            </div>
          </div>

          {/* Contact details */}
          <div>
            <h2 className="type-headline-md text-[var(--color-primary)] mb-8">
              6. Your details
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="type-label-sm text-[var(--color-on-surface-variant)] uppercase tracking-widest block">
                    Full Name <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={defaultName}
                    required
                    className="w-full border-b border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:outline-none bg-transparent px-0 py-3 type-body-md text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="type-label-sm text-[var(--color-on-surface-variant)] uppercase tracking-widest block">
                    Email <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={defaultEmail}
                    required
                    className="w-full border-b border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:outline-none bg-transparent px-0 py-3 type-body-md text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="type-label-sm text-[var(--color-on-surface-variant)] uppercase tracking-widest block">
                  Phone <span className="type-label-sm text-[var(--color-outline)] normal-case">Optional</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+61 4XX XXX XXX"
                  className="w-full border-b border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:outline-none bg-transparent px-0 py-3 type-body-md text-[var(--color-on-surface)] placeholder:text-[var(--color-outline)] transition-colors"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Right column: sticky summary ──────────────────────────────── */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="p-8 border border-[var(--color-secondary-container)] bg-white">
            <h3 className="type-headline-md text-[var(--color-primary)] mb-6">
              Commission Summary
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-[var(--color-surface-high)] pb-4">
                <span className="type-label-md text-[var(--color-on-surface-variant)]">BASE PRICE</span>
                <span className="type-body-md text-[var(--color-primary)]">$85.00</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-surface-high)] pb-4">
                <span className="type-label-md text-[var(--color-on-surface-variant)]">DESIGN COMPLEXITY</span>
                <span className="type-body-md text-[var(--color-primary)]">TBD after review</span>
              </div>
              <div className="flex justify-between">
                <span className="type-label-md text-[var(--color-primary)]">ESTIMATED STARTING TOTAL</span>
                <span className="type-headline-md text-[var(--color-primary)]">$85.00</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-5 px-8 type-label-md uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Processing Your Vision…' : 'Submit Custom Request'}
            </button>

            <p className="text-center type-label-sm text-[var(--color-outline)] mt-6 italic">
              Our artists will contact you within 24 hours to confirm your design and provide a final quote. No payment until your design is reviewed and agreed.
            </p>
          </div>
        </div>

      </div>
    </form>
  )
}
