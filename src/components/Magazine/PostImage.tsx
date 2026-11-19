'use client'

import { LoaderCircle } from 'lucide-react'
import Image, { type ImageProps } from 'next/image'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Post image with a small, subtle loading state. The skeleton sits in the
 * (already positioned) card wrapper and is removed as soon as the image is
 * ready — including when the browser serves it from cache.
 */
export const PostImage = ({ className, onLoad, onError, src, alt, ...props }: ImageProps) => {
  const t = useTranslations('common')
  const srcKey = typeof src === 'string' ? src : JSON.stringify(src)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const loaded = loadedSrc === srcKey

  return (
    <>
      {!loaded && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 animate-pulse bg-[#ececec] dark:bg-white/10"
          />
          <span aria-hidden="true" className="absolute inset-0 z-0 flex items-center justify-center">
            <LoaderCircle className="size-5 animate-spin text-[#b5b5b5] dark:text-white/50" />
          </span>
          <span role="status" className="sr-only">
            {t('loading')}
          </span>
        </>
      )}
      <Image
        {...props}
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        onLoad={(event) => {
          setLoadedSrc(srcKey)
          onLoad?.(event)
        }}
        onError={(event) => {
          setLoadedSrc(srcKey)
          onError?.(event)
        }}
      />
    </>
  )
}
