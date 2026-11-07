import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin'
import { getProductRow, type ProductRow } from '@/lib/catalog'
import { CATEGORIES, COLORS, SIZES } from '@/lib/products'
import { removeProduct, saveProduct } from '../actions'
import { ImagePicker } from './ImagePicker'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ error?: string }> }

const EMPTY: ProductRow = {
  slug: '', name: '', price: 0, was: null, is_new: true, category: 'dress', colors: [], sizes: [...SIZES], sold_out: [],
  rank: 100, tone: 1, description: '', material: '', images: [], active: true,
}

const box = 'flex flex-wrap gap-2'
const chk = 'inline-flex items-center gap-2 min-h-10 px-3 border border-rule cursor-pointer text-[14px] has-[:checked]:border-ink has-[:checked]:bg-paper-2'

export default async function EditProduct({ params, searchParams }: Props) {
  await requireAdmin()
  const { slug } = await params
  const { error } = await searchParams
  const isNew = slug === 'new'
  const r = isNew ? EMPTY : await getProductRow(slug)
  if (!r) notFound()

  return (
    <main className="wrap py-10 max-w-[760px]">
      <Link href="/admin/products" className="text-[13px] text-muted underline">← Бараа</Link>
      <h1 className="mt-4 mb-8 font-display font-bold uppercase tracking-[.02em] text-[28px] leading-none">{isNew ? 'Шинэ бараа' : r.name}</h1>
      {error && <p role="alert" className="mb-6 p-3 bg-paper-2 text-[14px] text-error">{error}</p>}

      <form action={saveProduct} className="flex flex-col gap-6">
        <input type="hidden" name="existing_slug" value={isNew ? '' : r.slug} />

        <label className="field">Нэр *<input className="input" name="name" defaultValue={r.name} required maxLength={120} placeholder="Жишээ: Ноолууран свитер «Өглөө»" /></label>

        <div className="grid grid-cols-2 gap-4">
          <label className="field">Үнэ (₮) *<input className="input" name="price" type="number" min={0} step={1000} defaultValue={r.price || ''} required /></label>
          <label className="field">Хуучин үнэ (₮) <span className="text-muted text-[12px]">— хямдралтай бол</span><input className="input" name="was" type="number" min={0} step={1000} defaultValue={r.was ?? ''} /></label>
        </div>

        <label className="field">Ангилал *
          <select className="input" name="category" defaultValue={r.category} required>
            {CATEGORIES.filter((c) => c.slug !== 'new').map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>

        <fieldset>
          <legend className="mb-2 text-[13px]">Өнгө *</legend>
          <div className={box}>
            {(Object.keys(COLORS) as (keyof typeof COLORS)[]).map((c) => (
              <label key={c} className={chk}>
                <input type="checkbox" name="colors" value={c} defaultChecked={r.colors.includes(c)} />
                <span className="dot size-4" style={{ background: COLORS[c].sw }} />{COLORS[c].label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-[13px]">Хэмжээ <span className="text-muted">— алийг нь ч сонгохгүй бол «Нэг хэмжээ»</span></legend>
          <div className={box}>
            {SIZES.map((s) => (
              <label key={s} className={chk}><input type="checkbox" name="sizes" value={s} defaultChecked={r.sizes.includes(s)} />{s}</label>
            ))}
          </div>
          <p className="mt-3 mb-2 text-[13px]">Дууссан хэмжээ</p>
          <div className={box}>
            {SIZES.map((s) => (
              <label key={s} className={chk}><input type="checkbox" name="sold_out" value={s} defaultChecked={r.sold_out.includes(s)} />{s}</label>
            ))}
          </div>
        </fieldset>

        <ImagePicker existing={r.images} />

        <label className="field">Тайлбар<textarea className="input min-h-28" name="description" defaultValue={r.description ?? ''} placeholder="Загвар, урт, хэрхэн өмсөх..." /></label>
        <label className="field">Материал ба арчилгаа <span className="text-muted text-[12px]">— мөр бүрт нэг</span><textarea className="input min-h-24" name="material" defaultValue={r.material ?? ''} placeholder={'100% ноолуур\n30°C-т гараар угаана'} /></label>

        <div className="flex flex-wrap gap-2">
          <label className={chk}><input type="checkbox" name="active" defaultChecked={r.active} />Сайт дээр харуулах</label>
          <label className={chk}><input type="checkbox" name="is_new" defaultChecked={r.is_new} />«Шинэ» тэмдэгтэй</label>
          <label className={`${chk} gap-3`}>Эрэмбэ<input className="input !min-h-8 w-20" name="rank" type="number" defaultValue={r.rank} title="Бага тоо = «Их захиалагдсан» хэсэгт эхэнд" /></label>
        </div>

        <button type="submit" className="btn min-h-14">{isNew ? 'Нэмэх' : 'Хадгалах'}</button>
      </form>

      {!isNew && (
        <form action={removeProduct} className="mt-10 pt-6 border-t border-rule">
          <input type="hidden" name="slug" value={r.slug} />
          <p className="mb-2 text-[13px] text-muted">Түр нуух бол «Сайт дээр харуулах»-ыг болиулахад хангалттай. Устгавал зургууд нь хамт устна.</p>
          <button type="submit" className="btn-line text-error">Бараа устгах</button>
        </form>
      )}
    </main>
  )
}
