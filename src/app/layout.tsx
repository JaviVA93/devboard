import Link from 'next/link'
import './globals.css'
import { Overlock } from 'next/font/google'
import SideBar from '@/components/sideBar/sideBar'
import { User, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const metadata = {
  title: 'Workboard',
  description: 'Created by Javi Villar',
}

const overlock = Overlock({
  weight: ['400', '700', '900'],
  subsets: ['latin']
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className={overlock.className}>
      <body>
        <SideBar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
