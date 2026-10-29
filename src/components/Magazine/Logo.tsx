import Link from 'next/link'
import React from 'react'

export const MagazineLogo = ({
  className = '',
  tagline = true,
}: {
  className?: string
  tagline?: boolean
}) => {
  return (
    <Link href="/" className={`flex items-center gap-4 min-w-0 ${className}`}>
      <span className="font-serif text-[42px] leading-none tracking-tight text-[#111] dark:text-white lowercase">
        weekly.
      </span>
      {tagline ? (
        <>
          <span className="hidden sm:block w-px h-10 bg-[#e4e4e4] dark:bg-white/20" />
          <span className="hidden sm:block text-[10px] leading-tight tracking-[0.18em] uppercase text-[#9a9a9a]">
            Minimal blog
            <br />
            magazine
          </span>
        </>
      ) : null}
    </Link>
  )
}
