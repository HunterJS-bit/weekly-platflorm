'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useRef } from 'react'

export const Carousel = ({
  children,
  viewAllHref = '/posts',
}: {
  children: React.ReactNode
  viewAllHref?: string
}) => {
  const scroller = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: number) => {
    const node = scroller.current
    if (!node) return
    const card = node.querySelector<HTMLElement>('[data-carousel-item]')
    const amount = (card?.offsetWidth || node.clientWidth / 2) + 24
    node.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={scroller}
        className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
      >
        {React.Children.map(children, (child) => (
          <div data-carousel-item className="snap-start shrink-0">
            {child}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e8e8e8] dark:bg-white/10" />
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
          className="flex size-10 items-center justify-center rounded-full border border-[#e2e2e2] text-[#444] hover:bg-white dark:border-white/20 dark:text-white"
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCard(1)}
          className="flex size-10 items-center justify-center rounded-full border border-[#e2e2e2] text-[#444] hover:bg-white dark:border-white/20 dark:text-white"
        >
          <ArrowRight className="size-4" />
        </button>
        <Link
          href={viewAllHref}
          className="rounded-full border border-[#e2e2e2] px-4 py-2 text-sm text-[#333] hover:bg-white dark:border-white/20 dark:text-white"
        >
          View all
        </Link>
      </div>
    </div>
  )
}
