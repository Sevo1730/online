import Link from 'next/link'
import { ADDRESS, BRAND, DELIVERY_TIME, EMAIL, FACEBOOK_URL, FREE_SHIPPING_THRESHOLD, INSTAGRAM_URL, PHONE, RETURN_DAYS } from '@/lib/config'
import { infoHref } from '@/lib/info'
import { CATEGORIES, fmt } from '@/lib/products'

const I = ({ d }: { d: string }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden="true"><path d={d} /></svg>
)
const FEATURES = [
  { icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', title: 'Хүргэлт', text: `Улаанбаатарт ${DELIVERY_TIME} цагт. ${fmt(FREE_SHIPPING_THRESHOLD)}-өөс дээш захиалгад үнэгүй.` },
  { icon: 'M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4', title: 'Буцаалт, солилт', text: `Шошготой барааг ${RETURN_DAYS} хоногийн дотор буцаах, солих боломжтой.` },
  { icon: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z', title: 'Харилцагчийн үйлчилгээ', text: 'Асуулт байвал утас, сошиалаар холбогдоорой.' },
  { icon: 'M6 10V8a6 6 0 0 1 12 0v2M5 10h14v10H5zM12 14v2', title: 'Аюулгүй төлбөр', text: 'Дансаар шилжүүлэх. QPay тун удахгүй.' },
]

const HELP = ['Брэндийн тухай', 'Хүргэлтийн нөхцөл', 'Буцаалт, солилт', 'Хэмжээний заавар', 'Түгээмэл асуулт', 'Үйлчилгээний нөхцөл']
const SOCIAL = [['Instagram', INSTAGRAM_URL], ['Facebook', FACEBOOK_URL]] as const

const colTitle = 'mb-4 text-[13px] font-semibold uppercase tracking-[.08em]'
const colLink = 'inline-flex items-center min-h-8 text-[13px] text-muted hover:text-ink'

export function Footer() {
  return (
    <footer>
      <section aria-label="Үйлчилгээ" className="border-t border-rule">
        <ul className="wrap grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 py-12 lg:py-16">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex flex-col items-center text-center gap-2.5 px-2">
              <I d={f.icon} />
              <h3 className="text-[13px] font-semibold uppercase tracking-[.06em]">{f.title}</h3>
              <p className="text-[12px] leading-[1.6] text-muted max-w-[30ch]">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="bg-paper-2 pt-14 pb-8">
        <div className="wrap grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4 flex flex-col gap-4">
            <p className="wordmark text-[26px]">{BRAND}</p>
            <p className="text-[13px] leading-[1.7] text-muted max-w-[36ch]">Цөөн өнгө, цэвэр зүсэлт, удаан эдлэх материал. Улаанбаатарт бүтээв.</p>
          </div>
          <div className="lg:col-span-2">
            <h3 className={colTitle}>Дэлгүүр</h3>
            <ul>{CATEGORIES.map((c) => <li key={c.slug}><Link href={`/category/${c.slug}`} className={colLink}>{c.name}</Link></li>)}</ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className={colTitle}>Тусламж</h3>
            <ul>{HELP.map((l) => <li key={l}><Link href={infoHref(l) ?? '/'} className={colLink}>{l}</Link></li>)}</ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className={colTitle}>Холбоо барих</h3>
            <ul className="text-[13px] text-muted">{[PHONE, EMAIL, ADDRESS].map((t) => <li key={t} className="min-h-8 flex items-center">{t}</li>)}</ul>
          </div>
          <div className="lg:col-span-2">
            <h3 className={colTitle}>Биднийг дагах</h3>
            <ul>
              {SOCIAL.map(([l, url]) => (
                <li key={l}>{url ? <a href={url} target="_blank" rel="noopener noreferrer" className={colLink}>{l}</a> : <span className={colLink}>{l}</span>}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="wrap mt-12 pt-5 border-t border-rule flex flex-wrap justify-between gap-3 text-[12px] text-muted">
          <span>© 2026 {BRAND}. Бүх эрх хуулиар хамгаалагдсан.</span>
          <span className="flex gap-2">
            {['Дансаар', 'QPay', 'Карт'].map((m) => <span key={m} className="border border-rule bg-paper px-2 py-0.5 text-[11px] font-medium">{m}</span>)}
          </span>
        </div>
      </div>
    </footer>
  )
}
