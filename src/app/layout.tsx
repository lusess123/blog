import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zyking\'S 每日阅读  ',
  description: '思考与总结',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      <footer className="cyber-footer">
        <div className="footer-content">
          <a href="https://beian.miit.gov.cn/" target="_blank" className="footer-link">
            浙ICP备20018760号-1
          </a>
          <div className="footer-glow"></div>
        </div>
      </footer>
      </body>
    </html>
  )
}
