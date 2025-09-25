import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../contexts/ThemeContext'
import ThemeWrapper from '../components/ThemeWrapper'

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
      <body className={inter.className}>
        <ThemeProvider>
          <ThemeWrapper>
            {children}
            <footer className="footer">
              <a href="https://beian.miit.gov.cn/" target="_blank" className="footer-link">
                浙ICP备20018760号-1
              </a>
            </footer>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
