import DashboardPage from '@/components/templates/DashboardPage/DashboardPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const PageDashboard = () => {
  return (
    <>
      <DashboardPage />
      <div className="overlay"></div>
    </>
  )
}

export default PageDashboard
