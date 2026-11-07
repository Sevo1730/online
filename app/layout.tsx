import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import { getProducts } from '@/lib/catalog'
import { CatalogProvider } from '@/lib/catalog-client'
import { BRAND } from '@/lib/config'
import './globals.css'

// cyrillic-ext carries Ө and Ү (Jost lacks them, Montserrat has them)
const sans = Montserrat({ subsets: ['latin', 'cyrillic', 'cyrillic-ext'], weight: ['400', '500', '600', '700'], variable: '--font-montserrat' })

export const metadata: Metadata = {
  title: { default: BRAND, template: `%s — ${BRAND}` },
  description: 'Улаанбаатарт бүтээсэн эмэгтэй хувцас. Намар — Өвөл 2026 цуглуулга.',
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={sans.variable}>
      <body>
        <CatalogProvider products={await getProducts()}>
          <CartProvider>{children}</CartProvider>
        </CatalogProvider>
      </body>
    </html>
  )
}
