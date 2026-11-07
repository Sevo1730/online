'use client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { DELIVERY_TIME, FREE_SHIPPING_THRESHOLD, MODEL_HEIGHT, RETURN_DAYS, SHIPPING_FEE } from '@/lib/config'
import { useCart } from '@/lib/cart'
import { available, CATEGORIES, COLORS, fmt, SIZES, type Product, type Size } from '@/lib/products'
import { AlertIcon, ChevronLeft, ChevronRight, Crumbs, MinusIcon, Ph, Photo, PlusIcon, ProductCard } from './ui'

const SHOTS = [
  { label: 'Урдаас, бүтэн биеэр', t: 2 },
  { label: 'Хажуугаас, хөдөлгөөнтэй', t: 1 },
  { label: 'Даавууны бүтэц, ойроос', t: 3 },
  { label: 'Араас, бүстэй', t: 2 },
] as const

const GUIDE: [Size, string, string, string][] = [
  ['XS', '80–84', '62–66', '86–90'],
  ['S', '84–88', '66–70', '90–94'],
  ['M', '88–92', '70–74', '94–98'],
  ['L', '92–96', '74–78', '98–102'],
  ['XL', '96–100', '78–82', '102–106'],
]

export function ProductView({ p, pair }: { p: Product; pair: Product[] }) {
  const router = useRouter()
  const { add } = useCart()
  const [shot, setShot] = useState(0)
  const [color, setColor] = useState(0)
  const [size, setSize] = useState<Size | null>(null)
  const [guide, setGuide] = useState(false)
  const [tried, setTried] = useState(false)
  const [panel, setPanel] = useState<string | null>('mat')
  const [pending, start] = useTransition()

  const cat = CATEGORIES.find((c) => c.slug === p.category)!
  const sized = p.sizes.length > 0
  const avail = available(p)
  const missing = tried && sized && !size
  const imgs = p.images ?? []
  const n = imgs.length || SHOTS.length

  const panels = [
    ...(p.material ? [{ id: 'mat', title: 'Материал ба арчилгаа', body: p.material }] : []),
    {
      id: 'ship',
      title: 'Хүргэлт ба буцаалт',
      body: `Улаанбаатар хотод ${DELIVERY_TIME} цагт хүргэнэ.\nХүргэлт [${fmt(SHIPPING_FEE)}], [${fmt(FREE_SHIPPING_THRESHOLD)}]-өөс дээш захиалгад үнэгүй.\nШошготой барааг ${RETURN_DAYS} хоногт буцаах боломжтой.`,
    },
  ]

  function onAdd() {
    if (sized && !size) return setTried(true)
    add({ slug: p.slug, color: p.colors[color], size })
    start(() => router.push('/checkout'))
  }

  return (
    <main className="lg:wrap lg:pt-6">
      <Crumbs className="hidden lg:flex pb-6" items={[['Нүүр', '/'], [cat.name, `/category/${cat.slug}`], [p.name]]} />

      <div className="lg:flex lg:flex-wrap lg:gap-x-16 lg:gap-y-10 lg:items-start">
        {/* mobile gallery */}
        <section aria-label="Зургийн цомог" className="lg:hidden">
          <div className="relative">
            {imgs.length ? <Photo p={p} i={shot} className="w-full h-[520px]" /> : <Ph t={SHOTS[shot].t} label={SHOTS[shot].label} className="h-[520px]" />}
            <span className="price absolute top-3.5 right-4 bg-paper px-2 py-1 text-[12px]">{shot + 1} / {n}</span>
            <div className="absolute right-2 bottom-2 flex gap-1">
              <button type="button" className="icon-btn bg-paper" aria-label="Өмнөх зураг" onClick={() => setShot((shot + n - 1) % n)}><ChevronLeft /></button>
              <button type="button" className="icon-btn bg-paper" aria-label="Дараагийн зураг" onClick={() => setShot((shot + 1) % n)}><ChevronRight /></button>
            </div>
          </div>
          <div className="hscroll flex gap-2 px-4 pt-2.5">
            {imgs.length
              ? imgs.map((src, i) => (
                  <button key={src} type="button" aria-label={`${i + 1}-р зураг`} aria-current={i === shot} onClick={() => setShot(i)} className="thumb shrink-0 w-16 h-[84px] overflow-hidden">
                    <Photo p={p} i={i} className="w-full h-full" />
                  </button>
                ))
              : SHOTS.map((s, i) => (
                  <button key={i} type="button" aria-label={`${i + 1}-р зураг`} aria-current={i === shot} onClick={() => setShot(i)} className="thumb shrink-0 w-16 h-[84px]" style={{ background: `var(--color-ph-${s.t})` }} />
                ))}
          </div>
        </section>

        {/* desktop gallery */}
        <section aria-label="Зургийн цомог" className="hidden lg:grid flex-[999_1_560px] min-w-0 grid-cols-2 gap-3">
          {imgs.length ? (
            imgs.map((src, i) => (
              <Photo key={src} p={p} i={i} className={`w-full ${i === 0 || imgs.length === 1 || (i === imgs.length - 1 && imgs.length % 2 === 0) ? 'col-span-2 aspect-[4/5]' : 'aspect-[3/4]'}`} />
            ))
          ) : (
            <>
              <Ph t={2} label="Урдаас, бүтэн биеэр" className="col-span-2 aspect-[4/5]" />
              <Ph t={1} label="Хажуугаас" aria="хажуугаас, хөдөлгөөнтэй" className="aspect-[3/4] !p-3.5" />
              <Ph t={3} label="Араас, бүстэй" className="aspect-[3/4] !p-3.5" />
              <Ph t={1} label="Даавууны бүтэц, ойроос" className="col-span-2 aspect-video" />
            </>
          )}
        </section>

        <section aria-labelledby="pname" className="px-4 pt-6 min-w-0 lg:p-0 lg:flex-[1_1_360px] lg:max-w-[460px] lg:sticky lg:top-6">
          <Crumbs className="lg:hidden" items={[['Нүүр', '/'], [cat.name, `/category/${cat.slug}`]]} />
          <p className="hidden lg:block mb-3 text-[13px] text-muted">Намар — Өвөл 2026</p>
          <h1 id="pname" className="mt-3.5 mb-2 font-display font-semibold uppercase tracking-[.02em] text-[22px] leading-[1.2] lg:mt-0 lg:mb-3 lg:text-[26px]">{p.name}</h1>
          {p.was ? (
            <p className="price flex gap-2 text-[18px] lg:text-[20px]"><span className="text-accent font-semibold">{fmt(p.price)}</span><s className="text-muted">{fmt(p.was)}</s></p>
          ) : (
            <p className="price text-[18px] lg:text-[20px]">{fmt(p.price)}</p>
          )}

          <div className="mt-7 lg:mt-8 lg:pt-5 lg:border-t lg:border-rule">
            <p className="mb-2.5 text-[13px]">Өнгө: <span className="font-semibold">{COLORS[p.colors[color]].label}</span></p>
            <div className="flex gap-2.5">
              {p.colors.map((c, i) => (
                <button key={c} type="button" className="swatch" aria-label={COLORS[c].label} aria-pressed={i === color} onClick={() => setColor(i)} style={{ background: COLORS[c].sw }} />
              ))}
            </div>
          </div>

          {sized && (
            <div className="mt-6">
              <div className="flex justify-between items-center gap-3">
                <p id="size-label" className="text-[13px]">Хэмжээ{size && `: ${size}`}</p>
                <button type="button" className="textbtn" aria-expanded={guide} aria-controls="size-guide" onClick={() => setGuide(!guide)}>Хэмжээний заавар</button>
              </div>
              <div role="group" aria-labelledby="size-label" className="grid grid-cols-5 gap-1.5 mt-1.5">
                {SIZES.map((s) => {
                  const out = !avail.includes(s)
                  return (
                    <button key={s} type="button" className={`pill min-h-12 ${missing && !out ? 'err' : ''}`} disabled={out} aria-label={out ? `${s} — дууссан` : s} aria-pressed={size === s} onClick={() => { setSize(s); setTried(false) }}>
                      {s}
                    </button>
                  )
                })}
              </div>
              {missing && (
                <p role="alert" className="flex items-center gap-1.5 mt-2.5 text-[13px] text-error"><AlertIcon />Сагсанд нэмэхийн өмнө хэмжээгээ сонгоно уу.</p>
              )}
            </div>
          )}

          {sized && guide && (
            <div id="size-guide" className="mt-4 p-4 bg-paper-2 lg:px-[18px]">
              <p className="mb-2.5 text-[13px] font-semibold">Хэмжээний хүснэгт (см)</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px] tabular-nums whitespace-nowrap text-left">
                  <thead>
                    <tr className="[&>th]:py-2 [&>th]:px-1.5 [&>th]:font-medium [&>th]:border-b [&>th]:border-ink">
                      <th scope="col" className="!pl-0">Хэмжээ</th><th scope="col">Цээж</th><th scope="col">Бэлхүүс</th><th scope="col" className="!pr-0">Ташаа</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GUIDE.map(([s, ...cells]) => (
                      <tr key={s} className={`[&>*]:py-2 [&>*]:px-1.5 [&>*]:border-b [&>*]:border-rule ${size === s ? 'bg-paper' : ''}`}>
                        <th scope="row" className="!pl-0 font-semibold">{s}</th>
                        {cells.map((c, i) => <td key={i} className={i === 2 ? '!pr-0' : ''}>{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2.5 text-[12px] leading-[1.5] text-muted">Загвар өмсөгч {MODEL_HEIGHT} см өндөр, S хэмжээ өмссөн. Хоёр хэмжээний дунд байвал томыг нь сонгоорой.</p>
            </div>
          )}

          <div className="mt-6">
            <button type="button" className="btn w-full min-h-14" onClick={onAdd} disabled={pending} aria-busy={pending}>
              {pending ? 'Нэмж байна…' : !sized || size ? `Сагсанд нэмэх · ${fmt(p.price)}` : 'Сагсанд нэмэх'}
            </button>
            <p className="mt-3 text-[13px] leading-[1.5] text-muted">Улаанбаатарт {DELIVERY_TIME} цагт хүргэнэ · Дансаар төлнө, QPay тун удахгүй</p>
          </div>

          {p.desc && <p className="mt-8 text-[15px] leading-[1.7] max-w-[36ch] lg:max-w-none">{p.desc}</p>}

          <div className="mt-6 border-t border-rule">
            {panels.map((pa) => {
              const open = panel === pa.id
              return (
                <div key={pa.id} className="border-b border-rule">
                  <button type="button" id={`acc-${pa.id}`} className="acc" aria-expanded={open} aria-controls={`panel-${pa.id}`} onClick={() => setPanel(open ? null : pa.id)}>
                    {pa.title}{open ? <MinusIcon /> : <PlusIcon />}
                  </button>
                  {open && <p id={`panel-${pa.id}`} role="region" aria-labelledby={`acc-${pa.id}`} className="mb-[18px] text-[14px] leading-[1.7] text-muted whitespace-pre-line">{pa.body}</p>}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {pair.length > 0 && <section aria-labelledby="pair-title" className="px-4 pt-14 pb-[72px] lg:px-0 lg:pt-[140px] lg:pb-[120px] lg:flex lg:flex-wrap lg:gap-x-6 lg:gap-y-8 lg:items-end">
        <div className="min-w-0 lg:flex-[1_1_260px] lg:self-start">
          <h2 id="pair-title" className="mb-[18px] h-section lg:mb-3">Хослуулж өмсөх</h2>
          <p className="hidden lg:block text-[15px] leading-[1.65] text-muted max-w-[30ch]">Энэ загвартай зохицох бусад бараа.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:contents">
          {pair.map((q, i) => {
            const big = i === 1
            return (
              <ProductCard key={q.slug} p={q} layout={big ? { da: '4 / 5' } : {}} className={big ? 'hidden lg:flex lg:flex-[1.4_1_280px]' : 'lg:flex-[1_1_220px]'} />
            )
          })}
        </div>
      </section>}
    </main>
  )
}
