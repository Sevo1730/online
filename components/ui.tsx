import Link from 'next/link'
import { Fragment } from 'react'
import { COLORS, fmt, tone, type Product } from '@/lib/products'

function I({ size = 20, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }}>
      {children}
    </svg>
  )
}
type S = { size?: number }
export const MenuIcon = ({ size = 22 }: S) => <I size={size}><path d="M3 7h18M3 12h18M3 17h12" /></I>
export const SearchIcon = ({ size = 21 }: S) => <I size={size}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></I>
export const BagIcon = ({ size = 21 }: S) => <I size={size}><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></I>
export const ArrowRight = ({ size = 22 }: S) => <I size={size}><path d="M5 12h14M13 6l6 6-6 6" /></I>
export const ArrowLeft = ({ size = 22 }: S) => <I size={size}><path d="M19 12H5M11 6l-6 6 6 6" /></I>
export const ChevronLeft = ({ size = 18 }: S) => <I size={size}><path d="M15 6l-6 6 6 6" /></I>
export const ChevronRight = ({ size = 18 }: S) => <I size={size}><path d="M9 6l6 6-6 6" /></I>
export const ChevronDown = ({ size = 14 }: S) => <I size={size}><path d="M6 9l6 6 6-6" /></I>
export const CloseIcon = ({ size = 22 }: S) => <I size={size}><path d="M6 6l12 12M18 6L6 18" /></I>
export const PlusIcon = ({ size = 18 }: S) => <I size={size}><path d="M12 5v14M5 12h14" /></I>
export const MinusIcon = ({ size = 18 }: S) => <I size={size}><path d="M5 12h14" /></I>
export const FilterIcon = ({ size = 18 }: S) => <I size={size}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></I>
export const AlertIcon = ({ size = 16 }: S) => <I size={size}><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.5" /></I>

/** Product photo: the uploaded image if there is one, otherwise the tone placeholder block. */
export function Photo({ p, i = 0, className = '', style, eager }: { p: Product; i?: number; className?: string; style?: React.CSSProperties; eager?: boolean }) {
  const src = p.images?.[i]
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage URL, sizes vary
    <img src={src} alt={p.name} loading={eager ? 'eager' : 'lazy'} className={`object-cover ${className}`} style={style} />
  ) : (
    <span role="img" aria-label={`Зураг: ${p.name}`} className={className} style={{ background: tone(p.tone), ...style }} />
  )
}

/** Photo placeholder for editorial spots (hero, banners). */
export function Ph({ t, label, aria, className = '', capClassName = '' }: { t: 1 | 2 | 3; label: string; aria?: string; className?: string; capClassName?: string }) {
  return (
    <span role="img" aria-label={`Зураг: ${aria ?? label}`} className={`ph ${className}`} style={{ background: tone(t) }}>
      <span className={`ph-cap ${capClassName}`}>Зураг · {label}</span>
    </span>
  )
}

export function Crumbs({ items, className = '' }: { items: [string, string?][]; className?: string }) {
  return (
    <nav aria-label="Замын мөр" className={`flex gap-2 text-[13px] text-muted whitespace-nowrap min-w-0 ${className}`}>
      {items.map(([label, href], i) => (
        <Fragment key={label}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {href ? <Link href={href} className="underline underline-offset-3">{label}</Link> : <span aria-current="page" className="overflow-hidden text-ellipsis">{label}</span>}
        </Fragment>
      ))}
    </nav>
  )
}

export type CardLayout = { mc?: string; ma?: string; dc?: string; da?: string; dt?: string }

export function ProductCard({ p, layout = {}, dots, className = '' }: { p: Product; layout?: CardLayout; dots?: boolean; className?: string }) {
  const vars = Object.fromEntries(Object.entries(layout).map(([k, v]) => [`--${k}`, v])) as React.CSSProperties
  return (
    <Link href={`/product/${p.slug}`} className={`card cell flex flex-col gap-2.5 lg:gap-3 min-w-0 ${className}`} style={vars}>
      <span className="ar relative block overflow-hidden" style={{ background: tone(p.tone) }}>
        {p.images?.[0] && <Photo p={p} className="absolute inset-0 w-full h-full" />}
        {!p.images?.[0] && <span role="img" aria-label={`Зураг: ${p.name}`} className="absolute inset-0" />}
        {p.isNew && <span className="absolute top-2.5 left-2.5 bg-ink text-paper px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[.08em] lg:top-3 lg:left-3">Шинэ</span>}
        {p.was && <span className="absolute top-2.5 right-2.5 bg-error text-paper px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[.08em] lg:top-3 lg:right-3">Хямдрал</span>}
      </span>
      <span className="flex flex-col gap-1">
        <span className="nm text-[13px] leading-[1.4] [overflow-wrap:anywhere] min-w-0">{p.name}</span>
        {p.was ? (
          <span className="price flex gap-2 text-[13px]">
            <span className="text-error font-semibold">{fmt(p.price)}</span>
            <s className="text-muted">{fmt(p.was)}</s>
          </span>
        ) : (
          <span className="price text-[13px] font-medium">{fmt(p.price)}</span>
        )}
        {dots && (
          <span role="img" aria-label={`${p.colors.length} өнгөөр байгаа`} className="flex gap-1.5 pt-0.5 lg:hidden">
            {p.colors.map((c) => <span key={c} className="dot size-2.5" style={{ background: COLORS[c].sw }} />)}
          </span>
        )}
      </span>
    </Link>
  )
}
