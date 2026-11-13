import { MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { Link } from '@/i18n/navigation'

import { Carousel } from './Carousel'
import { Hero } from './Hero'
import { CategoryPills, MetaRow } from './MetaRow'
import { SubscribeForm } from './Subscribe'
import type { MagazineCategory, MagazinePost } from './types'

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-6 text-[28px] font-semibold tracking-[-0.02em] text-[#111] dark:text-white">
    {children}
  </h2>
)

const FeaturedCard = ({ post, widthClass }: { post: MagazinePost; widthClass: string }) => (
  <article className={widthClass}>
    <Link href={post.href} className="relative block h-[230px] overflow-hidden">
      <Image
        src={post.image}
        alt={post.imageAlt}
        fill
        sizes="(min-width: 768px) 370px, 320px"
        className="object-cover"
      />
    </Link>
    <h3 className="mt-5 max-w-[18ch] text-[26px] font-semibold leading-8 tracking-[-0.03em] text-[#111] dark:text-white">
      <Link href={post.href}>{post.title}</Link>
    </h3>
    <MetaRow post={post} className="mt-3" />
  </article>
)

export const MagazineHomePage = async ({
  posts,
  tags,
}: {
  posts: MagazinePost[]
  tags: MagazineCategory[]
}) => {
  const t = await getTranslations('home')
  const tPost = await getTranslations('post')
  const featured = posts.slice(1, 5)
  const trending = posts.slice(5, 8)
  const highlight = posts[8] || posts[0]
  const popular = posts.slice(9, 12)
  const recent = posts.slice(1, 4)
  const overlay = posts[1] || posts[0]

  return (
    <div className="bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <Hero posts={posts} />

      <div className="magazine-wrap">
        <hr className="border-[#ececec] dark:border-white/10" />
      </div>

      <section className="magazine-wrap py-12">
        <SectionTitle>{t('featuredPosts')}</SectionTitle>
        <Carousel>
          {featured.map((post) => (
            <FeaturedCard key={post.id} post={post} widthClass="w-[320px] md:w-[370px]" />
          ))}
        </Carousel>
      </section>

      <section className="magazine-wrap pb-12">
        <SectionTitle>{t('trendingPosts')}</SectionTitle>
        <Carousel>
          {trending.map((post) => (
            <FeaturedCard key={post.id} post={post} widthClass="w-[420px] md:w-[580px]" />
          ))}
        </Carousel>
      </section>
      {/* Writers CTA Section */}
      <section className="magazine-wrap py-16">
        <div className="rounded-2xl bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe] p-8 md:p-12 dark:from-[#1a1a2e] dark:to-[#16213e]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.03em] md:text-[40px]">
              {t('writersTitle')}
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-[#666] dark:text-white/70">
              {t('writersDescription')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#111] px-6 py-3 text-sm font-medium text-white transition hover:bg-black dark:bg-white dark:text-[#111] dark:hover:bg-white/90"
              >
                {t('writersCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {highlight ? (
        <section className="magazine-wrap grid items-center gap-10 pb-16 lg:grid-cols-2">
          <Link href={highlight.href} className="relative block h-[420px] overflow-hidden">
            <Image
              src={highlight.image}
              alt={highlight.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </Link>
          <div className="max-w-md lg:pl-8">
            <CategoryPills categories={highlight.categories} />
            <h2 className="mt-6 text-[36px] font-semibold leading-[1.15] tracking-[-0.03em]">
              <Link href={highlight.href}>{highlight.title}</Link>
            </h2>
            <MetaRow post={highlight} className="mt-5" />
          </div>
        </section>
      ) : null}

      <section className="magazine-wrap grid gap-12 pb-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <SectionTitle>{t('popularPosts')}</SectionTitle>
          <div className="flex flex-col gap-12">
            {popular.map((post) => (
              <article key={post.id} className="grid gap-6 sm:grid-cols-[220px_1fr]">
                <Link href={post.href} className="relative block h-[210px] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(min-width: 640px) 220px, 100vw"
                    className="object-cover"
                  />
                </Link>
                <div>
                  <h3 className="max-w-[14ch] text-[28px] font-semibold leading-8 tracking-[-0.03em]">
                    <Link href={post.href}>{post.title}</Link>
                  </h3>
                  <MetaRow post={post} className="mt-3" />
                  <p className="mt-5 max-w-[28ch] text-[16px] leading-7 text-[#8d8d8d]">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-10">
          {overlay ? (
            <Link href={overlay.href} className="relative block min-h-[280px] overflow-hidden">
              <Image
                src={overlay.image}
                alt={overlay.imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative flex h-full min-h-[280px] flex-col justify-end p-6 text-white">
                <h3 className="text-[26px] font-semibold leading-8">{overlay.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-white/80">
                  <span>
                    {tPost('by')} {overlay.author}
                  </span>
                  <span>•</span>
                  <span>{overlay.date}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="size-3.5" />
                    {overlay.comments}
                  </span>
                </div>
              </div>
            </Link>
          ) : null}

          <div>
            <SectionTitle>{t('recentPosts')}</SectionTitle>
            <div className="flex flex-col gap-6">
              {recent.map((post) => (
                <article key={post.id} className="grid grid-cols-[84px_1fr] gap-4">
                  <Link href={post.href} className="relative block h-[84px] w-[84px] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      sizes="84px"
                      className="object-cover"
                    />
                  </Link>
                  <div>
                    <h3 className="text-[18px] font-semibold leading-6">
                      <Link href={post.href}>{post.title}</Link>
                    </h3>
                    <MetaRow post={post} className="mt-2" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle>{t('popularTags')}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.slug || tag.title}
                  href={
                    tag.slug
                      ? `/category/${tag.slug}`
                      : `/search?q=${encodeURIComponent(tag.title)}`
                  }
                  className="rounded-full bg-[#ececec] px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-[#666] hover:bg-[#e0e0e0] dark:bg-white/10 dark:text-white/70"
                >
                  {tag.title}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section id="newsletter" className="magazine-wrap py-8">
        <div className="grid overflow-hidden bg-white md:grid-cols-2 dark:bg-[#1a1a1a]">
          <div className="relative min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex h-full min-h-[320px] flex-col justify-end p-8 text-white md:p-10">
              <p className="max-w-[14ch] text-[36px] font-semibold leading-10 tracking-[-0.03em]">
                {t('ctaTitle')}
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex w-fit rounded-full bg-white px-5 py-2 text-sm text-[#111]"
              >
                {t('getInTouch')}
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h2 className="text-[36px] font-semibold leading-tight tracking-[-0.03em]">
              {t('newsletterTitle')}
            </h2>
            <p className="mt-3 text-[#8a8a8a]">{t('newsletterDesc')}</p>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  )
}
