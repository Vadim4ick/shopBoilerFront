import ShippingPayment from '@/components/templates/ShippingPayment/ShippingPayment'

export const metadata = {
  title: 'Доставка и оплата',
}

const ShippingPaymentPage = () => {
  return (
    <>
      <ShippingPayment />
      <div className="overlay" />
    </>
  )
}

export default ShippingPaymentPage
