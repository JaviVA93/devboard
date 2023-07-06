
import './globals.css'
import { Overlock } from 'next/font/google'
import SideBar from '@/components/sideBar/sideBar'
import SupabaseProvider from './supabase-context'
import { Toaster } from 'react-hot-toast'
import style from './layout.module.css'


export const metadata = {
  title: 'Devboard',
  description: 'Created by Javi Villar',
}

const overlock = Overlock({
  weight: ['400', '700'],
  subsets: ['latin']
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" className={overlock.className}>
      <head>
        <meta name="view-transition" content="same-origin" />
      </head>
      <body>
        <SupabaseProvider>
          <SideBar />
          <main className={style.main}>
            {children}
          </main>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}
