import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Нэг нууц үгтэй энгийн admin нэвтрэлт: ADMIN_KEY (.env.local) → httpOnly cookie.
const COOKIE = 'admin_session'
const token = (key: string) => createHash('sha256').update(`admin:${key}`).digest('hex')

export async function isAdmin() {
  const key = process.env.ADMIN_KEY
  if (!key) return process.env.NODE_ENV !== 'production' // local хөгжүүлэлтэд ADMIN_KEY-гүй бол нээлттэй
  const got = (await cookies()).get(COOKIE)?.value ?? ''
  const want = token(key)
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want))
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}

export async function signIn(password: string) {
  const key = process.env.ADMIN_KEY
  if (!key || token(password) !== token(key)) return false
  ;(await cookies()).set(COOKIE, token(key), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return true
}

export async function signOut() {
  ;(await cookies()).delete(COOKIE)
}
