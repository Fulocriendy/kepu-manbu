import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '科普漫步',
  description: '社区科普教育互动平台 - 探索天文、古生物、植物、生态、社区五大领域',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
