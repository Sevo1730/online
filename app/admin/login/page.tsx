import { redirect } from 'next/navigation'
import { isAdmin, signIn } from '@/lib/admin'

export const metadata = { title: 'Admin нэвтрэх' }

async function login(form: FormData) {
  'use server'
  const ok = await signIn(String(form.get('password') ?? ''))
  redirect(ok ? '/admin' : '/admin/login?error=1')
}

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect('/admin')
  const { error } = await searchParams
  const noKey = !process.env.ADMIN_KEY
  return (
    <main className="wrap py-20 max-w-[420px]">
      <h1 className="mb-6 font-display font-bold uppercase tracking-[.02em] text-[28px] leading-none">Нэвтрэх</h1>
      {noKey ? (
        <p className="text-[14px] text-muted">.env.local файлд ADMIN_KEY тохируулаагүй байна.</p>
      ) : (
        <form action={login} className="flex flex-col gap-4">
          <label className="field">Нууц үг<input className="input" name="password" type="password" autoComplete="current-password" required autoFocus /></label>
          {error && <p role="alert" className="text-[13px] text-error">Нууц үг буруу байна.</p>}
          <button type="submit" className="btn">Нэвтрэх</button>
        </form>
      )}
    </main>
  )
}
