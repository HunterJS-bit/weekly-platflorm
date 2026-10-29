import { MessageSquare } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Carousel } from './Carousel'
import { Hero } from './Hero'
import { CategoryPills, MetaRow } from './MetaRow'
import { SubscribeForm } from './Subscribe'
import { demoImages } from './demoPosts'
import type { MagazinePost } from './types'

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-6 text-[28px] font-semibold tracking-[-0.02em] text-[#111] dark:text-white">
    {children}
  </h2>
)

const FeaturedCard = ({ post, widthClass }: { post: MagazinePost; widthClass: string }) => (
  <article className={widthClass}>
    <Link href={post.href} className="block overflow-hidden">
      <img src={post.image} alt={post.imageAlt} className="h-[230px] w-full object-cover" />
    </Link>
    <h3 className="mt-5 max-w-[18ch] text-[26px] font-semibold leading-8 tracking-[-0.03em] text-[#111] dark:text-white">
      <Link href={post.href}>{post.title}</Link>
    </h3>
    <MetaRow post={post} className="mt-3" />
  </article>
)

export const MagazineHomePage = ({
  posts,
  tags,
}: {
  posts: MagazinePost[]
  tags: string[]
}) => {
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
        <SectionTitle>Featured posts</SectionTitle>
        <Carousel>
          {featured.map((post) => (
            <FeaturedCard key={post.id} post={post} widthClass="w-[320px] md:w-[370px]" />
          ))}
        </Carousel>
      </section>

      <section className="magazine-wrap pb-12">
        <SectionTitle>Trending posts</SectionTitle>
        <Carousel>
          {trending.map((post) => (
            <FeaturedCard key={post.id} post={post} widthClass="w-[420px] md:w-[580px]" />
          ))}
        </Carousel>
      </section>

      {highlight ? (
        <section className="magazine-wrap grid items-center gap-10 pb-16 lg:grid-cols-2">
          <Link href={highlight.href} className="block overflow-hidden">
            <img src={highlight.image} alt={highlight.imageAlt} className="h-[420px] w-full object-cover" />
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
          <SectionTitle>Popular posts</SectionTitle>
          <div className="flex flex-col gap-12">
            {popular.map((post) => (
              <article key={post.id} className="grid gap-6 sm:grid-cols-[220px_1fr]">
                <Link href={post.href} className="block overflow-hidden">
                  <img src={post.image} alt={post.imageAlt} className="h-[210px] w-full object-cover" />
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
              <img src={overlay.image} alt={overlay.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative flex h-full min-h-[280px] flex-col justify-end p-6 text-white">
                <h3 className="text-[26px] font-semibold leading-8">{overlay.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-white/80">
                  <span>by {overlay.author}</span>
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
            <SectionTitle>Recent posts</SectionTitle>
            <div className="flex flex-col gap-6">
              {recent.map((post) => (
                <article key={post.id} className="grid grid-cols-[84px_1fr] gap-4">
                  <Link href={post.href} className="block overflow-hidden">
                    <img src={post.image} alt={post.imageAlt} className="h-[84px] w-[84px] object-cover" />
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
            <SectionTitle>Popular tags</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-[#ececec] px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-[#666] hover:bg-[#e0e0e0] dark:bg-white/10 dark:text-white/70"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section id="newsletter" className="magazine-wrap py-8">
        <div className="grid overflow-hidden bg-white md:grid-cols-2 dark:bg-[#1a1a1a]">
          <div className="relative min-h-[320px]">
            <img
              src={demoImages[11]}
              alt="People working together at a table"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative flex h-full min-h-[320px] flex-col justify-end p-8 text-white md:p-10">
              <p className="max-w-[14ch] text-[36px] font-semibold leading-10 tracking-[-0.03em]">
                Let’s work together & build something great together.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex w-fit rounded-full bg-white px-5 py-2 text-sm text-[#111]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h2 className="text-[36px] font-semibold leading-tight tracking-[-0.03em]">
              Sign Up for Our Newsletters
            </h2>
            <p className="mt-3 text-[#8a8a8a]">We’ll send you nice letter once per week. No spam.</p>
            <SubscribeForm />
          </div>
        </div>
      </section>
    </div>
  )
}
