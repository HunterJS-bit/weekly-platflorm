import React from 'react'

type JsonLdData = Record<string, unknown> | Record<string, unknown>[]

/**
 * Renders JSON-LD structured data. Escapes `<` so CMS-controlled strings can
 * never break out of the script tag.
 */
export const JsonLd = ({ data }: { data: JsonLdData }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
)
