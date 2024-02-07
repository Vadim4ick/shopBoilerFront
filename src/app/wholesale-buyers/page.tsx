import ContactsPage from '@/components/templates/ContactsPage/ContactsPage'

export const metadata = {
  title: 'Оптовым покупателям',
}

const PageContacts = () => {
  return (
    <>
      <ContactsPage isWholesaleBuyersPage />
    </>
  )
}

export default PageContacts
