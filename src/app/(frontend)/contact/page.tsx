import type { Metadata } from 'next'
import { Facebook, Instagram, Linkedin, Mail, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { mapCmsPost } from '@/components/Magazine/fromCms'
import { MetaRow } from '@/components/Magazine/MetaRow'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us — Weekly',
  description: 'Get in touch with the Weekly team. We’d love to hear from you.',
}

const CONTACT_EMAIL = 'hello@mysite.com'
const CONTACT_PHONE = '8 800 2345 234'
const CONTACT_ADDRESS = '27 Division St, New York,\nNY 10002, United States'

const socials = [
  { href: 'https://facebook.com', label: 'Facebook', Icon: Facebook },
  { href: 'https://x.com', label: 'X', Icon: Twitter },
  { href: 'https://instagram.com', label: 'Instagram', Icon: Instagram },
  { href: 'https://linkedin.com', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://youtube.com', label: 'YouTube', Icon: Youtube },
]

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise })

  const [formResult, postsResult] = await Promise.all([
    payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Contact Form',
        },
      },
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 3,
      overrideAccess: false,
      sort: '-publishedAt',
      depth: 2,
    }),
  ])

  const contactForm = formResult.docs[0]
  const latestPosts = postsResult.docs.map((post, index) => mapCmsPost(post, index))

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
          <span className="text-[#111] dark:text-white">Contact Us</span>
        </nav>
      </div>

      <header className="magazine-wrap py-10">
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[64px]">
          Contact Us
        </h1>
      </header>

      <div className="magazine-wrap pb-12">
        <img
          src="/media/image-hero1-1400x788.webp"
          alt="A calm workspace with a laptop and coffee"
          className="h-[240px] w-full object-cover md:h-[400px]"
        />
      </div>

      {/* Contact details */}
      <section className="magazine-wrap pb-16">
        <div className="grid gap-10 border-y border-[#ececec] py-12 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">Email Address</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 block text-[16px] leading-7 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">How to find us</p>
            <p className="mt-3 whitespace-pre-line text-[16px] leading-7">{CONTACT_ADDRESS}</p>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">Phone Number</p>
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
              className="mt-3 block text-[16px] leading-7 hover:underline"
            >
              {CONTACT_PHONE}
            </a>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#999]">Social</p>
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
            <p className="text-xs tracking-[0.18em] uppercase text-[#999]">Get in touch</p>
            <h2 className="mt-4 text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
              Drop Us a Line
            </h2>
            <p className="mt-5 max-w-[34ch] text-[16px] leading-7 text-[#8d8d8d]">
              Have a story idea, a question, or just want to say hello? Fill in the form and we’ll
              get back to you as soon as we can.
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
            {contactForm ? (
              <ContactForm formID={contactForm.id} />
            ) : (
              <p className="text-[16px] leading-7 text-[#8d8d8d]">
                The contact form isn’t available right now. Please email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Latest posts */}
      {latestPosts.length > 0 ? (
        <section className="magazine-wrap pb-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em]">Latest Posts</h2>
            <Link
              href="/posts"
              className="text-sm text-[#8d8d8d] hover:text-[#111] dark:hover:text-white"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {latestPosts.map((post) => (
              <article key={post.id} className="flex flex-col gap-4">
                <Link href={post.href} className="block overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
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
