export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL'
export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL']

export const COLORS = {
  black: { label: 'Хар', sw: 'var(--color-sw-black)' },
  white: { label: 'Цагаан', sw: 'var(--color-sw-white)' },
  beige: { label: 'Шаргал', sw: 'var(--color-sw-beige)' },
  brown: { label: 'Бор', sw: 'var(--color-sw-brown)' },
  green: { label: 'Ногоон', sw: 'var(--color-sw-green)' },
  grey: { label: 'Саарал', sw: 'var(--color-sw-grey)' },
} as const
export type ColorKey = keyof typeof COLORS

export const CATEGORIES = [
  { slug: 'new', name: 'Шинэ ирэлт' },
  { slug: 'dress', name: 'Даашинз', desc: 'Өдөр тутмын маалингаас үдшийн торго хүртэл — нэг өнгөөр хослуулахад хялбар.' },
  { slug: 'top', name: 'Цамц' },
  { slug: 'pants', name: 'Өмд' },
  { slug: 'outerwear', name: 'Гадуур хувцас' },
  { slug: 'accessories', name: 'Аксессуар' },
] as const satisfies { slug: string; name: string; desc?: string }[]
export type Category = (typeof CATEGORIES)[number]

export type Product = {
  slug: string
  name: string
  price: number
  was?: number
  isNew?: boolean
  category: Exclude<Category['slug'], 'new'>
  colors: ColorKey[]
  sizes: Size[] // empty = one size
  soldOut?: Size[]
  rank: number // bestseller order
  tone: 1 | 2 | 3
  desc?: string
  material?: string
  images?: string[] // Supabase Storage-ийн public URL-ууд. Хоосон бол placeholder өнгө харагдана
  active?: boolean // false бол сайт дээр харагдахгүй (admin-д харагдана)
}

const ALL: Size[] = SIZES

