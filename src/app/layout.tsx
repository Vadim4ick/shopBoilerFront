import type { Metadata } from 'next'
import { EffectorNext } from '@effector/next'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Header from '@/components/modules/Header/Header'
import Footer from '@/components/modules/Footer/Footer'

// const enhance = withHydrate()

export const metadata: Metadata = {
  title: {
    template: '%s | Аква Термикс',
    default: 'Аква Термикс', // a default is required when creating a template
  },

  icons: {
    icon: {
      url: './img/logo.svg',
      sizes: '32x32',
      type: 'image/svg',
    },
  },
}

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="en">
        <body>
          <Header />
          <EffectorNext>{children}</EffectorNext>
          <ToastContainer />
          <Footer />
        </body>
      </html>
    </>
  )
}

export default RootLayout
