import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('register')

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  }
}

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const t = await getTranslations('register')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">{t('description')}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            {t('contact')}
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('signIn')}
          </Link>
        </div>
      </div>
    </div>
  )
}