// Supabase тохируулаагүй үед (эсвэл supabase/seed.sql-ийн эх өгөгдөл) ашиглагдана. Жинхэнэ бараа lib/catalog.ts-ээр DB-ээс уншигдана.
export const PRODUCTS: Product[] = [
  {
    slug: 'tsagaan-maalingan-daashinz', images: ['https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=1200&q=80&auto=format'], name: 'Цагаан маалинган даашинз', price: 149_000, isNew: true, category: 'dress',
    colors: ['white', 'beige'], sizes: ALL, soldOut: ['L'], rank: 1, tone: 2,
    desc: 'Нимгэн, агаар нэвтрүүлдэг маалинган даашинз. Бэлхүүсээрээ бүстэй, өвдөг доогуур урттай. Ганцаар нь эсвэл ноолууран свитертэй давхарлаж өмсөнө.',
    material: '100% маалинга\n30°C-т зөөлөн горимоор угаана\nДунд халуунаар индүүдэнэ',
  },
  { slug: 'khongor-torgon-daashinz', images: ['https://images.unsplash.com/photo-1562151270-c7d22ceb586a?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1549298222-1c31e8915347?w=1200&q=80&auto=format'], name: 'Хонгор торгон даашинз', price: 189_000, category: 'dress', colors: ['brown', 'black'], sizes: ['S', 'M', 'L'], rank: 3, tone: 1 },
  { slug: 'urt-khantsuitai-suljmel-daashinz', images: ['https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1645996830739-8fe3df27c33f?w=1200&q=80&auto=format'], name: 'Урт ханцуйтай сүлжмэл даашинз', price: 169_000, category: 'dress', colors: ['grey', 'green'], sizes: ALL, rank: 6, tone: 3 },
  { slug: 'khar-trikotazh-daashinz', images: ['https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1541130292430-a832637ddc0d?w=1200&q=80&auto=format'], name: 'Хар трикотаж даашинз', price: 99_000, was: 129_000, category: 'dress', colors: ['black'], sizes: ['S', 'M', 'L', 'XL'], rank: 2, tone: 2 },
  { slug: 'plisse-torgon-daashinz', images: ['https://images.unsplash.com/photo-1553544260-f87e671974ee?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=1200&q=80&auto=format'], name: 'Плиссе торгон даашинз', price: 209_000, isNew: true, category: 'dress', colors: ['green', 'black'], sizes: ['XS', 'S', 'M'], rank: 9, tone: 1 },
  { slug: 'undur-zakhtai-nooluuran-daashinz', images: ['https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1768595583026-01106c88aa10?w=1200&q=80&auto=format'], name: 'Өндөр захтай ноолууран даашинз', price: 289_000, isNew: true, category: 'dress', colors: ['beige', 'grey'], sizes: ['S', 'M', 'L', 'XL'], rank: 5, tone: 3 },
  { slug: 'nooson-tsamts-daashinz', images: ['https://images.unsplash.com/photo-1549298222-1c31e8915347?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1761637322362-113b4f6c633c?w=1200&q=80&auto=format'], name: 'Ноосон цамц-даашинз', price: 159_000, category: 'dress', colors: ['grey'], sizes: ['M', 'L', 'XL'], rank: 10, tone: 2 },
  { slug: 'bustei-khuvun-daashinz', images: ['https://images.unsplash.com/photo-1645996830739-8fe3df27c33f?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=1200&q=80&auto=format'], name: 'Бүстэй хөвөн даашинз', price: 119_000, category: 'dress', colors: ['white', 'black'], sizes: ['XS', 'S', 'M', 'L'], rank: 4, tone: 1 },
  { slug: 'maalingan-urt-daashinz', images: ['https://images.unsplash.com/photo-1541130292430-a832637ddc0d?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1562151270-c7d22ceb586a?w=1200&q=80&auto=format'], name: 'Маалинган урт даашинз', price: 159_000, category: 'dress', colors: ['beige'], sizes: ['S', 'M', 'L', 'XL'], rank: 7, tone: 3 },
  { slug: 'tsetsegtei-shifon-daashinz', images: ['https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1596993100471-c3905dafa78e?w=1200&q=80&auto=format'], name: 'Цэцэгтэй шифон даашинз', price: 139_000, category: 'dress', colors: ['black', 'white'], sizes: ['XS', 'S', 'M'], rank: 8, tone: 2 },
  { slug: 'torgon-tsamts-suudr', images: ['https://images.unsplash.com/photo-1768595583026-01106c88aa10?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=1200&q=80&auto=format'], name: 'Торгон цамц «Сүүдэр»', price: 89_000, category: 'top', colors: ['black', 'white'], sizes: ALL, rank: 11, tone: 1 },
  { slug: 'urgun-shuluun-umd', images: ['https://images.unsplash.com/photo-1761637322362-113b4f6c633c?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1553544260-f87e671974ee?w=1200&q=80&auto=format'], name: 'Өргөн шулуун өмд', price: 119_000, category: 'pants', colors: ['beige', 'black'], sizes: ALL, rank: 12, tone: 3 },
  { slug: 'nooluuran-palto', images: ['https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1541130292430-a832637ddc0d?w=1200&q=80&auto=format'], name: 'Ноолууран пальто «Үүрийн гэгээ»', price: 489_000, category: 'outerwear', colors: ['beige', 'grey'], sizes: ['S', 'M', 'L'], rank: 13, tone: 3 },
  { slug: 'suljmel-nooluuran-oroolt', images: ['https://images.unsplash.com/photo-1553544260-f87e671974ee?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1604284195847-88dc4b5a9faa?w=1200&q=80&auto=format'], name: 'Сүлжмэл ноолууран ороолт', price: 79_000, category: 'accessories', colors: ['beige', 'grey'], sizes: [], rank: 14, tone: 1 },
  { slug: 'tsemben-kurtik', images: ['https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1768595583026-01106c88aa10?w=1200&q=80&auto=format'], name: 'Цэмбэн куртик', price: 229_000, category: 'outerwear', colors: ['brown'], sizes: ['XS', 'S', 'M', 'L'], rank: 15, tone: 2 },
  { slug: 'arisan-narin-bus', images: ['https://images.unsplash.com/photo-1549298222-1c31e8915347?w=1200&q=80&auto=format', 'https://images.unsplash.com/photo-1761637322362-113b4f6c633c?w=1200&q=80&auto=format'], name: 'Арьсан нарийн бүс', price: 59_000, category: 'accessories', colors: ['black', 'brown'], sizes: [], rank: 16, tone: 3 },
]

export const fmt = (n: number) => n.toLocaleString('en-US') + '₮'
export const tone = (n: 1 | 2 | 3) => `var(--color-ph-${n})`
export const available = (p: Product) => p.sizes.filter((s) => !p.soldOut?.includes(s))
export const inCategory = (list: Product[], slug: string) =>
  list.filter((p) => (slug === 'new' ? p.isNew : p.category === slug))

// ponytail: Mongolian ablative suffix by the spoken last digit; right for 1–19, extend for 20+.
const ABL = ['аас', 'ээс', 'оос', 'аас', 'өөс', 'аас', 'аас', 'оос', 'аас', 'өөс']
export const ablative = (n: number) => `${n}-${ABL[n % 10]}`
