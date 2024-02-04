import type { Metadata } from 'next'
import { EffectorNext } from '@effector/next'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import NextTopLoader from 'nextjs-toploader'
import { MainLayout } from '@/layout/MainLayout'

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
          <NextTopLoader height={50} showSpinner={false} color="green" />

          <EffectorNext>
            <MainLayout>{children}</MainLayout>
          </EffectorNext>

          <ToastContainer />
        </body>
      </html>
    </>
  )
}

export default RootLayout
