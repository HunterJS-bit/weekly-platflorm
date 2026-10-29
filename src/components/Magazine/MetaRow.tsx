import { Clock, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { MagazinePost } from './types'

export const MetaRow = ({
  post,
  className = '',
  light = false,
}: {
  post: MagazinePost
  className?: string
  light?: boolean
}) => {
  const tone = light ? 'text-white/80' : 'text-[#8a8a8a]'
  const accent = light ? 'text-white' : 'text-[#111] dark:text-white'

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] ${tone} ${className}`}>
      <span>
        by{' '}
        <Link href={post.href} className={`${accent} hover:underline`}>
          {post.author}
        </Link>
      </span>
      <span>•</span>
      <span>{post.date}</span>
      <span>•</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" />
        {post.readTime}
      </span>
      <span>•</span>
      <span className="inline-flex items-center gap-1">
        <MessageSquare className="size-3.5" />
        {post.comments}
      </span>
    </div>
  )
}

export const CategoryPills = ({
  categories,
  className = '',
}: {
  categories: string[]
  className?: string
}) => {
  if (!categories.length) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/search?q=${encodeURIComponent(category)}`}
          className="rounded-full bg-[#ececec] px-3 py-1 text-[11px] font-medium tracking-[0.12em] uppercase text-[#666] hover:bg-[#e0e0e0] dark:bg-white/10 dark:text-white/70"
        >
          {category}
        </Link>
      ))}
    </div>
  )
}
