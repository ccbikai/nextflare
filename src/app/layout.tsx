import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nextflare - A Next.js App running with Lemon Squeezy on Cloudflare.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full touch-manipulation">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-full font-sans`}
      >
        {children}
      </body>
    </html>
  )
}
