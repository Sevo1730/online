import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { PRODUCTS, type ColorKey, type Product, type Size } from './products'
import { sb, sbConfigured } from './supabase'

// Supabase-ийн products хүснэгтийн мөр
export type ProductRow = {
  slug: string
  name: string
  price: number
  was: number | null
  is_new: boolean
  category: Product['category']
  colors: ColorKey[]
  sizes: Size[]
  sold_out: Size[]
  rank: number
  tone: 1 | 2 | 3
  description: string | null
  material: string | null
  images: string[]
  active: boolean
  created_at?: string
}

export const fromRow = (r: ProductRow): Product => ({
  slug: r.slug,
  name: r.name,
  price: r.price,
  was: r.was ?? undefined,
  isNew: r.is_new,
  category: r.category,
  colors: r.colors?.length ? r.colors : ['black'],
  sizes: r.sizes ?? [],
  soldOut: r.sold_out ?? [],
  rank: r.rank,
  tone: r.tone,
  desc: r.description ?? undefined,
  material: r.material ?? undefined,
  images: r.images ?? [],
  active: r.active,
})

async function fetchRows(includeInactive: boolean): Promise<ProductRow[]> {
  const filter = includeInactive ? '' : '&active=eq.true'
  return (await sb(`products?select=*${filter}&order=created_at.desc`)).json()
}

/** Сайт дээр харагдах бараанууд (идэвхтэй). 60 секунд cache-лэнэ, admin хадгалахад шууд шинэчлэгдэнэ. */
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    if (!sbConfigured()) return PRODUCTS
    try {
      return (await fetchRows(false)).map(fromRow)
    } catch (e) {
      console.error('getProducts failed, showing built-in products', e)
      return PRODUCTS
    }
  },
  ['products'],
  { tags: ['products'], revalidate: 60 },
)

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug)
}

/** Admin-д: идэвхгүй бараа ч орно, cache-гүй. */
export async function getAllProductRows(): Promise<ProductRow[]> {
  if (!sbConfigured()) throw new Error('Supabase тохируулаагүй байна (.env.local)')
  return fetchRows(true)
}

export async function getProductRow(slug: string): Promise<ProductRow | undefined> {
  return (await (await sb(`products?select=*&slug=eq.${encodeURIComponent(slug)}`)).json())[0]
}

export async function upsertProduct(row: ProductRow) {
  await sb('products?on_conflict=slug', {
    method: 'POST',
    body: JSON.stringify(row),
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  })
  refreshCatalog()
}

export async function deleteProduct(slug: string) {
  await sb(`products?slug=eq.${encodeURIComponent(slug)}`, { method: 'DELETE' })
  refreshCatalog()
}

export function refreshCatalog() {
  revalidateTag('products')
  revalidatePath('/', 'layout')
}
