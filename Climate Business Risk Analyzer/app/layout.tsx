import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Climate Business Risk Analyzer | Greenly',
  description:
    'Get a free, science-based climate risk analysis for your company under +2\u00b0C and +3\u00b0C warming scenarios.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
            <span className="text-lg font-bold text-greenly-primary">
              Greenly
            </span>
            <span className="ml-2 text-sm text-gray-500">
              Climate Risk Analyzer
            </span>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
