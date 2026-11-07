import { promises as fs } from 'fs'
import path from 'path'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './config'
import { getProducts } from './catalog'
import { available, COLORS, type ColorKey, type Size } from './products'
import { sb, sbConfigured } from './supabase'

export type PayMethod = 'bank' | 'qpay' | 'card'
export type OrderLine = { slug: string; name: string; color: ColorKey; size: Size | null; qty: number; price: number }
export type Order = {
  order_no: string
  status: 'pending_payment' | 'paid' | 'shipped' | 'cancelled'
  pay_method: PayMethod
  ship_method: 'courier' | 'pickup'
  customer_name: string
  phone: string
  district: string | null
  khoroo: string | null
  address: string | null
  slot: string | null
  items: OrderLine[]
  subtotal: number
  shipping_fee: number
  total: number
  created_at: string
}

export type OrderInput = {
  lines: { slug: string; color: string; size: string | null; qty: number }[]
  ship: 'courier' | 'pickup'
  pay: PayMethod
  name: string
  phone: string
  district?: string
  khoroo?: string
  address?: string
  slot?: string
}

const ENABLED_PAY: PayMethod[] = ['bank'] // QPay, карт холбогдмогц энд нэмнэ

/** Validate input and compute prices on the server — never trust prices from the browser. */
export async function buildOrder(input: OrderInput): Promise<Order | string> {
  if (!ENABLED_PAY.includes(input.pay)) return 'Энэ төлбөрийн хэлбэр одоогоор боломжгүй'
  if (input.ship !== 'courier' && input.ship !== 'pickup') return 'Хүргэлтийн хэлбэр буруу'
  const name = String(input.name ?? '').trim().slice(0, 100)
  const phone = String(input.phone ?? '').trim()
  if (!name) return 'Нэрээ оруулна уу'
  if (!/^[0-9]{8}$/.test(phone)) return 'Утасны дугаар 8 оронтой байх ёстой'
  if (input.ship === 'courier' && (!input.district || !input.khoroo || !input.address?.trim())) return 'Хүргэлтийн хаягаа бүрэн оруулна уу'
  if (!Array.isArray(input.lines) || input.lines.length === 0 || input.lines.length > 50) return 'Сагс хоосон байна'

  const catalog = await getProducts()
  const items: OrderLine[] = []
  for (const l of input.lines) {
    const p = catalog.find((x) => x.slug === l.slug)
    if (!p) return 'Бараа олдсонгүй'
    if (!(l.color in COLORS) || !p.colors.includes(l.color as ColorKey)) return `${p.name}: өнгө буруу`
    const size = (l.size ?? null) as Size | null
    if (p.sizes.length ? !size || !available(p).includes(size) : size !== null) return `${p.name}: хэмжээ дууссан эсвэл буруу`
    const qty = Math.floor(Number(l.qty))
    if (!(qty >= 1 && qty <= 20)) return `${p.name}: тоо ширхэг буруу`
    items.push({ slug: p.slug, name: p.name, color: l.color as ColorKey, size, qty, price: p.price })
  }

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0)
  const shipping_fee = input.ship === 'pickup' || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const now = new Date()
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return {
    order_no: `${ymd}-${rand}`,
    status: 'pending_payment',
    pay_method: input.pay,
    ship_method: input.ship,
    customer_name: name,
    phone,
    district: input.ship === 'courier' ? String(input.district).slice(0, 50) : null,
    khoroo: input.ship === 'courier' ? String(input.khoroo).slice(0, 10) : null,
    address: input.ship === 'courier' ? String(input.address).trim().slice(0, 500) : null,
    slot: input.ship === 'courier' ? String(input.slot ?? '').slice(0, 20) : null,
    items,
    subtotal,
    shipping_fee,
    total: subtotal + shipping_fee,
    created_at: now.toISOString(),
  }
}

// ---- Storage: Supabase if configured, otherwise a local JSON file (dev only) ----
const FILE = path.join(process.cwd(), 'data', 'orders.json')

export const storageMode = () => (sbConfigured() ? 'supabase' : 'file')

async function readFile(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'))
  } catch {
    return []
  }
}

export async function saveOrder(o: Order) {
  if (storageMode() === 'supabase') {
    await sb('orders', { method: 'POST', body: JSON.stringify(o), headers: { Prefer: 'return=minimal' } })
    return
  }
  const all = await readFile()
  all.push(o)
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(all, null, 2))
}

export async function listOrders(): Promise<Order[]> {
  if (storageMode() === 'supabase') return (await sb('orders?select=*&order=created_at.desc&limit=200')).json()
  return (await readFile()).reverse()
}

export async function setStatus(order_no: string, status: Order['status']) {
  if (storageMode() === 'supabase') {
    await sb(`orders?order_no=eq.${encodeURIComponent(order_no)}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    return
  }
  const all = await readFile()
  const o = all.find((x) => x.order_no === order_no)
  if (o) o.status = status
  await fs.writeFile(FILE, JSON.stringify(all, null, 2))
}
