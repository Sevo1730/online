'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCatalog } from './catalog-client'
import type { ColorKey, Size } from './products'

export type Line = { slug: string; color: ColorKey; size: Size | null; qty: number }

type Cart = {
  lines: Line[]
  ready: boolean
  count: number
  add: (l: Omit<Line, 'qty'>) => void
  setQty: (i: number, qty: number) => void
  remove: (i: number) => void
  clear: () => void
}

const Ctx = createContext<Cart | null>(null)
const KEY = 'cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const [ready, setReady] = useState(false)
  const { bySlug } = useCatalog()

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Line[]
      if (Array.isArray(saved)) setLines(saved.filter((l) => bySlug(l?.slug) && l.qty >= 1))
    } catch {}
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {}
  }, [lines, ready])

  const cart: Cart = {
    lines,
    ready,
    count: lines.reduce((a, l) => a + l.qty, 0),
    add: (l) =>
      setLines((ls) => {
        const i = ls.findIndex((x) => x.slug === l.slug && x.color === l.color && x.size === l.size)
        return i < 0 ? [...ls, { ...l, qty: 1 }] : ls.map((x, j) => (j === i ? { ...x, qty: x.qty + 1 } : x))
      }),
    setQty: (i, qty) => setLines((ls) => ls.map((x, j) => (j === i ? { ...x, qty: Math.max(1, qty) } : x))),
    remove: (i) => setLines((ls) => ls.filter((_, j) => j !== i)),
    clear: () => setLines([]),
  }
  return <Ctx.Provider value={cart}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
