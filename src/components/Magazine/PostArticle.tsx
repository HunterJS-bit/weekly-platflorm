import type { Post } from '@/payload-types'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import PageClient from '@/app/[locale]/posts/[slug]/page.client'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import CommentsSection from '@/components/CommentsSection'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PostHero } from '@/heros/PostHero'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'
import { articleJsonLd, breadcrumbJsonLd } from '@/utilities/structuredData'
import React from 'react'
import RichText from '@/components/RichText'

export const PostArticle = ({
  post,
  locale,
  draft = false,
}: {
  post: Post
  locale: string
  draft?: boolean
}) => {
  const postPath = `/posts/${post.slug}`
  const url = postPath
  const primaryCategory = (post.categories ?? []).find(
    (category): category is Exclude<typeof category, number> => typeof category === 'object',
  )

  const breadcrumbs = [
    { name: 'Početna', path: '/' },
    { name: 'Članci', path: '/posts' },
    ...(primaryCategory
      ? [
          {
            name: localizeCategoryTitle(primaryCategory, locale),
            path: `/category/${primaryCategory.slug}`,
          },
        ]
      : []),
    { name: post.title, path: postPath },
  ]

  return (
    <article className="pt-16 pb-16">
      <JsonLd
        data={[
          articleJsonLd({ post, path: postPath, locale }),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} locale={locale} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText
            className="max-w-[48rem] mx-auto"
            data={post.content}
            enableGutter={false}
            proseSize="lg"
          />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
          <CommentsSection postId={String(post.id)} />
        </div>
      </div>
    </article>
  )
}
