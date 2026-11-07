import { NextResponse } from 'next/server'
import { buildOrder, saveOrder, type OrderInput } from '@/lib/orders'

export async function POST(req: Request) {
  let input: OrderInput
  try {
    input = await req.json()
  } catch {
    return NextResponse.json({ error: 'Хүсэлт буруу' }, { status: 400 })
  }
  const order = await buildOrder(input)
  if (typeof order === 'string') return NextResponse.json({ error: order }, { status: 400 })
  try {
    await saveOrder(order)
  } catch (e) {
    console.error('saveOrder failed', e)
    const detail = process.env.NODE_ENV !== 'production' && e instanceof Error ? e.message : undefined // зөвхөн local-д
    return NextResponse.json({ error: 'Захиалга хадгалахад алдаа гарлаа. Дахин оролдоно уу.', detail }, { status: 500 })
  }
  return NextResponse.json({ order_no: order.order_no, total: order.total, pay_method: order.pay_method })
}
