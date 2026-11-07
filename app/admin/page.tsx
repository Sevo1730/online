import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin'
import { listOrders, setStatus, storageMode, type Order } from '@/lib/orders'
import { COLORS, fmt } from '@/lib/products'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Захиалгууд' }

const STATUS: Record<Order['status'], string> = {
  pending_payment: 'Төлбөр хүлээгдэж буй',
  paid: 'Төлөгдсөн',
  shipped: 'Хүргэгдсэн',
  cancelled: 'Цуцалсан',
}

async function update(form: FormData) {
  'use server'
  await requireAdmin()
  await setStatus(String(form.get('order_no')), String(form.get('status')) as Order['status'])
  revalidatePath('/admin')
}

export default async function Admin() {
  await requireAdmin()
  const orders = await listOrders()

  return (
    <main className="wrap py-12">
      <div className="flex flex-wrap justify-between items-baseline gap-3 mb-8">
        <h1 className="font-display font-bold uppercase tracking-[.02em] text-[30px] leading-none">Захиалгууд</h1>
        <span className="text-[13px] text-muted">{orders.length} захиалга · хадгалалт: {storageMode() === 'supabase' ? 'Supabase' : 'data/orders.json (local)'}</span>
      </div>
      {orders.length === 0 && <p className="text-muted">Одоогоор захиалга алга.</p>}
      <div className="flex flex-col gap-4">
        {orders.map((o) => (
          <section key={o.order_no} className="border border-rule p-5 bg-paper-2">
            <div className="flex flex-wrap justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold">№ {o.order_no}</p>
                <p className="text-[13px] text-muted">{new Date(o.created_at).toLocaleString('mn-MN')}</p>
              </div>
              <form action={update} className="flex gap-2 items-center">
                <input type="hidden" name="order_no" value={o.order_no} />
                <select name="status" defaultValue={o.status} className="select">
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button className="btn-line" type="submit">Хадгалах</button>
              </form>
            </div>
            <p className="text-[14px]">{o.customer_name} · {o.phone}</p>
            <p className="text-[14px] text-muted">
              {o.ship_method === 'pickup' ? 'Дэлгүүрээс авна' : `${o.district}, ${o.khoroo}-р хороо, ${o.address} · ${o.slot === 'morn' ? 'Өглөө' : 'Орой'}`}
            </p>
            <ul className="mt-3 text-[14px]">
              {o.items.map((i, n) => (
                <li key={n}>{i.name} · {COLORS[i.color]?.label ?? i.color} · {i.size ?? 'Нэг хэмжээ'} × {i.qty} — {fmt(i.price * i.qty)}</li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">Нийт {fmt(o.total)} <span className="font-normal text-muted text-[13px]">(хүргэлт {fmt(o.shipping_fee)}, {o.pay_method === 'bank' ? 'дансаар' : o.pay_method})</span></p>
          </section>
        ))}
      </div>
    </main>
  )
}
