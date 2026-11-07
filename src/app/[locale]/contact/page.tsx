import type { Metadata } from 'next'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Mail, Twitter, Youtube } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { mapCmsPost } from '@/components/Magazine/fromCms'
import { MetaRow } from '@/components/Magazine/MetaRow'
import { JsonLd } from '@/components/JsonLd'
import { Link } from '@/i18n/navigation'
import { buildSeoMetadata } from '@/utilities/seo'
import { breadcrumbJsonLd, webPageJsonLd } from '@/utilities/structuredData'

import { ContactForm } from './ContactForm'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact')

  return buildSeoMetadata({
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    path: '/contact',
  })
}

const CONTACT_EMAIL = 'hello@mysite.com'
const CONTACT_PHONE = '8 800 2345 234'

const socials = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
  { href: 'https://x.com', label: 'X', Icon: Twitter },
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://youtube.com', label: 'YouTube', Icon: Youtube },
]

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale?: string }>
}) {
  const { locale = 'sr' } = await params
  const t = await getTranslations('contact')
  const tCommon = await getTranslations('common')
  const payload = await getPayload({ config: configPromise })

  const postsResult = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 3,
    overrideAccess: false,
    sort: '-publishedAt',
    depth: 2,
  })

  const latestPosts = postsResult.docs.map((post, index) => mapCmsPost(post, index, locale))

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('title'),
            description: t('metadataDescription'),
            path: '/contact',
            type: 'ContactPage',
          }),
          breadcrumbJsonLd([
            { name: tCommon('home'), path: '/' },
            { name: t('title'), path: '/contact' },
          ]),
        ]}
      />
      <div className="magazine-wrap pt-10">
        <nav
          aria-label={tCommon('breadcrumb')}
          className="flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#999]"
        >
          <Link href="/" className="hover:text-[#111] dark:hover:text-white">
            {tCommon('home')}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111] dark:text-white">{t('title')}</span>
        </nav>
      </div>

      <header className="magazine-wrap py-10">
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[64px]">
          {t('title')}
        </h1>
      </header>

      <div className="magazine-wrap pb-12">
        <Image
          src="/media/image-hero1-1400x788.webp"
          alt={t('imageAlt')}
          width={1400}
          height={788}
          sizes="100vw"
          className="h-[240px] w-full object-cover md:h-[400px]"
        />
      </div>

      {/* Contact details */}
      <section className="magazine-wrap pb-16">
        <div className="grid gap-10 border-y border-[#ececec] py-12 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">
              {t('emailAddress')}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 block text-[16px] leading-7 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">
              {t('howToFindUs')}
            </p>
            <p className="mt-3 whitespace-pre-line text-[16px] leading-7">{t('address')}</p>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">
              {t('phoneNumber')}
            </p>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
              className="mt-3 block text-[16px] leading-7 hover:underline"
            >
              {CONTACT_PHONE}
            </a>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">{t('social')}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex size-9 items-center justify-center rounded-full border border-[#e2e2e2] text-[#444] transition-colors hover:border-[#111] hover:text-[#111] dark:border-white/20 dark:text-white/70 dark:hover:border-white dark:hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="magazine-wrap pb-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase text-[#999]">{t('getInTouch')}</p>
            <h2 className="mt-4 text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
              {t('formTitle')}
            </h2>
            <p className="mt-5 max-w-[34ch] text-[16px] leading-7 text-[#8d8d8d]">
              {t('formDescription')}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Mail className="size-4" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Latest posts */}
      {latestPosts.length > 0 ? (
        <section className="magazine-wrap pb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em]">{t('latestPosts')}</h2>
            <Link
              href="/posts"
              className="text-sm text-[#8d8d8d] hover:text-[#111] dark:hover:text-white"
            >
              {t('viewAll')}
            </Link>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {latestPosts.map((post) => (
              <article key={post.id} className="flex flex-col gap-4">
                <Link href={post.href} className="relative block h-[220px] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </Link>
                <h3 className="text-[22px] font-semibold leading-7 tracking-[-0.02em]">
                  <Link href={post.href} className="hover:opacity-70">
                    {post.title}
                  </Link>
                </h3>
                <MetaRow post={post} />
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export const dynamic = 'force-dynamic'
