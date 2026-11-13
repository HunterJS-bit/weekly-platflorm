/**
 * Public routes for the legal pages. Kept separate from `legal.ts` so client
 * components can import the links without bundling the full legal copy.
 */
export const LEGAL_LINKS = [
  { href: '/impresum', key: 'impressum' },
  { href: '/politika-privatnosti', key: 'privacy' },
  { href: '/uslovi-koriscenja', key: 'terms' },
] as const

export type LegalLinkKey = (typeof LEGAL_LINKS)[number]['key']
