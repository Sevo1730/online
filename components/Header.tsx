'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ANNOUNCEMENTS, BRAND } from '@/lib/config'
import { CATEGORIES } from '@/lib/products'
import { useCart } from '@/lib/cart'
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from './ui'

function Announcement() {
  // Duplicated once so the -50% translate loops seamlessly
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS]
  return (
    <div className="bg-ink text-paper overflow-hidden" aria-label="Мэдээлэл">
      <div className="marquee py-2">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0" aria-hidden={k === 1}>
            {items.map((t, i) => (
              <li key={i} className="px-10 text-[12px] font-medium tracking-[.06em] whitespace-nowrap">{t}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export function Header({ active }: { home?: boolean; active?: string }) {
  const path = usePathname()
  const { count } = useCart()
  const [menu, setMenu] = useState(false)

  const nav = CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name, slug: c.slug }))
  const isActive = (href: string, slug: string) => path === href || active === slug

  return (
    <>
      <Announcement />
      <header className="sticky top-0 z-30 bg-paper border-b border-rule">
        <div className="wrap grid grid-cols-[1fr_auto_1fr] lg:grid-cols-[auto_1fr_auto] items-center gap-4 min-h-[64px]">
          {/* left: menu (mobile) / logo (desktop) */}
          <div className="flex items-center lg:hidden">
            <button type="button" className="icon-btn -ml-2.5" aria-label={menu ? 'Цэс хаах' : 'Цэс нээх'} aria-expanded={menu} aria-controls="m-menu" onClick={() => setMenu(!menu)}>
              {menu ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
          <Link href="/" className="wordmark text-[20px] lg:text-[24px] justify-self-center lg:justify-self-start">{BRAND}</Link>

          {/* center nav (desktop) */}
          <nav aria-label="Ангилал" className="hidden lg:flex justify-center gap-9">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined} className={`navlink ${isActive(n.href, n.slug) ? 'is-active' : ''}`}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* right icons */}
          <div className="flex justify-end items-center -mr-2.5">
            <Link href="/search" className="icon-btn" aria-label="Хайх"><SearchIcon /></Link>
            <Link href="/checkout" className="icon-btn" aria-label={`Сагс, ${count} бараа`}>
              <BagIcon />
              {count > 0 && (
                <span className="absolute top-[6px] right-[4px] min-w-4 h-4 px-1 rounded-full bg-ink text-paper text-[10px] leading-4 text-center font-semibold">{count}</span>
              )}
            </Link>
          </div>
        </div>

        {/* mobile: horizontal category strip */}
        <nav aria-label="Ангилал" className="lg:hidden hscroll flex gap-6 px-4 border-t border-rule">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`navlink ${isActive(n.href, n.slug) ? 'is-active' : ''}`}>{n.label}</Link>
          ))}
        </nav>

        {menu && (
          <nav id="m-menu" aria-label="Цэс" className="lg:hidden absolute inset-x-0 top-full bg-paper border-b border-rule px-4 pb-4">
            <ul>
              {nav.map((n) => (
                <li key={n.href} className="border-b border-rule">
                  <Link href={n.href} onClick={() => setMenu(false)} className="flex items-center min-h-14 text-[15px] font-medium uppercase tracking-[.06em]">{n.label}</Link>
                </li>
              ))}
              <li><Link href="/search" onClick={() => setMenu(false)} className="flex items-center min-h-14 text-[15px]">Хайх</Link></li>
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}
