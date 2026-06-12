'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const close = useCallback(() => setLightboxSrc(null), [])

  useEffect(() => {
    if (!lightboxSrc) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxSrc, close])

  return (
    <>
      {/* Main image */}
      <div
        className="gallery-frame aspect-square relative overflow-hidden cursor-zoom-in"
        onClick={() => images.length > 0 && setLightboxSrc(images[0])}
      >
        {images.length > 0 ? (
          <Image
            src={images[0]}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface-high)]">
            <span className="type-label-sm text-[var(--color-outline)]">No image</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.slice(1, 4).map((src, i) => (
            <div
              key={i}
              className="gallery-frame aspect-square relative overflow-hidden cursor-zoom-in"
              onClick={() => setLightboxSrc(src)}
            >
              <Image
                src={src}
                alt={`${productName} view ${i + 2}`}
                fill
                className="object-cover"
                sizes="20vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>

          {/* Image container — stop propagation so clicking the image doesn't close */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt={productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  )
}
