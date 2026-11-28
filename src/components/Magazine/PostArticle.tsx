import type { Post } from '@/payload-types'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import PageClient from '@/app/[locale]/posts/[slug]/page.client'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import CommentsSection from '@/components/CommentsSection'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PostHero } from '@/heros/PostHero'
import { getCachedRelatedPosts } from '@/utilities/cachedQueries'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'
import { articleJsonLd, breadcrumbJsonLd } from '@/utilities/structuredData'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import RichText from '@/components/RichText'

const relationIDs = (values: unknown): number[] => {
  if (!Array.isArray(values)) return []

  return values
    .map((value) => {
      if (typeof value === 'number') return value
      if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
        return value.id
      }
      return null
    })
    .filter((id): id is number => id !== null)
}

export const PostArticle = async ({
  post,
  locale,
  draft = false,
}: {
  post: Post
  locale: string
  draft?: boolean
}) => {
  const t = await getTranslations('post')
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

  const linkedPosts = (post.relatedPosts ?? []).filter(
    (related): related is Post =>
      typeof related === 'object' && related !== null && related.id !== post.id,
  )

  // If the editor did not link any posts manually, fall back to posts from the
  // same categories/tags (or the latest published posts) so the section is useful.
  const relatedPosts = linkedPosts.length
    ? linkedPosts
    : await getCachedRelatedPosts({
        categoryIDs: relationIDs(post.categories),
        postID: post.id,
        tagIDs: relationIDs(post.tags),
      })

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

          <CommentsSection postId={String(post.id)} />

          {relatedPosts.length > 0 && (
            <section className="mt-14 border-t border-border pt-10">
              <h2 className="mb-6 text-2xl font-semibold">{t('relatedPosts')}</h2>
              <RelatedPosts docs={relatedPosts} enableGutter={false} />
            </section>
          )}
        </div>
      </div>
    </article>
  )
}
