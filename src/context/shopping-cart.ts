import { IShoppingCartItem } from '@/types/shopping-cart'
import { createEvent, createStore } from 'effector'

export const setShoppingCart = createEvent<IShoppingCartItem[]>()
export const updateShoppingCart = createEvent<IShoppingCartItem>()
export const removeShoppingCartItem = createEvent<number>()

export const $shoppingCart = createStore<IShoppingCartItem[]>([])

export const remove = (cartItems: IShoppingCartItem[], partId: number) => {
  return cartItems.filter((item) => {
    return item.partId !== partId
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

// $mode.watch((counter: string) => {
//   console.log('counter is now', counter)
// })
