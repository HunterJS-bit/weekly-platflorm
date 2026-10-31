'use client'

import { ArrowRight, CheckCircle2 } from 'lucide-react'
import React, { useState } from 'react'

const inputClass =
  'w-full border-0 border-b border-[#dcdcdc] bg-transparent px-0 py-3 text-[15px] text-[#111] placeholder:text-[#b3b3b3] focus:border-[#111] focus:outline-none dark:border-white/20 dark:text-white dark:focus:border-white'

const labelClass = 'mb-1 block text-[11px] tracking-[0.16em] uppercase text-[#999]'

export const ContactForm = ({ formID }: { formID: number }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    const submissionData = ['full-name', 'email', 'phone', 'message']
      .map((field) => ({ field, value: String(data.get(field) ?? '') }))
      .filter(({ value }) => value.trim().length > 0)

    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: formID,
          submissionData,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.errors?.[0]?.message || 'Something went wrong. Please try again.')
      }

      form.reset()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 border border-[#e4e4e4] p-8 dark:border-white/15">
        <CheckCircle2 className="size-8" />
        <h3 className="text-2xl font-semibold tracking-[-0.02em]">Thanks for reaching out.</h3>
        <p className="text-[16px] leading-7 text-[#8d8d8d]">
          We’ve received your message and will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-sm font-medium underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="full-name" className={labelClass}>
            Full Name
          </label>
          <input
            required
            id="full-name"
            name="full-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone <span className="normal-case tracking-normal text-[#b3b3b3]">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          required
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us what’s on your mind…"
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
        {status === 'loading' ? 'Sending…' : 'Send Message'}
        <ArrowRight className="size-4" />
      </button>
    </form>
  )
}
