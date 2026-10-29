import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 10,
    overrideAccess: false,
    sort: '-publishedAt',
    depth: 1,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Weekly Platform</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Discover, share, and discuss articles from our community
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              href="/posts"
              className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition"
            >
              Browse Articles
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.docs.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
            >
              {post.heroImage && typeof post.heroImage !== 'string' && (
                <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={post.heroImage.url || ''}
                    alt={post.heroImage.alt || post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.map((category) =>
                    typeof category === 'object' && category.title ? (
                      <span
                        key={category.id}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded"
                      >
                        {category.title}
                      </span>
                    ) : null,
                  )}
                </div>
              )}
              {post.publishedAt && (
                <p className="text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </Link>
          ))}
        </div>
        {posts.docs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
