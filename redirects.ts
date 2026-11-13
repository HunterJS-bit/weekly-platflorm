import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  return [
    internetExplorerRedirect,
    {
      source: '/imprint',
      destination: '/impresum',
      permanent: true,
    },
    {
      source: '/privacy-policy',
      destination: '/politika-privatnosti',
      permanent: true,
    },
    {
      source: '/privacy',
      destination: '/politika-privatnosti',
      permanent: true,
    },
    {
      source: '/terms-of-use',
      destination: '/uslovi-koriscenja',
      permanent: true,
    },
    {
      source: '/terms',
      destination: '/uslovi-koriscenja',
      permanent: true,
    },
  ]
}
