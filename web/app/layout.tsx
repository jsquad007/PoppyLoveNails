import type { Metadata } from 'next'
import { Libre_Caslon_Text, Manrope } from 'next/font/google'
import './globals.css'
import SiteNav from '@/components/site-nav'
import SiteFooter from '@/components/site-footer'

const libreCaslon = Libre_Caslon_Text({
  subsets:  ['latin'],
  weight:   ['400', '700'],
  variable: '--font-display',
  display:  'swap',
})

const manrope = Manrope({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  variable: '--font-body',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'PoppyLove Creations',
  description: 'Artisan hand-painted press-on nail sets. Boutique designs for the discerning individual.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://poppylove.au'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${libreCaslon.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
