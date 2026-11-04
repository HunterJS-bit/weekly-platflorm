import { buildMagazineFeed } from '@/components/Magazine/fromCms'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

type Args = {
  params: Promise<{
    slug?: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

const POSTS_PER_PAGE = 12

export default async function CategoryPage({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const { page: pageParam = '1' } = await searchParamsPromise
  const currentPage = parseInt(pageParam, 10) || 1
  const payload = await getPayload({ config: configPromise })

  // Fetch category by slug
  const category = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!category.docs[0]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-gray-600">Category not found</h1>
      </div>
    )
  }

  const categoryData = category.docs[0]

  // Fetch posts for this category with pagination
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: POSTS_PER_PAGE,
    overrideAccess: false,
    sort: '-publishedAt',
    depth: 2,
    page: currentPage,
    where: {
      categories: {
        in: [categoryData.id],
      },
    },
  })

  const feed = buildMagazineFeed(posts.docs)
  const totalPages = Math.ceil((posts.totalDocs || 0) / POSTS_PER_PAGE)

  return (
    <div className="bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white min-h-screen">
      {/* Category Header */}
      <div className="magazine-wrap py-16">
        <div className="max-w-4xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#999] mb-4">Category</p>
          <h1 className="text-[48px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#111] dark:text-white">
            {categoryData.title}
          </h1>
          {categoryData.description && (
            <p className="mt-4 text-lg text-[#8d8d8d] max-w-2xl">{categoryData.description}</p>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      {feed.length > 0 ? (
        <div className="magazine-wrap pb-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {feed.map((post) => (
              <article key={post.id} className="flex flex-col gap-4">
                <a href={post.href} className="block overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="h-[280px] w-full object-cover"
                  />
                </a>
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs tracking-[0.14em] uppercase text-[#666]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-[24px] font-semibold leading-7 tracking-[-0.03em] text-[#111] dark:text-white">
                    <a href={post.href}>{post.title}</a>
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#8d8d8d]">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <p className="mt-4 text-[16px] leading-7 text-[#8d8d8d] line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/category/${slug}?page=${currentPage - 1}`}
                  className="rounded-full border border-[#ececec] bg-white px-4 py-2 text-sm text-[#111] transition-colors hover:bg-[#f0f0f0] dark:border-white/10 dark:bg-[#111] dark:text-white dark:hover:bg-[#222]"
                >
                  Previous
                </Link>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/category/${slug}?page=${pageNum}`}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    pageNum === currentPage
                      ? 'bg-[#111] text-white dark:bg-white dark:text-[#111]'
                      : 'border border-[#ececec] bg-white text-[#111] hover:bg-[#f0f0f0] dark:border-white/10 dark:bg-[#111] dark:text-white dark:hover:bg-[#222]'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link
                  href={`/category/${slug}?page=${currentPage + 1}`}
                  className="rounded-full border border-[#ececec] bg-white px-4 py-2 text-sm text-[#111] transition-colors hover:bg-[#f0f0f0] dark:border-white/10 dark:bg-[#111] dark:text-white dark:hover:bg-[#222]"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="magazine-wrap pb-16">
          <p className="text-lg text-[#8d8d8d]">No posts found in this category yet.</p>
        </div>
      )}
    </div>
  )
}

export const dynamic = 'force-dynamic'
