'use server'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/admin'
import { deleteProduct, getProductRow, upsertProduct, type ProductRow } from '@/lib/catalog'
import { CATEGORIES, COLORS, SIZES, type ColorKey, type Size } from '@/lib/products'
import { deleteImages, uploadImage } from '@/lib/supabase'

const MAX_IMAGES = 8
const MAX_BYTES = 5 * 1024 * 1024

// Монгол кирилл → латин (URL-д)
const TR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh',
  ъ: '', ы: 'y', ь: 'i', э: 'e', ю: 'yu', я: 'ya',
}
const slugify = (s: string) =>
  [...s.toLowerCase()].map((c) => TR[c] ?? c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'baraa'

const fail = (slug: string, msg: string): never => redirect(`/admin/products/${slug || 'new'}?error=${encodeURIComponent(msg)}`)

export async function saveProduct(form: FormData) {
  await requireAdmin()
  const existingSlug = String(form.get('existing_slug') ?? '')
  const name = String(form.get('name') ?? '').trim().slice(0, 120)
  const price = Math.round(Number(form.get('price')))
  const wasRaw = String(form.get('was') ?? '').trim()
  const was = wasRaw ? Math.round(Number(wasRaw)) : null
  const category = String(form.get('category')) as ProductRow['category']
  const colors = form.getAll('colors').map(String).filter((c): c is ColorKey => c in COLORS)
  const sizes = SIZES.filter((s) => form.getAll('sizes').includes(s))
  const sold_out = sizes.filter((s) => form.getAll('sold_out').includes(s)) as Size[]
  const rank = Math.round(Number(form.get('rank') || 100))

  if (!name) fail(existingSlug, 'Нэрээ оруулна уу')
  if (!(price >= 0)) fail(existingSlug, 'Үнэ буруу байна')
  if (was !== null && !(was > price)) fail(existingSlug, 'Хуучин үнэ одоогийн үнээс их байх ёстой')
  if (category === ('new' as string) || !CATEGORIES.some((c) => c.slug === category)) fail(existingSlug, 'Ангиллаа сонгоно уу')
  if (!colors.length) fail(existingSlug, 'Дор хаяж нэг өнгө сонгоно уу')

  const before = existingSlug ? await getProductRow(existingSlug) : undefined
  let slug = existingSlug
  if (!slug) {
    const base = slugify(name)
    slug = base
    for (let n = 2; await getProductRow(slug); n++) slug = `${base}-${n}`
  }

  // Зураг: үлдээх гэж чагталсан хуучин зураг + шинээр байршуулсан
  const keep = form.getAll('keep_images').map(String).filter((u) => before?.images.includes(u))
  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0)
  if (keep.length + files.length > MAX_IMAGES) fail(existingSlug, `Нэг бараанд ${MAX_IMAGES}-аас олон зураг оруулах боломжгүй`)
  const uploaded: string[] = []
  for (const [i, f] of files.entries()) {
    if (!f.type.startsWith('image/')) fail(existingSlug, `${f.name}: зөвхөн зураг оруулна уу`)
    if (f.size > MAX_BYTES) fail(existingSlug, `${f.name}: 5MB-аас бага зураг оруулна уу`)
    const ext = (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5)
    try {
      uploaded.push(await uploadImage(`${slug}/${Date.now()}-${i}.${ext}`, f))
    } catch (e) {
      console.error(e)
      fail(existingSlug, 'Зураг байршуулахад алдаа гарлаа. Storage bucket үүссэн эсэхийг шалгана уу.')
    }
  }
  const mainFirst = String(form.get('main_image') ?? '')
  let images = [...keep, ...uploaded]
  if (mainFirst && images.includes(mainFirst)) images = [mainFirst, ...images.filter((u) => u !== mainFirst)]

  try {
    await upsertProduct({
      slug,
      name,
      price,
      was,
      is_new: form.get('is_new') === 'on',
      category,
      colors,
      sizes,
      sold_out,
      rank,
      tone: before?.tone ?? ((Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3),
      description: String(form.get('description') ?? '').trim() || null,
      material: String(form.get('material') ?? '').trim() || null,
      images,
      active: form.get('active') === 'on',
    })
  } catch (e) {
    console.error(e)
    await deleteImages(uploaded)
    fail(existingSlug, 'Хадгалахад алдаа гарлаа. products хүснэгт үүссэн эсэхийг шалгана уу.')
  }
  const removed = (before?.images ?? []).filter((u) => !keep.includes(u))
  await deleteImages(removed)
  redirect(`/admin/products?saved=${encodeURIComponent(slug)}`)
}

export async function removeProduct(form: FormData) {
  await requireAdmin()
  const slug = String(form.get('slug') ?? '')
  const row = await getProductRow(slug)
  if (row) {
    await deleteProduct(slug)
    await deleteImages(row.images)
  }
  redirect('/admin/products?deleted=1')
}
