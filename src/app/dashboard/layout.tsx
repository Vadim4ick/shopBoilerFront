import Footer from '@/components/modules/Footer/Footer'
import Header from '@/components/modules/Header/Header'
import { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default layout
