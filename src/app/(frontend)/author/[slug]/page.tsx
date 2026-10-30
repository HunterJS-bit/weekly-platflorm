import type { Metadata } from 'next'
import { ArrowUpRight, Facebook, Globe, Instagram, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { mapCmsPost } from '@/components/Magazine/fromCms'
import { CategoryPills, MetaRow } from '@/components/Magazine/MetaRow'

const queryAuthor = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const isID = /^\d+$/.test(slug)

  const result = await payload.find({
    collection: 'users',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: isID ? { id: { equals: Number(slug) } } : { slug: { equals: slug } },
  })

  return result.docs[0] || null
})

const queryPosts = cache(async (authorID: number) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    draft: false,
    limit: 100,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      authors: {
        in: [authorID],
      },
    },
  })

  return result.docs
})

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const author = await queryAuthor(slug)

  if (!author) {
    return {
      title: 'Author not found',
    }
  }

  const name = author.name || 'Author'

  return {
    title: `${name} — Weekly`,
    description: author.bio || undefined,
  }
}

export default async function AuthorPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const author = await queryAuthor(slug)

  if (!author) notFound()

  const posts = await queryPosts(author.id)
  const feed = posts.map((post, index) => mapCmsPost(post, index))

  const name = author.name || 'Author'
  const avatar = author.avatar && typeof author.avatar === 'object' ? author.avatar : null
  const avatarURL = avatar?.sizes?.square?.url || avatar?.url
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const socials = [
    { href: author.socials?.website, label: 'Website', Icon: Globe },
    { href: author.socials?.facebook, label: 'Facebook', Icon: Facebook },
    { href: author.socials?.x, label: 'X', Icon: Twitter },
    { href: author.socials?.instagram, label: 'Instagram', Icon: Instagram },
    { href: author.socials?.linkedin, label: 'LinkedIn', Icon: Linkedin },
  ].filter((social): social is { href: string; label: string; Icon: typeof Globe } =>
    Boolean(social.href),
  )

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <div className="magazine-wrap pt-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#999]"
        >
          <Link href="/" className="hover:text-[#111] dark:hover:text-white">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111] dark:text-white">{name}</span>
        </nav>
      </div>

      {/* Author header */}
      <header className="magazine-wrap py-12 md:py-16">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
          {avatarURL ? (
            <img
              src={avatarURL}
              alt={avatar?.alt || name}
              className="size-[160px] shrink-0 rounded-full object-cover md:size-[184px]"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex size-[160px] shrink-0 items-center justify-center rounded-full bg-[#ececec] text-[42px] font-semibold tracking-[-0.03em] text-[#8d8d8d] md:size-[184px] dark:bg-white/10 dark:text-white/60"
            >
              {initials}
            </div>
          )}

          <div className="max-w-3xl">
            <p className="mb-3 text-xs tracking-[0.18em] uppercase text-[#999]">Author</p>
            <h1 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[52px]">
              {name}
            </h1>

            {author.bio ? (
              <p className="mt-4 max-w-2xl text-[17px] leading-8 text-[#8d8d8d]">{author.bio}</p>
            ) : null}

            {socials.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex size-10 items-center justify-center rounded-full border border-[#e2e2e2] text-[#444] transition-colors hover:border-[#111] hover:text-[#111] dark:border-white/20 dark:text-white/70 dark:hover:border-white dark:hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="magazine-wrap">
        <hr className="border-[#ececec] dark:border-white/10" />
      </div>

      {/* Author posts */}
      <section className="magazine-wrap py-12 md:py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em]">Stories by {name}</h2>
          <span className="text-sm text-[#8d8d8d]">
            {feed.length} {feed.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {feed.length > 0 ? (
          <div className="flex flex-col divide-y divide-[#ececec] dark:divide-white/10">
            {feed.map((post) => (
              <article
                key={post.id}
                className="grid gap-6 py-10 first:pt-0 md:grid-cols-[minmax(0,1fr)_320px] md:items-start md:gap-12"
              >
                <div>
                  <CategoryPills categories={post.categories} className="mb-4" />
                  <h3 className="max-w-[22ch] text-[28px] font-semibold leading-9 tracking-[-0.03em] md:text-[32px] md:leading-10">
                    <Link href={post.href} className="hover:opacity-70">
                      {post.title}
                    </Link>
                  </h3>
                  <MetaRow post={post} className="mt-3" />
                  <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#8d8d8d] line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    href={post.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium tracking-[0.02em] hover:underline"
                  >
                    Read more
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>

                <Link
                  href={post.href}
                  className="order-first block overflow-hidden md:order-last"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-[1.03] md:h-[210px]"
                  />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-lg text-[#8d8d8d]">
            {name} hasn’t published any stories yet. Check back soon.
          </p>
        )}
      </section>
    </div>
  )
}

export const dynamic = 'force-dynamic'
