import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post, Category, User } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

type SeoDoc = Post | Page | Category | User

const getDocTitle = (doc: SeoDoc): string | undefined => {
  if ('name' in doc && typeof doc.name === 'string') return doc.name
  if ('title' in doc && typeof doc.title === 'string') return doc.title

  return undefined
}

const generateTitle: GenerateTitle<SeoDoc> = ({ doc }) => {
  const title = doc ? getDocTitle(doc) : undefined

  return title ? `${title} | Weekly` : 'Weekly'
}

const generateURL: GenerateURL<SeoDoc> = ({ collectionConfig, doc }) => {
  const url = getServerSideURL().replace(/\/$/, '')
  const slug = doc && 'slug' in doc && typeof doc.slug === 'string' ? doc.slug : undefined

  if (!slug) return url

  switch (collectionConfig?.slug) {
    case 'categories':
      return `${url}/category/${slug}`
    case 'users':
      return `${url}/author/${slug}`
    case 'pages':
      return slug === 'home' ? url : `${url}/${slug}`
    default:
      return `${url}/posts/${slug}`
  }
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
