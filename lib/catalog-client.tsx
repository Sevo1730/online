'use client'
import { createContext, useContext } from 'react'
import type { Product } from './products'

// Server (layout) DB-ээс уншсан барааг client component-уудад (сагс, checkout) дамжуулна.
const Ctx = createContext<Product[]>([])

export function CatalogProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <Ctx.Provider value={products}>{children}</Ctx.Provider>
}

export function useCatalog() {
  const products = useContext(Ctx)
  return { products, bySlug: (slug: string) => products.find((p) => p.slug === slug) }
}
