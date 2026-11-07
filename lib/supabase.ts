// Server-side Supabase helpers (REST + Storage) — no extra npm package needed.
// Зөвхөн server код (API route, server component, server action) импортлоно.
export const SB_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
export const BUCKET = 'products'

export const sbConfigured = () => Boolean(SB_URL && SB_KEY)

function headers(extra?: HeadersInit): HeadersInit {
  // Шинэ sb_secret_ key зөвхөн apikey header-т; хуучин service_role (JWT) key-г Authorization-д бас явуулна
  return { apikey: SB_KEY!, ...(SB_KEY!.startsWith('eyJ') ? { Authorization: `Bearer ${SB_KEY}` } : {}), ...extra }
}

export async function sb(pathAndQuery: string, init: RequestInit = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: headers({ 'Content-Type': 'application/json', ...init.headers }),
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`)
  return r
}

/** Upload a file to the public `products` bucket and return its public URL. */
export async function uploadImage(path: string, file: File) {
  const r = await fetch(`${SB_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: headers({ 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true', 'cache-control': '31536000' }),
    body: Buffer.from(await file.arrayBuffer()),
  })
  if (!r.ok) throw new Error(`Storage ${r.status}: ${await r.text()}`)
  return `${SB_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

export async function deleteImages(urls: string[]) {
  const prefix = `${SB_URL}/storage/v1/object/public/${BUCKET}/`
  const prefixes = urls.filter((u) => u.startsWith(prefix)).map((u) => u.slice(prefix.length))
  if (!prefixes.length) return
  await fetch(`${SB_URL}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prefixes }),
  }).catch(() => {}) // зураг устгагдаагүй ч бараа хадгалагдана
}
