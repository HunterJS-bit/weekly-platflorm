'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { CategoryPills, MetaRow } from './MetaRow'
import type { MagazinePost } from './types'

export const Hero = ({ posts }: { posts: MagazinePost[] }) => {
  const slides = posts.slice(0, 4)
  const [index, setIndex] = useState(0)
  const post = slides[index] || slides[0]

  if (!post) return null

  const go = (direction: number) => {
    setIndex((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <section className="magazine-wrap grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
      <div>
        <CategoryPills categories={post.categories} className="mb-7" />
        <h1 className="max-w-[16ch] text-[42px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#111] md:text-[56px] dark:text-white">
          <Link href={post.href} className="hover:opacity-80">
            {post.title}
          </Link>
        </h1>
        <MetaRow post={post} className="mt-6" />
        <p className="mt-6 max-w-[42ch] text-[17px] leading-8 text-[#8d8d8d]">{post.excerpt}</p>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-[#e2e2e2] text-[#444] hover:bg-white dark:border-white/20 dark:text-white"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="flex size-11 items-center justify-center rounded-full border border-[#e2e2e2] text-[#444] hover:bg-white dark:border-white/20 dark:text-white"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
      <Link href={post.href} className="block overflow-hidden">
        <img src={post.image} alt={post.imageAlt} className="h-[420px] w-full object-cover md:h-[520px]" />
      </Link>
    </section>
  )
}
