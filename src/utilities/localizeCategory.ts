type CategoryLike = {
  title: string
  titleSr?: string | null
  description?: string | null
  descriptionSr?: string | null
}

// The seeded categories predate the Serbian fields, so keep a fallback so the
// UI is never mixed-language even when `titleSr` has not been filled in yet.
const srCategoryTitles: Record<string, string> = {
  AI: 'Veštačka inteligencija',
  Business: 'Biznis',
  Design: 'Dizajn',
  Engineering: 'Inženjering',
  Finance: 'Finansije',
  Lifestyle: 'Životni stil',
  Mindset: 'Način razmišljanja',
  News: 'Vesti',
  Reflections: 'Razmišljanja',
  Software: 'Softver',
  Technology: 'Tehnologija',
  Travel: 'Putovanja',
  Wellbeing: 'Dobrobit',
}

const srCategoryDescriptions: Record<string, string> = {
  Design: 'Zanat, tipografija i detalji zbog kojih dobri proizvodi deluju ispravno.',
  Engineering: 'Detaljni uvidi u sisteme, arhitekturu i tehničke odluke.',
  Finance: 'Praktično razmišljanje o novcu, tržištima i ekonomiji.',
  News: 'Priče i događaji na koje vredi obratiti pažnju ove nedelje.',
  Software: 'Inženjerske beleške, razvojni tokovi i stvari koje gradimo.',
  Technology: 'Alati, platforme i ideje koje oblikuju način na koji živimo i radimo.',
}

export const localizeCategoryTitle = (
  category: CategoryLike | null | undefined,
  locale: string,
) => {
  if (!category) return ''

  if (locale !== 'sr') return category.title

  return category.titleSr || srCategoryTitles[category.title] || category.title
}

export const localizeCategoryDescription = (
  category: CategoryLike | null | undefined,
  locale: string,
) => {
  if (!category) return null

  if (locale !== 'sr') return category.description || null

  return (
    category.descriptionSr ||
    srCategoryDescriptions[category.title] ||
    category.description ||
    null
  )
}
