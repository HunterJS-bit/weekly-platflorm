import canUseDOM from './canUseDOM'

const normalizeOrigin = (value?: string | null): string | null => {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    return new URL(withProtocol).origin
  } catch {
    return null
  }
}

/**
 * Single source of truth for absolute, production-facing URLs.
 * Accepts origins with or without an explicit protocol.
 */
export const getServerSideURL = (): string =>
  normalizeOrigin(process.env.NEXT_PUBLIC_SERVER_URL) ||
  normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  'http://localhost:3000'

export const getClientSideURL = (): string => {
  if (canUseDOM) return window.location.origin

  return getServerSideURL()
}
