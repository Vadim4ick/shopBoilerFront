import AboutPage from '@/components/templates/AboutPage/AboutPage'

export const metadata = {
  title: 'О компании',
}

const PageAbout = () => {
  return (
    <>
      <AboutPage />
      <div className="overlay" />
    </>
  )
}

export default PageAbout
