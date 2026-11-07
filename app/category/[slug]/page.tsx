import { notFound } from 'next/navigation'
import { Catalog } from '@/components/Catalog'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getProducts } from '@/lib/catalog'
import { CATEGORIES, inCategory } from '@/lib/products'

type Props = { params: Promise<{ slug: string }> }

export const generateStaticParams = () => CATEGORIES.map((c) => ({ slug: c.slug }))
export const dynamicParams = false

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return { title: CATEGORIES.find((c) => c.slug === slug)?.name }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = CATEGORIES.find((c) => c.slug === slug)
  if (!cat) notFound()
  return (
    <>
      <Header />
      <Catalog key={slug} cat={cat} products={inCategory(await getProducts(), cat.slug)} />
      <Footer />
    </>
  )
}
