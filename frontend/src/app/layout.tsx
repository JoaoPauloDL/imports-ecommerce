import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BottomNavigation from '@/components/layout/BottomNavigation'
import AuthProvider from '@/components/AuthProvider'
import ToastProvider from '@/components/ui/ToastProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'David Importados - Eletrônicos e Produtos Importados',
    template: '%s | David Importados'
  },
  description: 'Loja online de produtos importados originais com os melhores preços. Eletrônicos, acessórios, gadgets e muito mais. Frete para todo Brasil.',
  keywords: ['produtos importados', 'eletrônicos', 'iPhone', 'gadgets', 'importados originais', 'loja online'],
  authors: [{ name: 'David Importados' }],
  creator: 'David Importados',
  publisher: 'David Importados',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'David Importados',
    title: 'David Importados - Eletrônicos e Produtos Importados',
    description: 'Loja online de produtos importados originais com os melhores preços. Frete para todo Brasil.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'David Importados',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'David Importados - Eletrônicos e Produtos Importados',
    description: 'Loja online de produtos importados originais com os melhores preços.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'seu-codigo-google-search-console',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="pt-BR" className="overflow-x-hidden">
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ErrorBoundary>
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <BottomNavigation />
            </div>
            <ToastProvider />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}