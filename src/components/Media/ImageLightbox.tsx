'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PORTAL_ID = 'image-lightbox-root'

type Props = {
  alt: string
  children: React.ReactNode
  details?: React.ReactNode
  height?: number | null
  src: string
  width?: number | null
}

/**
 * Opens an article image in a larger, rounded overlay. Escape and the close
 * button dismiss it; focus returns to the image that opened it.
 */
export const ImageLightbox: React.FC<Props> = ({ alt, children, details, height, src, width }) => {
  const t = useTranslations('media')
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const trigger = triggerRef.current
    const previousOverflow = document.body.style.overflow
    const background = Array.from(document.body.children).filter(
      (element) => element.id !== PORTAL_ID,
    )

    document.body.style.overflow = 'hidden'
    background.forEach((element) => element.setAttribute('inert', ''))

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 30)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(`#${PORTAL_ID} a[href], #${PORTAL_ID} button:not([disabled])`),
      ).filter((element) => element.offsetParent !== null)

      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      background.forEach((element) => element.removeAttribute('inert'))
      window.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimer)

      const target = trigger || previouslyFocused
      if (target?.isConnected) target.focus()
    }
  }, [open, close])

  if (!src) return <>{children}</>

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${t('open')}${alt ? `: ${alt}` : ''}`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-[0.8rem] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111] dark:focus-visible:outline-white"
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            id={PORTAL_ID}
            role="dialog"
            aria-modal="true"
            aria-label={t('open')}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) close()
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t('close')}
              className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
            >
              <X className="size-5" aria-hidden="true" />
            </button>

            <div className="flex max-h-full w-full max-w-[min(96vw,1400px)] flex-col items-center gap-4">
              <div className="w-full overflow-hidden rounded-[1.5rem] bg-[#111] shadow-2xl">
                <Image
                  src={src}
                  alt={alt}
                  width={width || 1600}
                  height={height || 900}
                  sizes="(max-width: 768px) 100vw, 1400px"
                  quality={90}
                  className="mx-auto h-auto max-h-[78vh] w-auto object-contain"
                />
              </div>
              {details && (
                <div className="max-w-3xl text-center text-sm leading-6 text-white/80 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0">
                  {details}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
