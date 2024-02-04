import { IShoppingCartItem } from '@/types/shopping-cart'
import { createEvent, createStore } from 'effector'

export const setShoppingCart = createEvent<IShoppingCartItem[]>()
export const setTotalPrice = createEvent<number>()

export const updateShoppingCart = createEvent<IShoppingCartItem>()
export const removeShoppingCartItem = createEvent<number>()

export const updateCartItemTotalPrice = createEvent<{
  partId: number
  totalPrice: number
}>()

export const updateCartItemCount = createEvent<{
  partId: number
  count: number
}>()

export const $shoppingCart = createStore<IShoppingCartItem[]>([])

export const $totalPrice = createStore<number>(0)

export const remove = (cartItems: IShoppingCartItem[], partId: number) => {
  return cartItems.filter((item) => {
    return item.partId !== partId
  })
}

function updateCartItem<T>(
  cartItems: IShoppingCartItem[],
  partId: number,
  payload: T
) {
  return cartItems.map((item) => {
    if (item.partId === partId) {
      return {
        ...item,
        ...payload,
      }
    }

    return item
  })
}

$shoppingCart
  .on(setShoppingCart, (_, shoppingCart) => {
    return shoppingCart
  })
  .on(updateShoppingCart, (state, cartItem) => {
    return [...state, cartItem]
  })
  .on(removeShoppingCartItem, (state, partId) => {
    return [...remove(state, partId)]
  })
  .on(updateCartItemTotalPrice, (state, { partId, totalPrice }) => {
    return [...updateCartItem(state, partId, { totalPrice })]
  })
  .on(updateCartItemCount, (state, { partId, count }) => {
    return [...updateCartItem(state, partId, { count })]
  })

$totalPrice.on(setTotalPrice, (_, totalPrice) => {
  return totalPrice
})

// $totalPrice.watch((counter: number) => {
//   console.log('counter is now', counter)
// })
