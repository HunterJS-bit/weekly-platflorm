'use client'

import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Link } from '@/i18n/navigation'

const STORAGE_KEY = 'infotaktik-terms-consent-v1'
const PORTAL_ID = 'terms-consent-root'

type Consent = 'accepted' | 'declined'

const readConsent = (): Consent | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    // Migrate the old flag while keeping decline distinct from acceptance.
    if (stored === '1' || stored === 'accepted') return 'accepted'
    if (stored === 'declined') return 'declined'
  } catch {
    // Storage can be unavailable in private mode.
  }

  return null
}

/**
 * Blocks the site until the reader accepts the terms. A decline is stored as a
 * distinct value and the dialog is shown again on the next visit.
 */
export const TermsConsent = () => {
  const t = useTranslations('termsConsent')
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const acceptRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // The dialog is rendered only after hydration so it can inspect storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    setVisible(readConsent() !== 'accepted')
  }, [])

  const close = useCallback((consent: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, consent)
    } catch {
      // Storage can be unavailable in private mode; keep the choice for this session.
    }

    setVisible(false)
  }, [])

  const accept = useCallback(() => close('accepted'), [close])
  const decline = useCallback(() => close('declined'), [close])

  useEffect(() => {
    if (!visible || !mounted) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const background = Array.from(document.body.children).filter(
      (element) => element.id !== PORTAL_ID,
    )

    document.body.style.overflow = 'hidden'
    background.forEach((element) => element.setAttribute('inert', ''))

    const focusTimer = window.setTimeout(() => acceptRef.current?.focus(), 50)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        decline()
        return
      }

      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
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

      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [visible, mounted, decline])

  if (!mounted || !visible) return null

  return createPortal(
    <div id={PORTAL_ID} className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-consent-title"
        aria-describedby="terms-consent-description"
        className="w-full max-w-lg border border-[#e4e4e4] bg-white p-6 shadow-2xl dark:border-white/15 dark:bg-[#161616] sm:p-8"
      >
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">{t('eyebrow')}</p>
        <h2
          id="terms-consent-title"
          className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.02em]"
        >
          {t('title')}
        </h2>
        <p
          id="terms-consent-description"
          className="mt-3 text-[15px] leading-7 text-[#737373] dark:text-white/60"
        >
          {t('description')}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          <Link
            href="/uslovi-koriscenja"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 border-b border-[#111] pb-0.5 hover:opacity-70 dark:border-white"
          >
            {t('termsLink')}
            <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            href="/politika-privatnosti"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 border-b border-[#111] pb-0.5 hover:opacity-70 dark:border-white"
          >
            {t('privacyLink')}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={decline}
            className="flex-1 inline-flex items-center justify-center border border-[#e4e4e4] px-6 py-3 text-[13px] font-medium tracking-[0.08em] uppercase text-[#111] transition-opacity hover:opacity-70 dark:border-white/15 dark:text-white"
          >
            {t('decline')}
          </button>
          <button
            ref={acceptRef}
            type="button"
            onClick={accept}
            className="flex-1 inline-flex items-center justify-center bg-[#111] px-6 py-3 text-[13px] font-medium tracking-[0.08em] uppercase text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-[#111]"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
