import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Photo, ProductCard } from '@/components/ui'
import { getProducts } from '@/lib/catalog'
import { CATEGORIES, type Product } from '@/lib/products'

// Нүүр хуудасны текст — хүссэнээрээ солино
const HERO = {
  eyebrow: 'Намар — Өвөл 2026',
  title: 'Анхны цас',
  text: 'Ноолуур, маалинга, ноос — хотын хүйтэн өглөөнд зориулсан шинэ цуглуулга.',
  cta: 'Цуглуулгыг үзэх',
  href: '/category/new',
}
const TILES = ['dress', 'outerwear', 'top', 'accessories'] as const

function Grid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-rule">
      {items.map((p) => (
        <div key={p.slug} className="border-r border-b border-rule">
          <ProductCard p={p} className="!gap-0 [&>span:last-child]:px-3 [&>span:last-child]:py-3.5 lg:[&>span:last-child]:px-4" />
        </div>
      ))}
    </div>
  )
}

function SectionHead({ title, href, link }: { title: string; href: string; link: string }) {
  return (
    <div className="wrap flex items-end justify-between gap-4 pt-14 pb-6 lg:pt-20 lg:pb-8">
      <h2 className="h-section">{title}</h2>
      <Link href={href} className="text-[12px] font-semibold uppercase tracking-[.08em] underline underline-offset-4">{link}</Link>
    </div>
  )
}

export default async function Home() {
  const all = await getProducts()
  const withImg = all.filter((p) => p.images?.length)
  const heroP = withImg[0]
  const best = [...all].sort((a, b) => a.rank - b.rank).slice(0, 8)
  const fresh = all.filter((p) => p.isNew).slice(0, 4)

  return (
    <>
      <Header home />
      <main>
        {/* HERO — full-bleed image, text bottom-left */}
        <section aria-labelledby="hero-title" className="relative h-[78vh] min-h-[520px] max-h-[900px] overflow-hidden bg-[#3B322C] text-paper">
          {heroP && <Photo p={heroP} i={heroP.images!.length > 1 ? 1 : 0} eager className="absolute inset-0 w-full h-full" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="wrap relative h-full flex flex-col justify-end gap-4 pb-14 lg:pb-20">
            <p className="text-[15px] lg:text-[17px] font-medium">{HERO.eyebrow}</p>
            <h1 id="hero-title" className="font-display font-bold uppercase text-[44px] leading-[.95] tracking-[.01em] lg:text-[clamp(56px,6vw,96px)]">{HERO.title}</h1>
            <p className="text-[14px] lg:text-[16px] leading-[1.6] max-w-[44ch] opacity-90">{HERO.text}</p>
            <div className="pt-2"><Link href={HERO.href} className="btn-ghost">{HERO.cta}</Link></div>
          </div>
        </section>

        {/* BEST SELLERS */}
        <section aria-label="Их захиалагдсан">
          <SectionHead title="Их захиалагдсан" href="/category/dress" link="Бүгдийг үзэх" />
          <Grid items={best} />
        </section>

        {/* CATEGORY TILES — 2 × 2 full-bleed */}
        <section aria-label="Ангилал" className="mt-14 lg:mt-20 grid lg:grid-cols-2">
          {TILES.map((slug) => {
            const cat = CATEGORIES.find((c) => c.slug === slug)!
            const cover = all.find((p) => p.category === slug && p.images?.length) // зураггүй бол бараан дэвсгэр
            return (
              <Link key={slug} href={`/category/${slug}`} className="group relative block aspect-[4/5] lg:aspect-[1/1] overflow-hidden bg-[#3B322C] text-paper hover:opacity-100">
                {cover && <Photo p={cover} className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.03]" />}
                <span className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                <span className="absolute top-6 left-6 lg:top-9 lg:left-9 flex flex-col gap-2">
                  <span className="font-display font-bold uppercase text-[28px] lg:text-[40px] leading-none">{cat.name}</span>
                  <span className="text-[13px] font-medium underline underline-offset-4">Бүгдийг үзэх</span>
                </span>
              </Link>
            )
          })}
        </section>

        {/* NEW IN */}
        {fresh.length > 0 && (
          <section aria-label="Шинэ ирэлт">
            <SectionHead title="Шинэ ирэлт" href="/category/new" link="Бүгдийг үзэх" />
            <Grid items={fresh} />
          </section>
        )}

        {/* BRAND NOTE */}
        <section aria-labelledby="note-title" className="wrap py-20 lg:py-28 text-center flex flex-col items-center gap-5">
          <p className="eyebrow text-muted">Бидний тухай</p>
          <h2 id="note-title" className="font-display font-bold uppercase text-[30px] lg:text-[44px] leading-[1.05] max-w-[18ch]">Хотын өвөлд зориулав</h2>
          <p className="text-[15px] leading-[1.7] text-muted max-w-[52ch]">Цөөн өнгө, цэвэр зүсэлт, удаан эдлэх материал. Шүүгээндээ жил бүр эргэж ирэх хувцсыг Улаанбаатарт бүтээдэг.</p>
          <Link href="/about" className="btn-line mt-2">Брэндийн тухай</Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
