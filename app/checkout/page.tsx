'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ChevronDown, MinusIcon, PlusIcon } from '@/components/ui'
import { useCart } from '@/lib/cart'
import { useCatalog } from '@/lib/catalog-client'
import { Photo } from '@/components/ui'
import { ADDRESS, BANK_ACCOUNT, BANK_NAME, BRAND, DELIVERY_TIME, FREE_SHIPPING_THRESHOLD, HOURS, SHIPPING_FEE } from '@/lib/config'
import { COLORS, fmt } from '@/lib/products'

const DISTRICTS = ['Баянгол', 'Баянзүрх', 'Сонгинохайрхан', 'Сүхбаатар', 'Хан-Уул', 'Чингэлтэй', 'Налайх', 'Багануур', 'Багахангай']
const SLOTS = [['morn', 'Өглөө', '10:00–14:00'], ['eve', 'Орой', '18:00–22:00']] as const
const PAYS = [
  { id: 'bank', title: 'Дансаар шилжүүлэх', desc: 'Төлбөр орсны дараа захиалга баталгаажна' },
  // QPay / карт холбогдмогц soon-ийг хасаад lib/orders.ts-ийн ENABLED_PAY-д нэмнэ
  { id: 'qpay', title: 'QPay', desc: 'Банкны аппаар QR уншуулж төлнө', tag: 'ТУН УДАХГҮЙ', soon: true },
  { id: 'card', title: 'Төлбөрийн карт', desc: 'Дотоод болон олон улсын карт', tag: 'ТУН УДАХГҮЙ', soon: true },
] as const
type Pay = (typeof PAYS)[number]['id']

const h2 = 'font-display font-bold uppercase tracking-[.02em] text-[20px] leading-[1.05] lg:text-[22px]'
const autoGrid = 'lg:grid lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'

