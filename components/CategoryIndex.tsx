'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Ph } from './ui'

const CATS = [
  { slug: 'dress', name: 'Даашинз', t: 2, label: 'Маалинган даашинз, гадаа' },
  { slug: 'top', name: 'Цамц', t: 1, label: 'Торгон цамц, ойроос' },
  { slug: 'pants', name: 'Өмд', t: 3, label: 'Өргөн шулуун өмд, алхаж буй' },
  { slug: 'outerwear', name: 'Гадуур хувцас', t: 2, label: 'Ноолууран пальто, цасан дунд' },
  { slug: 'accessories', name: 'Аксессуар', t: 1, label: 'Ороолт, бүс, цүнх' },
] as const

export function CategoryIndex() {
  const [active, setActive] = useState(0)
  const a = CATS[active]
  return (
    <section aria-labelledby="cat-title" className="px-4 pb-16 lg:wrap lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pb-[140px]">
      <div className="lg:col-[1/8] min-w-0">
        <h2 id="cat-title" className="mb-4 font-display font-medium text-[34px] leading-[1.05] lg:mb-6 lg:font-body lg:text-[13px] lg:font-semibold">Ангилал</h2>
        <ul className="border-b border-rule">
          {CATS.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`grid grid-cols-[56px_minmax(0,1fr)_24px] gap-4 items-center py-3 border-t border-rule lg:flex lg:justify-between lg:gap-6 lg:py-[18px] ${i === active ? 'lg:text-accent' : ''}`}
              >
                <span aria-hidden="true" className="w-14 h-[72px] lg:hidden" style={{ background: `var(--color-ph-${c.t})` }} />
                <span className="font-display font-medium text-[30px] leading-[1.05] lg:text-[clamp(40px,5vw,72px)] lg:leading-none [overflow-wrap:anywhere] min-w-0">{c.name}</span>
                <ArrowRight />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Ph t={a.t} label={a.label} className="hidden lg:flex lg:col-[9/13] self-start sticky top-6 mt-10 aspect-[3/4]" />
    </section>
  )
}
