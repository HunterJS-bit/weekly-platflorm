import type { Form, Media, Post, User } from '@/payload-types'
import { readFile } from 'fs/promises'
import path from 'path'
import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

/**
 * Idempotent production seed.
 *
 * Unlike the template's `/next/seed` endpoint this never deletes existing data.
 * It only creates documents that are missing and refreshes the fields the demo
 * content depends on (author links, categories, avatars).
 *
 * Run it with:
 *   pnpm seed:prod
 * or as a signed-in admin:
 *   POST /next/seed-production
 */
export type SeedProductionResult = {
  authors: number
  categories: number
  media: number
  posts: number
}

type MediaKey = 'post1' | 'post2' | 'post3' | 'hero'

const mediaFiles: Record<
  MediaKey,
  { file: string; data: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> }
> = {
  post1: { file: 'image-post1.webp', data: image1 },
  post2: { file: 'image-post2.webp', data: image2 },
  post3: { file: 'image-post3.webp', data: image1 },
  hero: { file: 'image-hero1.webp', data: imageHero1 },
}

const categories: RequiredDataFromCollectionSlug<'categories'>[] = [
  {
    title: 'Technology',
    slug: 'technology',
    description: 'The tools, platforms and ideas shaping how we live and work.',
  },
  {
    title: 'News',
    slug: 'news',
    description: 'The stories and events worth paying attention to this week.',
  },
  {
    title: 'Finance',
    slug: 'finance',
    description: 'Practical money thinking, markets and the economy explained.',
  },
  {
    title: 'Design',
    slug: 'design',
    description: 'Craft, typography and the details that make good products feel right.',
  },
  {
    title: 'Software',
    slug: 'software',
    description: 'Engineering notes, developer workflows and things we are building.',
  },
  {
    title: 'Engineering',
    slug: 'engineering',
    description: 'Deep dives into systems, architecture and technical decisions.',
  },
]

type SeedAuthor = {
  email: string
  name: string
  slug: string
  bio: string
  socials: NonNullable<User['socials']>
}

const authors: SeedAuthor[] = [
  {
    email: 'maya.chen@weekly.example',
    name: 'Maya Chen',
    slug: 'maya-chen',
    bio: 'Maya writes about technology, product design and the people building the next generation of tools. She has spent a decade shipping software and telling the stories behind it.',
    socials: {
      website: 'https://example.com',
      x: 'https://x.com/example',
      linkedin: 'https://linkedin.com/in/example',
    },
  },
  {
    email: 'daniel.rivera@weekly.example',
    name: 'Daniel Rivera',
    slug: 'daniel-rivera',
    bio: 'Daniel is a writer and editor covering business, finance and global affairs. He is interested in the small decisions that add up to big outcomes.',
    socials: {
      website: 'https://example.com',
      x: 'https://x.com/example',
      instagram: 'https://instagram.com/example',
    },
  },
]

const readLocalImage = async (filename: string) => {
  const filePath = path.resolve(process.cwd(), 'public/media', filename)
  const data = await readFile(filePath)

  return {
    data,
    mimetype: filename.endsWith('.png') ? 'image/png' : 'image/webp',
    name: filename,
    size: data.byteLength,
  }
}

const getOrCreateMedia = async (payload: Payload, key: MediaKey): Promise<Media> => {
  const entry = mediaFiles[key]
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    overrideAccess: true,
    where: { filename: { equals: entry.file } },
  })

  if (existing.docs[0]) {
    return existing.docs[0]
  }

  return (await payload.create({
    collection: 'media',
    data: entry.data,
    file: await readLocalImage(entry.file),
    overrideAccess: true,
  })) as Media
}

const upsertAuthor = async (
  payload: Payload,
  author: SeedAuthor,
  avatarID: number,
): Promise<User> => {
  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: { email: { equals: author.email } },
  })

  const data = {
    name: author.name,
    slug: author.slug,
    bio: author.bio,
    avatar: avatarID,
    socials: author.socials,
  }

  if (existing.docs[0]) {
    return (await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })) as User
  }

  return (await payload.create({
    collection: 'users',
    data: {
      ...data,
      email: author.email,
      password: process.env.SEED_AUTHOR_PASSWORD || crypto.randomUUID(),
    },
    overrideAccess: true,
  })) as User
}

const upsertCategory = async (
  payload: Payload,
  category: RequiredDataFromCollectionSlug<'categories'>,
) => {
  const existing = await payload.find({
    collection: 'categories',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: category.slug } },
  })

  if (existing.docs[0]) {
    return payload.update({
      collection: 'categories',
      id: existing.docs[0].id,
      data: { description: category.description },
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'categories',
    data: category,
    overrideAccess: true,
  })
}