export default function Checkout() {
  const { lines, ready, setQty, remove, clear } = useCart()
  const { bySlug } = useCatalog()
  const [ship, setShip] = useState<'courier' | 'pickup'>('courier')
  const [slot, setSlot] = useState<string>('eve')
  const [pay, setPay] = useState<Pay>('bank')
  const [sending, setSending] = useState(false)
  const [placed, setPlaced] = useState<{ order_no: string; total: number; pay_method: Pay } | null>(null)
  const [error, setError] = useState('')

  const rows = lines.flatMap((l) => { const p = bySlug(l.slug); return p ? [{ ...l, p }] : [] })
  const count = lines.reduce((a, l) => a + l.qty, 0)
  const subtotal = rows.reduce((a, r) => a + r.p.price * r.qty, 0)
  const fee = ship === 'pickup' || subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE
  const total = subtotal + fee
  const empty = ready && lines.length === 0

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setError('')
    const f = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines, ship, pay, slot,
          name: f.get('name'), phone: f.get('phone'),
          district: f.get('district'), khoroo: f.get('khoroo'), address: f.get('address'),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Алдаа гарлаа')
      setPlaced(data)
      clear()
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сүлжээний алдаа. Дахин оролдоно уу.')
    } finally {
      setSending(false)
    }
  }

  const header = (
    <header className="border-b border-rule lg:border-b-[3px] lg:border-double lg:border-ink">
      <div className="grid grid-cols-[88px_minmax(0,1fr)_88px] items-center px-1 py-1.5 lg:flex lg:flex-wrap lg:justify-between lg:gap-x-6 lg:gap-y-3 lg:px-gutter lg:py-5">
        <Link href="/" aria-label="Дэлгүүр үргэлжлүүлэх" className="icon-btn lg:w-auto lg:flex-[1_1_200px] lg:justify-start lg:gap-2 lg:text-[14px] lg:whitespace-nowrap">
          <ArrowLeft /><span className="hidden lg:inline" aria-hidden="true">Дэлгүүр үргэлжлүүлэх</span>
        </Link>
        <Link href="/" className="wordmark justify-self-center text-[23px] lg:text-[40px]">{BRAND}</Link>
        <span className="hidden lg:block lg:flex-[1_1_200px] text-right text-[13px] text-muted">Аюулгүй төлбөр</span>
      </div>
    </header>
  )

  if (placed)
    return (
      <>
        {header}
        <main className="flex flex-col gap-4 px-4 pt-16 pb-20 lg:wrap lg:max-w-[720px] lg:mx-0 lg:gap-[18px] lg:pt-[120px] lg:pb-40">
          <p className="text-[13px] font-semibold text-accent">Захиалга № {placed.order_no}</p>
          <h1 className="font-display font-bold uppercase tracking-[.02em] text-[30px] leading-none lg:text-[clamp(32px,3.6vw,52px)] lg:leading-[.95]">Баярлалаа, захиалга хүлээн авлаа</h1>
          <p className="text-[15px] leading-[1.7] text-muted lg:text-[16px] lg:max-w-[46ch]">
            {placed.pay_method === 'bank'
              ? 'Доорх данс руу шилжүүлсний дараа захиалга баталгаажна. Гүйлгээний утга дээр захиалгын дугаараа заавал бичнэ үү.'
              : 'Захиалгын мэдээллийг мессежээр илгээлээ. Хүргэлтийн ажилтан гарахын өмнө холбогдоно.'}
          </p>
          {placed.pay_method === 'bank' && (
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 p-4 bg-paper-2 text-[14px] leading-[1.6] max-w-[460px]">
              <dt className="text-muted">Банк</dt><dd>{BANK_NAME}</dd>
              <dt className="text-muted">Данс</dt><dd className="tabular-nums">{BANK_ACCOUNT}</dd>
              <dt className="text-muted">Хүлээн авагч</dt><dd>{BRAND} ХХК</dd>
              <dt className="text-muted">Дүн</dt><dd className="price font-semibold">{fmt(placed.total)}</dd>
              <dt className="text-muted">Гүйлгээний утга</dt><dd className="font-semibold">{placed.order_no}</dd>
            </dl>
          )}
          <div className="mt-3 lg:mt-0"><Link href="/" className="btn">Нүүр хуудас руу буцах</Link></div>
        </main>
      </>
    )

  // render function, not a component, so steppers keep focus across re-renders
  const cartList = (small: boolean) => (
    <>
      <ul className="border-b border-rule">
        {rows.map((r, i) => (
          <li key={`${r.slug}-${r.color}-${r.size}`} className={`grid gap-3.5 border-t border-rule ${small ? 'grid-cols-[72px_minmax(0,1fr)] py-3.5' : 'grid-cols-[84px_minmax(0,1fr)] py-4'}`}>
            <Photo p={r.p} className={small ? 'w-[72px] h-24' : 'w-[84px] h-28'} />
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex justify-between gap-2.5">
                <Link href={`/product/${r.slug}`} className="text-[14px] leading-[1.35] [overflow-wrap:anywhere] min-w-0">{r.p.name}</Link>
                <span className="price text-[14px]">{fmt(r.p.price * r.qty)}</span>
              </div>
              <span className="text-[13px] text-muted">{COLORS[r.color].label} · {r.size ?? 'Нэг хэмжээ'}</span>
              <div className="flex justify-between items-center mt-auto">
                <div className="inline-flex items-center border border-rule bg-paper">
                  <button type="button" className="step" aria-label={`${r.p.name}: тоог хасах`} disabled={r.qty <= 1} onClick={() => setQty(i, r.qty - 1)}><MinusIcon size={14} /></button>
                  <span aria-live="polite" className="price min-w-6 text-center text-[14px]">{r.qty}</span>
                  <button type="button" className="step" aria-label={`${r.p.name}: тоог нэмэх`} onClick={() => setQty(i, r.qty + 1)}><PlusIcon size={14} /></button>
                </div>
                <button type="button" className="textbtn text-muted" onClick={() => remove(i)}>Хасах</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {empty && (
        <div className="flex flex-col items-start gap-1 py-6 lg:py-4">
          <p className="text-[15px] lg:text-[14px]">Сагс хоосон байна.</p>
          <Link href="/category/dress" className="link">Даашинз үзэх</Link>
        </div>
      )}
    </>
  )

  const opt = (name: string, checked: boolean, onChange: () => void, title: string, desc: string, right: React.ReactNode) => (
    <label className="opt">
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-medium">{title}</span>
        <span className="text-[13px] leading-[1.5] text-muted">{desc}</span>
      </span>
      {right}
    </label>
  )
  const free = <span className="text-[14px] text-accent">Үнэгүй</span>

  return (
    <>
      {header}
      <main className="lg:wrap lg:pt-12 lg:pb-[120px]">
        <h1 className="hidden lg:block mb-10 font-display font-bold uppercase tracking-[.02em] text-[clamp(32px,3.6vw,52px)] leading-none">Захиалга</h1>

        <section aria-labelledby="cart-title" className="lg:hidden px-4 pt-6 pb-2">
          <h1 id="cart-title" className="mb-1.5 font-display font-bold uppercase tracking-[.02em] text-[30px] leading-none">Сагс</h1>
          <p className="mb-4 text-[13px] text-muted">{count} бараа</p>
          {cartList(false)}
        </section>

        <form onSubmit={submit} className="lg:flex lg:flex-wrap lg:gap-x-20 lg:gap-y-12 lg:items-start">
          <div className="flex flex-col min-w-0 lg:flex-[999_1_520px] lg:gap-14">
            <section aria-labelledby="ship-title" className="px-4 pt-10 pb-2 lg:p-0 lg:border-t lg:border-ink">
              <h2 id="ship-title" className={`${h2} mb-2 lg:mt-4 lg:mb-1`}>Хүргэлт</h2>
              <div role="radiogroup" aria-labelledby="ship-title" className={`border-b border-rule ${autoGrid} lg:gap-x-8`}>
                <div className="border-t border-rule">
                  {opt('ship', ship === 'courier', () => setShip('courier'), 'Хүргэлтээр', `Улаанбаатар хот дотор ${DELIVERY_TIME} цагт`,
                    subtotal >= FREE_SHIPPING_THRESHOLD ? free : <span className="price text-[14px]">[{fmt(SHIPPING_FEE)}]</span>)}
                </div>
                <div className="border-t border-rule">
                  {opt('ship', ship === 'pickup', () => setShip('pickup'), 'Дэлгүүрээс авах', `${ADDRESS} · ${HOURS}`, free)}
                </div>
              </div>

              <div className={`flex flex-col gap-4 pt-5 ${autoGrid} lg:gap-x-5 lg:gap-y-[18px] lg:pt-6`}>
                <label className="field">Нэр<input className="input" name="name" type="text" autoComplete="name" placeholder="Овог, нэр" required /></label>
                <label className="field">Утасны дугаар<input className="input" name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="8 оронтой дугаар" pattern="[0-9]{8}" title="8 оронтой дугаар" required /></label>
                {ship === 'courier' && (
                  <div className="flex flex-col gap-4 lg:col-span-full lg:gap-[18px]">
                    <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-x-5">
                      <label className="field">Дүүрэг
                        <span className="select-wrap">
                          <select className="input appearance-none pr-8" name="district" required defaultValue="">
                            <option value="" disabled>Сонгох</option>
                            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                          </select>
                          <ChevronDown />
                        </span>
                      </label>
                      <label className="field">Хороо<input className="input" name="khoroo" type="text" inputMode="numeric" placeholder="Жишээ: 11" required /></label>
                    </div>
                    <label className="field">Дэлгэрэнгүй хаяг<textarea className="input" name="address" placeholder="Байр, орц, давхар, тоот, орцны код" required /></label>
                    <fieldset>
                      <legend className="pb-2 text-[13px]">Хүргэлтийн цаг</legend>
                      <div className="grid grid-cols-2 gap-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                        {SLOTS.map(([id, title, time]) => (
                          <button key={id} type="button" aria-pressed={slot === id} onClick={() => setSlot(id)}
                            className="pill flex flex-col items-start justify-center gap-0.5 min-h-14 p-2 text-left lg:flex-row lg:justify-between lg:items-center lg:px-3.5">
                            <span className="text-[14px] font-medium">{title}</span>
                            <span className="price text-[12px] lg:text-[13px]">{time}</span>
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>
            </section>

            <section aria-labelledby="pay-title" className="px-4 pt-10 pb-2 lg:p-0 lg:border-t lg:border-ink">
              <h2 id="pay-title" className={`${h2} mb-2 lg:mt-4 lg:mb-1`}>Төлбөр</h2>
              <div role="radiogroup" aria-labelledby="pay-title" className="border-b border-rule">
                {PAYS.map((p) => (
                  <div key={p.id} className="border-t border-rule">
                    {'soon' in p ? (
                      <div className="opt opacity-50" aria-disabled="true">
                        <input type="radio" name="pay" disabled />
                        <span className="flex flex-col gap-1 min-w-0">
                          <span className="text-[15px] font-medium">{p.title}</span>
                          <span className="text-[13px] leading-[1.5] text-muted">{p.desc}</span>
                        </span>
                        <span className="text-[11px] font-semibold tracking-[.04em] text-muted whitespace-nowrap">{p.tag}</span>
                      </div>
                    ) : opt('pay', pay === p.id, () => setPay(p.id), p.title, p.desc, <span />)}
                    {pay === p.id && p.id === 'bank' && (
                      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 mb-[18px] ml-8 p-3.5 bg-paper-2 text-[13px] leading-[1.6] lg:gap-x-4 lg:p-4">
                        <dt className="text-muted">Банк</dt><dd>{BANK_NAME}</dd>
                        <dt className="text-muted">Данс</dt><dd className="tabular-nums">{BANK_ACCOUNT}</dd>
                        <dt className="text-muted">Хүлээн авагч</dt><dd>{BRAND} ХХК</dd>
                        <dt className="text-muted">Гүйлгээний утга</dt><dd>Захиалгын дугаар (захиалсны дараа гарна)</dd>
                      </dl>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside aria-labelledby="sum-title" className="min-w-0 lg:flex-[1_1_340px] lg:max-w-[460px] lg:sticky lg:top-6 lg:bg-paper-2 lg:p-7">
            <div className="hidden lg:block">
              <div className="flex justify-between items-baseline gap-3 mb-[18px]">
                <h2 id="sum-title" className="font-display font-bold uppercase tracking-[.02em] text-[20px] leading-none">Сагс</h2>
                <span className="text-[13px] text-muted">{count} бараа</span>
              </div>
              {cartList(true)}
            </div>

            <section aria-label="Захиалгын дүн" className="mx-4 mt-10 px-4 py-5 bg-paper-2 lg:m-0 lg:mt-5 lg:p-0">
              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-y-2.5 text-[14px] tabular-nums [&>dd]:pl-3">
                <dt>Барааны үнэ</dt><dd className="price text-right">{fmt(subtotal)}</dd>
                <dt>Хүргэлт</dt><dd className={`price text-right ${fee ? '' : 'text-accent'}`}>{fee ? fmt(fee) : 'Үнэгүй'}</dd>
                <dt className="pt-3 border-t border-rule text-[16px] font-semibold lg:text-[17px]">Нийт</dt>
                <dd className="price pt-3 border-t border-rule text-right text-[16px] font-semibold lg:text-[17px]">{fmt(total)}</dd>
              </dl>
              <p className="mt-3 text-[12px] leading-[1.5] text-muted lg:mt-2.5">
                {fee === 0 && subtotal > 0
                  ? 'Үнэгүй хүргэлтийн нөхцөл хангагдсан.'
                  : `${fmt(FREE_SHIPPING_THRESHOLD - subtotal)}-ийн бараа нэмбэл хүргэлт үнэгүй.`}
              </p>
            </section>

            <div className="px-4 pt-5 pb-[72px] lg:p-0 lg:pt-5">
              <button type="submit" className="btn w-full min-h-14 px-6" disabled={!ready || empty || sending} aria-busy={sending}>
                {sending ? 'Илгээж байна…' : `Захиалах · ${fmt(total)}`}
              </button>
              {error && <p role="alert" className="mt-3 text-[13px] text-accent">{error}</p>}
              <p className="mt-3 text-[12px] leading-[1.5] text-muted">
                Баталгаажуулснаар <Link href="/terms" className="underline underline-offset-3">үйлчилгээний нөхцөл</Link>-ийг зөвшөөрнө.
              </p>
            </div>
          </aside>
        </form>
      </main>
    </>
  )
}
