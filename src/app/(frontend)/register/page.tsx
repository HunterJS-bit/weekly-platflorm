import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accounts — Weekly',
  description: 'Accounts on Weekly are created by the editorial team.',
}

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Accounts are by invite</h1>
        <p className="text-gray-600">
          Public registration is closed. If you need an account, please contact the editorial team
          and an administrator will create one for you.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Contact the team
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
