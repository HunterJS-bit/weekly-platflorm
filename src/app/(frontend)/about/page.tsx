import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Weekly Platform</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to Weekly Platform, a community-driven space for sharing ideas, stories, and knowledge.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            We believe everyone has a story worth telling. Our platform provides a simple, elegant space for writers,
            thinkers, and creators to share their thoughts with the world.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>A clean, distraction-free reading experience</li>
            <li>Community engagement through comments and discussions</li>
            <li>Categories to help you discover content you love</li>
            <li>A platform for both established and emerging writers</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Join Our Community</h2>
          <p className="text-gray-700 mb-4">
            Whether you're here to read, write, or engage in discussions, we'd love to have you. Sign up today
            to start your journey with us.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/posts"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Browse Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
