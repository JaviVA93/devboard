import './globals.css'
import { Overlock } from 'next/font/google'
import SideBar from '@/components/sideBar/sideBar'
import SupabaseProvider from './supabase-context'
import { Toaster } from 'react-hot-toast'

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
        <SupabaseProvider>
          <SideBar />
          <main>
            {children}
          </main>
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  )
}
