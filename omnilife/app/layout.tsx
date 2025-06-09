import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../src/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OmniLife - 全域生活平台',
  description: '一个平台，连接生活的每一个瞬间。AI驱动的一体化生活服务平台。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
