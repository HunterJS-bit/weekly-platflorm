const WORDS_PER_MINUTE = 200

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const countWordsInText = (text: string): number =>
  text.trim().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0

/**
 * Walks a Lexical editor state and counts the words in its text nodes.
 * Text can live in `children` or inside a block's `fields`, so nested values
 * are followed too. Only actual text nodes are counted, which keeps editor
 * metadata (direction, version, block names, ...) out of the total.
 */
const countWords = (value: unknown): number => {
  if (Array.isArray(value)) return value.reduce((total, item) => total + countWords(item), 0)
  if (!isRecord(value)) return 0

  const ownWords =
    value.type === 'text' && typeof value.text === 'string' ? countWordsInText(value.text) : 0
  const nestedWords = Object.values(value).reduce<number>(
    (total, nested) => total + countWords(nested),
    0,
  )

  return ownWords + nestedWords
}

/** Estimated reading time in minutes, always at least one minute. */
export const getReadingMinutes = (content: unknown): number => {
  const words = countWords(content)

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
