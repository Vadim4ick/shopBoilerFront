import { IShoppingCartItem } from '@/types/shopping-cart'
import { createEvent, createStore } from 'effector'

export const setShoppingCart = createEvent<IShoppingCartItem[]>()
export const $shoppingCart = createStore<IShoppingCartItem[]>([])

$shoppingCart.on(setShoppingCart, (_, shoppingCart) => shoppingCart)

// $mode.watch((counter: string) => {
//   console.log('counter is now', counter)
// })
