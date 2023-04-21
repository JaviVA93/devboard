import Link from 'next/link'
import './globals.css'
import { Overlock } from 'next/font/google'

export const metadata = {
  title: 'Workboard',
  description: 'Created by Javi Villar',
}

const overlock = Overlock({ 
  weight: ['400', '700'],
  subsets: ['latin']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={overlock.className}>
      <body>
        <header className='mainMenu'>
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/workboard">Workboard</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
