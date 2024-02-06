import ContactsPage from '@/components/templates/ContactsPage/ContactsPage'

export const metadata = {
  title: 'Контакты',
}

const PageContacts = () => {
  return (
    <>
      <ContactsPage />
      <div className="overlay" />
    </>
  )
}

export default PageContacts
