'use client'

import Image, { type ImageProps } from 'next/image'
import React, { useState } from 'react'

import { ImageLoadingOverlay } from '@/components/Media/LoadingOverlay'
import { cn } from '@/utilities/ui'

/**
 * Post image with a small, subtle loading state. The skeleton sits in the
 * (already positioned) card wrapper and is removed as soon as the image is
 * ready — including when the browser serves it from cache.
 */
export const PostImage = ({ className, onLoad, onError, src, alt, ...props }: ImageProps) => {
  const srcKey = typeof src === 'string' ? src : JSON.stringify(src)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const loaded = loadedSrc === srcKey

  return (
    <>
      {!loaded && <ImageLoadingOverlay />}
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
