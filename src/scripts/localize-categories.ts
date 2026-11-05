import config from '@payload-config'
import { getPayload } from 'payload'

// The categories were seeded before the Serbian fields existed. Fill them in
// without touching any other content.
const translations = [
  {
    slug: 'technology',
    titleSr: 'Tehnologija',
    descriptionSr: 'Alati, platforme i ideje koje oblikuju način na koji živimo i radimo.',
  },
  {
    slug: 'news',
    titleSr: 'Vesti',
    descriptionSr: 'Priče i događaji na koje vredi obratiti pažnju ove nedelje.',
  },
  {
    slug: 'finance',
    titleSr: 'Finansije',
    descriptionSr: 'Praktično razmišljanje o novcu, tržištima i ekonomiji.',
  },
  {
    slug: 'design',
    titleSr: 'Dizajn',
    descriptionSr: 'Zanat, tipografija i detalji zbog kojih dobri proizvodi deluju ispravno.',
  },
  {
    slug: 'software',
    titleSr: 'Softver',
    descriptionSr: 'Inženjerske beleške, razvojni tokovi i stvari koje gradimo.',
  },
  {
    slug: 'engineering',
    titleSr: 'Inženjering',
    descriptionSr: 'Detaljni uvidi u sisteme, arhitekturu i tehničke odluke.',
  },
]

const payload = await getPayload({ config })

try {
  for (const translation of translations) {
    const result = await payload.find({
      collection: 'categories',
      depth: 0,
      limit: 1,
      where: { slug: { equals: translation.slug } },
    })

    const category = result.docs[0]

    if (!category) {
      payload.logger.warn(`Category "${translation.slug}" not found, skipping`)
      continue
    }

    await payload.update({
      collection: 'categories',
      id: category.id,
      data: {
        titleSr: translation.titleSr,
        descriptionSr: translation.descriptionSr,
      },
    })

    payload.logger.info(`Localized category "${translation.slug}"`)
  }
} catch (error) {
  payload.logger.error({ err: error }, 'Category localization failed')
  process.exitCode = 1
} finally {
  await payload.destroy()
}
