'use client'
import { useState } from 'react'
import { ablative, available, COLORS, SIZES, type Category, type ColorKey, type Product, type Size } from '@/lib/products'
import { ChevronDown, CloseIcon, Crumbs, FilterIcon, ProductCard } from './ui'

type PriceId = 'all' | 'p1' | 'p2' | 'p3'
const PRICES: [PriceId, string, (n: number) => boolean][] = [
  ['all', 'Бүх үнэ', () => true],
  ['p1', '100,000₮ хүртэл', (n) => n <= 100_000],
  ['p2', '100,000₮ – 200,000₮', (n) => n > 100_000 && n <= 200_000],
  ['p3', '200,000₮-өөс дээш', (n) => n > 200_000],
]
const SORTS = {
  new: ['Шинэ нь эхэндээ', () => 0], // products arrive newest first (created_at desc)
  asc: ['Үнэ: багаас их', (a: Product, b: Product) => a.price - b.price],
  desc: ['Үнэ: ихээс бага', (a: Product, b: Product) => b.price - a.price],
  best: ['Их захиалагдсан', (a: Product, b: Product) => a.rank - b.rank],
} as const
type Sort = keyof typeof SORTS


const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

export function Catalog({ cat, products }: { cat: Category; products: Product[] }) {
  const [sizes, setSizes] = useState<Size[]>([])
  const [colors, setColors] = useState<ColorKey[]>([])
  const [price, setPrice] = useState<PriceId>('all')
  const [sort, setSort] = useState<Sort>('new')
  const [open, setOpen] = useState(false)

  const priceRow = PRICES.find((p) => p[0] === price)!
  const items = [...products]
    .filter((p) => (!sizes.length || sizes.some((s) => available(p).includes(s))) && (!colors.length || colors.some((c) => p.colors.includes(c))) && priceRow[2](p.price))
    .sort(SORTS[sort][1])
  const n = items.length

  const chips = [
    ...sizes.map((s) => ({ label: `Хэмжээ: ${s}`, aria: `${s} шүүлтүүрийг хасах`, remove: () => setSizes(toggle(sizes, s)) })),
    ...colors.map((c) => ({ label: COLORS[c].label, aria: `${COLORS[c].label} шүүлтүүрийг хасах`, remove: () => setColors(toggle(colors, c)) })),
    ...(price === 'all' ? [] : [{ label: priceRow[1], aria: 'Үнийн шүүлтүүрийг хасах', remove: () => setPrice('all') }]),
  ]
  const clear = () => { setSizes([]); setColors([]); setPrice('all') }

  const chipEls = chips.length > 0 && (
    <>
      {chips.map((ch) => (
        <button key={ch.label} type="button" className="chip" aria-label={ch.aria} onClick={ch.remove}>{ch.label}<CloseIcon size={14} /></button>
      ))}
      <button type="button" className="textbtn px-1" onClick={clear}>Бүгдийг арилгах</button>
    </>
  )

  const sortSelect = (
    <span className="select-wrap">
      <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
        {Object.entries(SORTS).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
      </select>
      <ChevronDown />
    </span>
  )

  // rendered twice (mobile panel, desktop sidebar) so radio names must differ
  const filters = (name: string, wide: boolean) => (
    <>
      <fieldset className="py-4 border-b border-rule lg:pt-[18px] lg:pb-[22px]">
        <legend className="float-left w-full pb-2.5 text-[13px] font-semibold">Хэмжээ</legend>
        <div className="clear-both flex flex-wrap gap-2 lg:gap-1.5">
          {SIZES.map((s) => (
            <button key={s} type="button" className="pill" aria-pressed={sizes.includes(s)} onClick={() => setSizes(toggle(sizes, s))}>{s}</button>
          ))}
        </div>
      </fieldset>
      <fieldset className="py-4 border-b border-rule lg:py-[18px]">
        <legend className="float-left w-full pb-2.5 text-[13px] font-semibold lg:pb-2">Өнгө</legend>
        <div className={`clear-both flex gap-2 ${wide ? 'flex-col gap-0' : 'flex-wrap'}`}>
          {(Object.keys(COLORS) as ColorKey[]).map((c) => (
            <button key={c} type="button" className={`sw ${wide ? 'plain' : ''}`} aria-pressed={colors.includes(c)} onClick={() => setColors(toggle(colors, c))}>
              <span aria-hidden="true" className="dot size-[18px]" style={{ background: COLORS[c].sw }} />
              {COLORS[c].label}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="pt-4 pb-2 lg:py-[18px]">
        <legend className="float-left w-full pb-1.5 text-[13px] font-semibold">Үнэ</legend>
        <div className="clear-both">
          {PRICES.map(([id, label]) => (
            <label key={id} className="radio">
              <input type="radio" name={name} checked={price === id} onChange={() => setPrice(id)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )

  return (
    <main>
      <div className="px-4 pt-5 pb-6 lg:wrap lg:flex lg:flex-wrap lg:items-end lg:justify-between lg:gap-x-12 lg:gap-y-4 lg:pt-8 lg:pb-12">
        <div className="min-w-0">
          <Crumbs items={[['Нүүр', '/'], [cat.name]]} />
          <h1 className="mt-5 mb-2 font-display font-bold uppercase text-[36px] leading-none lg:m-0 lg:mt-4 lg:text-[clamp(40px,4.5vw,64px)]">{cat.name}</h1>
        </div>
        {'desc' in cat && <p className="text-[15px] leading-[1.6] text-muted max-w-[34ch] lg:text-[16px] lg:leading-[1.65] lg:max-w-[38ch]">{cat.desc}</p>}
      </div>

      {/* mobile controls */}
      <div className="lg:hidden sticky top-0 z-10 grid grid-cols-[auto_minmax(0,1fr)] gap-3 items-center px-4 py-2.5 bg-paper border-y border-rule">
        <button type="button" className="btn-line" aria-expanded={open} aria-controls="filters" onClick={() => setOpen(!open)}>
          <FilterIcon />Шүүлтүүр{chips.length > 0 && ` (${chips.length})`}
        </button>
        <label className="flex flex-col gap-0.5 min-w-0 justify-self-end">
          <span className="text-[11px] text-muted">Эрэмбэлэх</span>
          {sortSelect}
        </label>
      </div>
      {chips.length > 0 && <div className="lg:hidden hscroll flex gap-2 px-4 pt-3">{chipEls}</div>}
      {open && (
        <div id="filters" className="lg:hidden mx-4 mt-3 px-4 pt-1 pb-5 bg-paper-2">
          {filters('price-m', false)}
          <button type="button" className="btn w-full mt-2" onClick={() => setOpen(false)}>{n} загвар харуулах</button>
        </div>
      )}
      <p className="lg:hidden px-4 pt-4 pb-3 text-[13px] text-muted">{n} загвар</p>

      <div className="lg:wrap lg:flex lg:flex-wrap lg:gap-x-12 lg:gap-y-10 lg:items-start lg:pb-[120px]">
        <aside aria-label="Шүүлтүүр" className="hidden lg:block flex-[1_1_220px] max-w-[260px] border-t border-ink">
          {filters('price-d', true)}
        </aside>

        <div className="lg:flex-[999_1_560px] min-w-0">
          <div className="hidden lg:flex flex-wrap justify-between items-center gap-x-6 gap-y-3 pt-2.5 pb-[18px] border-t border-ink">
            <div className="flex flex-wrap gap-2 items-center min-w-0">
              <span className="mr-2 text-[13px] text-muted">{n} загвар</span>
              {chipEls}
            </div>
            <label className="flex items-center gap-2.5 text-[13px] whitespace-nowrap">Эрэмбэлэх {sortSelect}</label>
          </div>

          {n === 0 ? (
            <div className="px-4 py-10 flex flex-col items-start gap-3 lg:px-0">
              <p className="text-[15px]">Шүүлтүүрт тохирох загвар олдсонгүй.</p>
              <button type="button" className="btn-line" onClick={clear}>Бүгдийг арилгах</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 items-start px-4 lg:px-0 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-5 lg:gap-y-12">
              {items.map((p) => <ProductCard key={p.slug} p={p} dots />)}
            </div>
          )}

          {/* ponytail: no pagination yet; every match is already shown so "Цааш үзэх" stays disabled */}
          <div className="flex flex-col items-center gap-3 px-4 pt-10 pb-[72px] lg:px-0 lg:pt-16 lg:pb-0">
            <p className="text-[13px] text-muted">{ablative(n)} {n} загварыг харууллаа</p>
            <button type="button" className="btn-line w-full lg:w-auto lg:px-7" disabled>Цааш үзэх</button>
          </div>
        </div>
      </div>
    </main>
  )
}
