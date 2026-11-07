import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin, signOut } from '@/lib/admin'

export const metadata = { robots: { index: false } }

async function logout() {
  'use server'
  await signOut()
  redirect('/admin/login')
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdmin()
  return (
    <>
      <header className="border-b border-rule">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/admin" className="font-display font-semibold text-[24px] tracking-[.08em]">Admin</Link>
          {ok && (
            <nav className="flex items-center gap-6 text-[14px]">
              <Link href="/admin" className="navlink">Захиалга</Link>
              <Link href="/admin/products" className="navlink">Бараа</Link>
              <Link href="/" className="navlink text-muted">Сайт руу ↗</Link>
              <form action={logout}><button type="submit" className="textbtn text-muted">Гарах</button></form>
            </nav>
          )}
        </div>
      </header>
      {children}
    </>
  )
}
