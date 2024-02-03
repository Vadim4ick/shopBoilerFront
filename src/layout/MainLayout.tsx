'use client'

import Footer from '@/components/modules/Footer/Footer'
import Header from '@/components/modules/Header/Header'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const MainLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  return (
    <>
      {pathname !== '/' && <Header />}

      {children}

      {pathname !== '/' && <Footer />}
    </>
  )
}

export { MainLayout }
