import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import ThemeProvider from '@/components/providers/ThemeProvider'
import './globals.css'
import { cn } from '@/lib/utils'
import QueryProvider from '@/components/providers/QueryProvider'
import { Toaster } from 'react-hot-toast'
import CartDrawer from '@/components/cart/CartDrawer'
import { CartDrawerProvider } from '@/components/cart/CartDrawerContext'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'E-Shop',
  description: 'E-Shop',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale   = await getLocale()
  const messages = await getMessages()
  const isRTL    = locale === 'ar'

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={cairo.variable}
    >
      <body className={cn('font-sans antialiased bg-bg text-text')}>

        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <QueryProvider>
              <CartDrawerProvider>
                {children}
                <CartDrawer />
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      fontFamily: "var(--font-cairo)",
                      direction: "rtl",
                    },
                  }}
                />
              </CartDrawerProvider>
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}