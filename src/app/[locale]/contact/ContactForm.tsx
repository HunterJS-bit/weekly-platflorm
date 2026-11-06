'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

const inputClass =
  'w-full border-0 border-b border-[#dcdcdc] bg-transparent px-0 py-3 text-[15px] text-[#111] placeholder:text-[#b3b3b3] focus:border-[#111] focus:outline-none dark:border-white/20 dark:text-white dark:focus:border-white'

const labelClass = 'mb-1 block text-[11px] tracking-[0.16em] uppercase text-[#999]'

export const ContactForm = () => {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    const honeypot = String(data.get('website') ?? '') // Honeypot field

    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          honeypot,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('genericError'))
      }

      form.reset()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : t('genericError'))
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 border border-[#e4e4e4] p-8 dark:border-white/15">
        <CheckCircle2 className="size-8" />
        <h3 className="text-2xl font-semibold tracking-[-0.02em]">{t('successTitle')}</h3>
        <p className="text-[16px] leading-7 text-[#8d8d8d]">{t('successDescription')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm font-medium underline underline-offset-4"
        >
          {t('sendAnother')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Honeypot field - hidden from users but visible to bots */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {t('fullName')}
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t('namePlaceholder')}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {t('email')}
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {t('message')}
        </label>
        <textarea
          required
          id="message"
          name="message"
          rows={5}
          placeholder={t('messagePlaceholder')}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-[#111] px-6 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-[#111] dark:hover:bg-white/90"
      >
        {status === 'loading' ? t('sending') : t('send')}
        <ArrowRight className="size-4" />
      </button>
    </form>
  )
}