const upsertPost = async ({
  payload,
  slug,
  data,
  authorID,
  categoryID,
  publishedAt,
}: {
  payload: Payload
  slug: string
  data: RequiredDataFromCollectionSlug<'posts'>
  authorID: number
  categoryID: number
  publishedAt: string
}): Promise<Post> => {
  const existing = await payload.find({
    collection: 'posts',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })

  if (existing.docs[0]) {
    return (await payload.update({
      collection: 'posts',
      id: existing.docs[0].id,
      data: {
        _status: 'published',
        authors: [authorID],
        categories: [categoryID],
        publishedAt,
      },
      context: { disableRevalidate: true },
      overrideAccess: true,
    })) as Post
  }

  return (await payload.create({
    collection: 'posts',
    data: {
      ...data,
      _status: 'published',
      authors: [authorID],
      categories: [categoryID],
      publishedAt,
      slug,
    },
    context: { disableRevalidate: true },
    overrideAccess: true,
  })) as Post
}

export const seedProduction = async ({
  payload,
}: {
  payload: Payload
}): Promise<SeedProductionResult> => {
  payload.logger.info('Seeding production demo content (idempotent)...')

  const media = {
    post1: await getOrCreateMedia(payload, 'post1'),
    post2: await getOrCreateMedia(payload, 'post2'),
    post3: await getOrCreateMedia(payload, 'post3'),
    hero: await getOrCreateMedia(payload, 'hero'),
  }

  const [maya, daniel] = await Promise.all([
    upsertAuthor(payload, authors[0]!, media.post1.id),
    upsertAuthor(payload, authors[1]!, media.post2.id),
  ])

  const categoryDocs = await Promise.all(
    categories.map((category) => upsertCategory(payload, category)),
  )
  const categoryBySlug = new Map(categoryDocs.map((category) => [category.slug, category]))

  const now = Date.now()
  const daysAgo = (days: number) => new Date(now - days * 24 * 60 * 60 * 1000).toISOString()

  const post1Doc = await upsertPost({
    payload,
    slug: 'digital-horizons',
    data: post1({
      heroImage: media.post1,
      blockImage: media.post2,
      author: maya,
    }),
    authorID: maya.id,
    categoryID: categoryBySlug.get('technology')!.id,
    publishedAt: daysAgo(0),
  })

  const post2Doc = await upsertPost({
    payload,
    slug: 'global-gaze',
    data: post2({
      heroImage: media.post2,
      blockImage: media.post3,
      author: daniel,
    }),
    authorID: daniel.id,
    categoryID: categoryBySlug.get('news')!.id,
    publishedAt: daysAgo(2),
  })

  const post3Doc = await upsertPost({
    payload,
    slug: 'dollar-and-sense-the-financial-forecast',
    data: post3({
      heroImage: media.post3,
      blockImage: media.post1,
      author: daniel,
    }),
    authorID: daniel.id,
    categoryID: categoryBySlug.get('finance')!.id,
    publishedAt: daysAgo(5),
  })

  // Sequential on purpose: concurrent updates to the shared `posts_rels` table
  // can deadlock when Payload writes relationship rows for several posts at once.
  await payload.update({
    collection: 'posts',
    id: post1Doc.id,
    data: { relatedPosts: [post2Doc.id, post3Doc.id] },
    context: { disableRevalidate: true },
    overrideAccess: true,
  })
  await payload.update({
    collection: 'posts',
    id: post2Doc.id,
    data: { relatedPosts: [post1Doc.id, post3Doc.id] },
    context: { disableRevalidate: true },
    overrideAccess: true,
  })
  await payload.update({
    collection: 'posts',
    id: post3Doc.id,
    data: { relatedPosts: [post1Doc.id, post2Doc.id] },
    context: { disableRevalidate: true },
    overrideAccess: true,
  })

  // The dedicated `/contact` page reads this form by title.
  const contactForm = await payload.find({
    collection: 'forms',
    limit: 1,
    overrideAccess: true,
    where: { title: { equals: 'Contact Form' } },
  })

  let contactFormDoc = contactForm.docs[0]

  if (!contactFormDoc) {
    contactFormDoc = (await payload.create({
      collection: 'forms',
      data: contactFormData,
      overrideAccess: true,
    })) as Form
  }

  // Keep the CMS pages available even though `/contact` has a dedicated route.
  const contactPage = await payload.find({
    collection: 'pages',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'contact' } },
  })

  if (!contactPage.docs[0] && contactFormDoc) {
    await payload.create({
      collection: 'pages',
      data: contactPageData({ contactForm: contactFormDoc }),
      context: { disableRevalidate: true },
      overrideAccess: true,
    })
  }

  const homePage = await payload.find({
    collection: 'pages',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })

  if (!homePage.docs[0]) {
    await payload.create({
      collection: 'pages',
      data: home({ heroImage: media.hero, metaImage: media.post2 }),
      context: { disableRevalidate: true },
      overrideAccess: true,
    })
  }

  payload.logger.info('Production demo content is ready.')

  return {
    authors: 2,
    categories: categoryDocs.length,
    media: Object.keys(media).length,
    posts: 3,
  }
}
