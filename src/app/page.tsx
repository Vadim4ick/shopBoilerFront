import { AuthPage } from '@/components/templates/AuthPage/AuthPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Авторизация',
}

export default function Home() {
  return (
    <main>
      <AuthPage />
    </main>
  )
}
