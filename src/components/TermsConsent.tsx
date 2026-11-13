'use client'

import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'

import { Link } from '@/i18n/navigation'

const STORAGE_KEY = 'infotaktik-terms-accepted-v1'

/**
 * Blocks the site on first visit until the reader accepts the terms of use.
 * The acceptance is stored locally so the dialog only appears once.
 */
export const TermsConsent = () => {
  const t = useTranslations('termsConsent')
  const [visible, setVisible] = useState(false)
  const acceptRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let accepted = false

    try {
      accepted = window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      accepted = false
    }

    if (!accepted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => acceptRef.current?.focus(), 50)

    const handleKeyDown = (event: KeyboardEvent) => {
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
      window.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [visible])

  if (!visible) return null

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Storage can be unavailable in private mode; accept for this session.
    }

    setVisible(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45 p-4 sm:items-center">
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

        <button
          ref={acceptRef}
          type="button"
          onClick={accept}
          className="mt-7 inline-flex w-full items-center justify-center bg-[#111] px-6 py-3 text-[13px] font-medium tracking-[0.08em] uppercase text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-[#111]"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  )
}
