import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = [
  { title: 'Technology', titleSr: 'Tehnologija' },
  { title: 'News', titleSr: 'Vesti' },
  { title: 'Finance', titleSr: 'Finansije' },
  { title: 'Design', titleSr: 'Dizajn' },
  { title: 'Software', titleSr: 'Softver' },
  { title: 'Engineering', titleSr: 'Inženjering' },
  { title: 'AI', titleSr: 'Veštačka inteligencija' },
  { title: 'Business', titleSr: 'Biznis' },
  { title: 'Lifestyle', titleSr: 'Životni stil' },
  { title: 'Mindset', titleSr: 'Način razmišljanja' },
  { title: 'Reflections', titleSr: 'Razmišljanja' },
  { title: 'Travel', titleSr: 'Putovanja' },
  { title: 'Wellbeing', titleSr: 'Dobrobit' },
]

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  // Delete collections sequentially to avoid deadlocks
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  // Delete versions sequentially to avoid deadlocks
  for (const collection of collections.filter((collection) => Boolean(payload.collections[collection].config.versions))) {
    await payload.db.deleteVersions({ collection, req, where: {} })
  }

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, markWeber, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
        role: 'author',
      },
    }),
    payload.create({
      collection: 'users',
      data: {
        name: 'Mark Weber',
        email: 'mark.weber@example.com',
        password: 'password',
        role: 'author',
        bio: 'Writer and creator sharing insights on lifestyle, mindset, and wellbeing.',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category.title,
          titleSr: category.titleSr,
          slug: category.title.toLowerCase(),
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding Mark Weber demo posts...`)

  const demoPostData = [
    {
      title: 'Lessons From Doing Things Differently My Own Way',
      slug: 'lessons-doing-things-differently',
      excerpt:
        'In the heart of a bustling city, where innovation meets opportunity, the story of our digital agency began. Like all great journeys, it started with a simple…',
      category: 'Lifestyle',
      image: image1Doc,
    },
    {
      title: 'Starting Over Again: Why It’s Not as Scary as It Feels',
      slug: 'starting-over-again',
      excerpt: 'A new chapter rarely arrives with a map. It usually begins with a quiet decision to try again.',
      category: 'Mindset',
      image: image2Doc,
    },
    {
      title: 'Why Taking Care of Yourself Doesn’t Have to Be Complicated',
      slug: 'taking-care-yourself',
      excerpt: 'Small rituals, repeated often, do more for your days than ambitious plans you never keep.',
      category: 'Wellbeing',
      image: image3Doc,
    },
    {
      title: 'Slowing Down and Paying More Attention to Life',
      slug: 'slowing-down-attention',
      excerpt: 'Attention is the rarest currency we spend. Most of it disappears before we notice where it went.',
      category: 'Lifestyle',
      image: image1Doc,
    },
    {
      title: 'Why Simplicity Feels So Good',
      slug: 'why-simplicity-feels-good',
      excerpt:
        'There’s a particular kind of relief that comes from a clean desk, an empty inbox, or a quiet morning with nothing…',
      category: 'Reflections',
      image: image2Doc,
    },
    {
      title: 'Designing a Life That Feels Good, Not Just Successful',
      slug: 'designing-life-feels-good',
      excerpt: 'Success looks impressive from far away. Close up, it has to feel like a life you want to keep living.',
      category: 'Lifestyle',
      image: image3Doc,
    },
    {
      title: 'The Importance of Rest: How Doing Nothing Helps You',
      slug: 'importance-of-rest',
      excerpt: 'Rest is not a reward for finishing the list. It is how the list stays worth doing.',
      category: 'Wellbeing',
      image: image1Doc,
    },
    {
      title: 'A Complete Beginner’s Guide to Building Better Habits',
      slug: 'beginners-guide-better-habits',
      excerpt:
        "Most people don't fail at building habits because they're lazy. They fail because they are trying to build the wrong…",
      category: 'Mindset',
      image: image2Doc,
    },
    {
      title: 'The Moments That Matter Most When You Stop Looking',
      slug: 'moments-that-matter',
      excerpt: 'The best hours of a week are often the ones that never made it onto the calendar.',
      category: 'Lifestyle',
      image: image3Doc,
    },
    {
      title: 'A Practical Approach to Creating a Life You Actually Enjoy',
      slug: 'practical-approach-life',
      excerpt:
        'We spend so much time chasing the idea of a good life: bigger goals, better titles, more boxes checked. And we…',
      category: 'Lifestyle',
      image: image1Doc,
    },
  ]

  const demoPostDocs = []
  for (const postData of demoPostData) {
    const categoryDoc = await payload.find({
      collection: 'categories',
      where: {
        title: {
          equals: postData.category,
        },
      },
      limit: 1,
    })

    const postDoc = await payload.create({
      collection: 'posts',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: {
        title: postData.title,
        slug: postData.slug,
        _status: 'published',
        authors: [markWeber],
        heroImage: postData.image.id,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: postData.excerpt,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        meta: {
          description: postData.excerpt,
          image: postData.image.id,
          title: postData.title,
        },
        categories: categoryDoc.docs.length > 0 ? [categoryDoc.docs[0].id] : [],
      },
    })
    demoPostDocs.push(postDoc)
  }

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        description: 'Welcome to FrontLine. A place for ideas, stories, and tips that spark curiosity. Whether you\'re here to learn, get inspired, or just enjoy a good read, you\'re in the right place.',
        socialLinks: {
          facebook: 'https://facebook.com',
          x: 'https://x.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          youtube: 'https://youtube.com',
        },
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/3.x/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
