import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Crumbs } from '@/components/ui'
import { INFO_PAGES, infoBySlug } from '@/lib/info'

type Props = { params: Promise<{ page: string }> }

export const generateStaticParams = () => INFO_PAGES.map((p) => ({ page: p.slug }))
export const dynamicParams = false

export async function generateMetadata({ params }: Props) {
  return { title: infoBySlug((await params).page)?.title }
}

export default async function InfoPage({ params }: Props) {
  const page = infoBySlug((await params).page)
  if (!page) notFound()
  return (
    <>
      <Header />
      <main className="px-4 pt-5 pb-20 lg:wrap lg:grid lg:grid-cols-12 lg:gap-x-6 lg:pt-8 lg:pb-[120px]">
        <div className="lg:col-[1/5]">
          <Crumbs items={[['Нүүр', '/'], [page.title]]} />
          <h1 className="mt-5 mb-6 font-display font-bold uppercase tracking-[.02em] text-[30px] leading-none lg:text-[clamp(32px,3.6vw,48px)]">{page.title}</h1>
          <ul className="hidden lg:flex flex-col gap-1 text-[14px]">
            {INFO_PAGES.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} aria-current={p.slug === page.slug ? 'page' : undefined} className={p.slug === page.slug ? 'font-semibold' : 'text-muted hover:text-ink'}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-8 lg:col-[6/12] lg:pt-14 max-w-[62ch]">
          {page.lead && <p className="text-[17px] leading-[1.65]">{page.lead}</p>}
          {page.blocks.map((b, i) => (
            <section key={i} className="flex flex-col gap-2.5">
              {b.h && <h2 className="font-display font-bold uppercase tracking-[.02em] text-[18px] leading-[1.1]">{b.h}</h2>}
              {b.p && <p className="text-[15px] leading-[1.7] text-muted">{b.p}</p>}
              {b.list && (
                <ul className="list-disc pl-5 text-[15px] leading-[1.7] text-muted">
                  {b.list.map((l) => <li key={l}>{l}</li>)}
                </ul>
              )}
              {b.table && (
                <table className="w-full text-[14px] tabular-nums border-t border-ink">
                  <thead><tr>{b.table[0].map((c) => <th key={c} className="text-left font-semibold py-2.5 border-b border-rule">{c}</th>)}</tr></thead>
                  <tbody>
                    {b.table.slice(1).map((r) => (
                      <tr key={r[0]}>{r.map((c, j) => <td key={j} className="py-2.5 border-b border-rule">{c}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
