'use client'

import React, { useState } from 'react'

export const SubscribeForm = () => {
  const [submitted, setSubmitted] = useState(false)

  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <div className="flex overflow-hidden rounded-full border border-[#e4e4e4] bg-white p-1 dark:border-white/15 dark:bg-black">
        <input
          required
          type="email"
          name="email"
          placeholder="Enter Your Email"
          className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[#111] px-6 py-3 text-[11px] font-semibold tracking-[0.16em] text-white uppercase"
        >
          Subscribe
        </button>
      </div>
      <label className="mt-4 flex items-start gap-2 text-[12px] leading-5 text-[#8a8a8a]">
        <input type="checkbox" required className="mt-1" />
        By checking this box, you confirm that you have read and are agreeing to our terms of use
        regarding the storage of the data submitted through this form.
      </label>
      {submitted ? <p className="mt-3 text-sm text-[#111] dark:text-white">Thanks — you’re on the list.</p> : null}
    </form>
  )
}
