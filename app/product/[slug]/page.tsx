import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ProductView } from '@/components/ProductView'
import { getProduct, getProducts } from '@/lib/catalog'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return { title: (await getProduct((await params).slug))?.name }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const all = await getProducts()
  const p = all.find((x) => x.slug === slug)
  if (!p) notFound()
  // "Хослуулж өмсөх": өөр ангиллаас хамгийн их захиалагдсан 3 бараа (аксессуар эхэндээ)
  const pair = all
    .filter((x) => x.category !== p.category)
    .sort((a, b) => Number(b.category === 'accessories') - Number(a.category === 'accessories') || a.rank - b.rank)
    .slice(0, 3)
  return (
    <>
      <Header active={p.category} />
      <ProductView key={p.slug} p={p} pair={pair} />
      <Footer />
    </>
  )
}
