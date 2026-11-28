import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  enableGutter?: boolean
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, enableGutter = true, introContent } = props

  return (
    <div className={clsx({ 'lg:container': enableGutter }, className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} className="h-full" doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
