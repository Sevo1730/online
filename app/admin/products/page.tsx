import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import { getAllProductRows, type ProductRow } from '@/lib/catalog'
import { CATEGORIES, fmt, tone } from '@/lib/products'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Бараа' }

export default async function Products({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  await requireAdmin()
  const { saved, deleted } = await searchParams
  let rows: ProductRow[] = []
  let error = ''
  try {
    rows = await getAllProductRows()
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  return (
    <main className="wrap py-12">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <h1 className="font-display font-bold uppercase tracking-[.02em] text-[30px] leading-none">Бараа <span className="text-[20px] text-muted">({rows.length})</span></h1>
        <Link href="/admin/products/new" className="btn">+ Шинэ бараа</Link>
      </div>
      {saved && <p role="status" className="mb-6 p-3 bg-paper-2 text-[14px]">✅ Хадгалагдлаа: <Link className="underline" href={`/product/${saved}`}>сайт дээр харах</Link></p>}
      {deleted && <p role="status" className="mb-6 p-3 bg-paper-2 text-[14px]">🗑 Устгагдлаа</p>}
      {error && (
        <div role="alert" className="mb-6 p-4 bg-paper-2 text-[14px]">
          <p className="font-semibold">Бараа уншиж чадсангүй</p>
          <p className="text-muted break-all">{error}</p>
          <p className="mt-2">Supabase SQL Editor дээр <code>supabase/schema.sql</code>, дараа нь <code>supabase/seed.sql</code>-ийг ажиллуулна уу.</p>
        </div>
      )}
      {!error && rows.length === 0 && <p className="text-muted">Бараа алга. «Шинэ бараа» дарж нэмнэ үү.</p>}
      <ul className="border-t border-rule">
        {rows.map((r) => (
          <li key={r.slug} className="border-b border-rule">
            <Link href={`/admin/products/${r.slug}`} className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-4 items-center py-3 hover:bg-paper-2">
              {r.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.images[0]} alt="" className="w-14 h-[72px] object-cover" />
              ) : (
                <span className="w-14 h-[72px] block" style={{ background: tone(r.tone) }} />
              )}
              <span className="min-w-0">
                <span className="block text-[15px] font-medium">{r.name} {!r.active && <span className="ml-1 text-[11px] text-muted border border-rule px-1.5 py-0.5">Нуугдсан</span>}{r.is_new && <span className="ml-1 text-[11px] text-accent">Шинэ</span>}</span>
                <span className="block text-[13px] text-muted">{CATEGORIES.find((c) => c.slug === r.category)?.name} · {r.images.length} зураг · {r.sizes.length ? r.sizes.join(' ') : 'Нэг хэмжээ'}</span>
              </span>
              <span className="price text-[14px] text-right">{fmt(r.price)}{r.was && <s className="block text-muted text-[12px]">{fmt(r.was)}</s>}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
