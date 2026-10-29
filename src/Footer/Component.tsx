import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { defaultCategories } from '@/components/Magazine/demoPosts'
import { CMSLink } from '@/components/Link'

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.6l-5.2-6.8L5.4 22H2.3l7.3-8.4L1 2h6.7l4.7 6.2L18.9 2Zm-2.3 18h1.8L7.5 3.9H5.5L16.6 20Z" />
  </svg>
)

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []

  let footerCategories: { title: string; slug: string }[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'categories',
      limit: 6,
      overrideAccess: false,
      sort: 'title',
    })
    if (result.docs.length) {
      footerCategories = result.docs.map((category) => ({
        title: category.title,
        slug: category.slug,
      }))
    }
  } catch {
    footerCategories = defaultCategories.slice(0, 6).map((title) => ({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
    }))
  }

  return (
    <footer className="mt-auto bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <div className="magazine-wrap grid gap-12 py-16 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <MagazineLogo />
          <p className="mt-6 max-w-[42ch] text-[16px] leading-7 text-[#737373]">
            Welcome to Weekly. A place for ideas, stories, and tips that spark curiosity. Whether
            you’re here to learn, get inspired, or just enjoy a good read, you’re in the right place.
          </p>
          <div className="mt-6 flex items-center gap-4 text-[#444] dark:text-white">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:opacity-70">
              <Facebook className="size-4" />
            </a>
            <a href="https://x.com" aria-label="X" className="hover:opacity-70">
              <XIcon />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:opacity-70">
              <Instagram className="size-4" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:opacity-70">
              <Linkedin className="size-4" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube" className="hover:opacity-70">
              <Youtube className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Categories</h3>
          <nav className="flex flex-col gap-3 text-[#555] dark:text-white/70">
            {footerCategories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                {category.title}
              </Link>
            ))}
            {navItems.map(({ link }, index) => (
              <CMSLink key={index} {...link} />
            ))}
          </nav>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">How to find us</h3>
          <div className="flex flex-col gap-4 text-[#555] dark:text-white/70">
            <p>
              27 Division St, New York, NY
              <br />
              10002, United States
            </p>
            <a href="mailto:hello@mysite.com">hello@mysite.com</a>
            <a href="tel:88002345234">8 800 2345 234</a>
          </div>
        </div>
      </div>
      <div className="magazine-wrap border-t border-[#e8e8e8] py-6 text-center text-sm text-[#8a8a8a] dark:border-white/10">
        © {new Date().getFullYear()} — Weekly. All Rights Reserved.
      </div>
    </footer>
  )
}
