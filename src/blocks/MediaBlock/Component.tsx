import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import { ImageLightbox } from '../../components/Media/ImageLightbox'
import { MediaCredit } from '../../components/Media/MediaCredit'
import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    captionPosition,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  const mediaResource = media && typeof media === 'object' ? media : null
  const caption = mediaResource?.caption
  const credit = mediaResource?.credit
  const hasCaption = Boolean(caption || credit)
  const isOverlay = hasCaption && (captionPosition ?? 'below') === 'overlay'

  const renderCaption = (variant: 'inline' | 'overlay' | 'lightbox') => {
    const onDarkBackground = variant !== 'inline'

    return (
      <>
        {caption && (
          <RichText
            data={caption}
            enableGutter={false}
            enableProse={!onDarkBackground}
            className={cn(
              onDarkBackground &&
                'text-white/90 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_h1]:text-lg [&_h2]:text-lg [&_h3]:text-base [&_p]:my-1 [&_p]:text-sm [&_p]:leading-6',
            )}
          />
        )}
        <MediaCredit
          credit={credit}
          creditUrl={mediaResource?.creditUrl}
          className={cn(
            onDarkBackground
              ? 'block text-white/70'
              : 'mt-2 block text-center text-sm text-muted-foreground',
          )}
          linkClassName={onDarkBackground ? 'text-white' : undefined}
        />
      </>
    )
  }

  const image = (
    <Media
      imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
      resource={media}
      src={staticImage}
    />
  )

  const largeSize = mediaResource?.sizes?.xlarge

  const lightboxSrc = mediaResource?.mimeType?.startsWith('image/')
    ? getMediaUrl(largeSize?.url || mediaResource.url, mediaResource.updatedAt)
    : ''

  const imageWithLightbox = lightboxSrc ? (
    <ImageLightbox
      alt={mediaResource?.alt || ''}
      src={lightboxSrc}
      width={largeSize?.width || mediaResource?.width}
      height={largeSize?.height || mediaResource?.height}
      details={hasCaption ? renderCaption('lightbox') : undefined}
    >
      {image}
    </ImageLightbox>
  ) : (
    image
  )

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) &&
        (isOverlay ? (
          <div className="relative overflow-hidden rounded-[0.8rem]">
            {imageWithLightbox}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[0.8rem] bg-gradient-to-t from-black/90 via-black/65 to-transparent px-4 pb-4 pt-14 text-white sm:px-6 sm:pb-6">
              {renderCaption('overlay')}
            </div>
          </div>
        ) : (
          imageWithLightbox
        ))}

      {hasCaption && !isOverlay && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          {renderCaption('inline')}
        </div>
      )}
    </div>
  )
}
