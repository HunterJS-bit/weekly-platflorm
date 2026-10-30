export type MagazinePost = {
  id: string
  title: string
  href: string
  image: string
  imageAlt: string
  categories: string[]
  excerpt: string
  author: string
  authorHref?: string
  date: string
  readTime: string
  comments: number
}
