import { useEffect, useState } from 'react'
import { removeItemFromCart, updateTotalPrice } from '@/utils/shopping-cart'
import { useUnit } from 'effector-react'
import { RemoveFromCartItemFx } from '@/api/shopping-cart/shopping-cart'

export const usePrice = (
  count: number,
  partId: number,
  initialPrice: number,
  updateCartItemTotalPrice: (payload: {
    partId: number
    totalPrice: number
  }) => {
    partId: number
    totalPrice: number
  },
  removeShoppingCartItemFx: (payload: number) => number
) => {
  const spinner = useUnit(RemoveFromCartItemFx.pending)
  const [price, setPrice] = useState(initialPrice)

  const incPrice = () => {
    setPrice(price + initialPrice)
  }
  const decPrice = () => setPrice(price - initialPrice)

  useEffect(() => {
    setPrice(price * count)
  }, [])

  useEffect(() => {
    updateTotalPrice(price, partId, updateCartItemTotalPrice)
  }, [price])

  const deleteCartItem = () =>
    removeItemFromCart(partId, removeShoppingCartItemFx)

  return {
    incPrice,
    decPrice,
    deleteCartItem,
    spinner,
    price,
  }
}
