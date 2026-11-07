import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Crumbs, ProductCard, SearchIcon } from '@/components/ui'
import { getProducts } from '@/lib/catalog'
import { CATEGORIES } from '@/lib/products'

export const metadata = { title: 'Хайх' }

const norm = (s: string) => s.toLowerCase().replace(/[«»"']/g, '').trim()

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? '').slice(0, 60)
  const words = norm(q).split(/\s+/).filter(Boolean)
  const results = words.length
    ? (await getProducts()).filter((p) => {
        const hay = norm(`${p.name} ${CATEGORIES.find((c) => c.slug === p.category)?.name ?? ''} ${p.desc ?? ''} ${p.material ?? ''}`)
        return words.every((w) => hay.includes(w))
      })
    : []

  return (
    <>
      <Header />
      <main className="px-4 pt-5 pb-20 lg:wrap lg:pt-8 lg:pb-[120px]">
        <Crumbs items={[['Нүүр', '/'], ['Хайх']]} />
        <h1 className="mt-5 mb-6 font-display font-bold uppercase tracking-[.02em] text-[30px] leading-none lg:text-[clamp(32px,3.6vw,52px)]">Хайх</h1>
        <form action="/search" role="search" className="flex items-center gap-2 max-w-[560px] border-b border-ink pb-2 mb-8">
          <SearchIcon />
          <input name="q" defaultValue={q} autoFocus placeholder="Жишээ: ноолуур, даашинз, торго" aria-label="Хайх үг"
            className="flex-1 min-w-0 bg-transparent text-[18px] outline-none py-2" />
          <button type="submit" className="btn-line">Хайх</button>
        </form>

        {words.length > 0 && (
          <p className="mb-6 text-[13px] text-muted">«{q}» — {results.length} загвар олдлоо</p>
        )}
        {words.length > 0 && results.length === 0 && (
          <p className="text-[15px]">Тохирох загвар олдсонгүй. Өөр үгээр хайж үзнэ үү.</p>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 items-start lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
            {results.map((p) => <ProductCard key={p.slug} p={p} dots />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
