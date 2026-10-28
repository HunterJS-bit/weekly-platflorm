'use client'

import { useState, useEffect } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Comment = {
  id: string
  content: string
  author: {
    id: string
    name: string
  }
  createdAt: string
  parent?: {
    id: string
  }
}

export default function CommentsSection({ postId }: { postId: string | number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)

  useEffect(() => {
    fetchComments()
    fetchUser()
  }, [postId])

  const fetchComments = async () => {
    try {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'comments',
        where: {
          post: {
            equals: postId,
          },
        },
        depth: 1,
        sort: '-createdAt',
      })
      setComments(result.docs as Comment[])
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/users/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Please log in to comment')
      return
    }
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const payload = await getPayload({ config: configPromise })
      await payload.create({
        collection: 'comments',
        data: {
          content: newComment,
          post: postId,
          author: user.id,
        },
      })
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Failed to create comment:', error)
      alert('Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 max-w-[48rem] mx-auto">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Please{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              log in
            </a>{' '}
            or{' '}
            <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              register
            </a>{' '}
            to leave a comment
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}
