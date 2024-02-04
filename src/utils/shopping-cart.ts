import {
  AddToCartItemFx,
  RemoveFromCartItemFx,
  UpdateCartItemFx,
} from '@/api/shopping-cart/shopping-cart'
import { IShoppingCartItem } from '@/types/shopping-cart'
import { toast } from 'react-toastify'

export const toggleCartItem = async (
  username: string,
  partId: number,
  isInCart: boolean,
  removeShoppingCartItemFx: (arg0: number) => number,
  updateShoppingCartFx: (payload: IShoppingCartItem) => IShoppingCartItem
) => {
  try {
    if (isInCart) {
      await RemoveFromCartItemFx(`/shopping-cart/one/${partId}`)

      removeShoppingCartItemFx(partId)
      return
    }

    const data = await AddToCartItemFx({
      url: `/shopping-cart/add`,
      username: username,
      partId: partId,
    })

    updateShoppingCartFx(data)
  } catch (error) {
    toast.error((error as Error).message)
  }
}

export const removeItemFromCart = async (
  partId: number,
  removeShoppingCartItemFx: (payload: number) => number
) => {
  try {
    await RemoveFromCartItemFx(`/shopping-cart/one/${partId}`)
    removeShoppingCartItemFx(partId)
  } catch (error) {
    toast.error((error as Error).message)
  }
}

export const updateTotalPrice = async (
  totalPrice: number,
  partId: number,
  updateCartItemTotalPrice: (payload: {
    partId: number
    totalPrice: number
  }) => {
    partId: number
    totalPrice: number
  }
) => {
  const data = await UpdateCartItemFx({
    url: `/shopping-cart/total-price/${partId}`,
    payload: {
      totalPrice,
    },
  })

  updateCartItemTotalPrice({ partId, totalPrice: data.totalPrice })
}
