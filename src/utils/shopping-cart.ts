import {
  AddToCartItemFx,
  RemoveFromCartItemFx,
} from '@/api/shopping-cart/shopping-cart'
import { IShoppingCartItem } from '@/types/shopping-cart'
import { toast } from 'react-toastify'

export const toggleCartItem = async (
  username: string,
  partId: number,
  isInCart: boolean,
  setSpinner: (arg0: boolean) => void,
  removeShoppingCartItemFx: (arg0: number) => number,
  updateShoppingCartFx: (payload: IShoppingCartItem) => IShoppingCartItem
) => {
  try {
    setSpinner(true)

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
  } finally {
    setSpinner(false)
  }
}

export const removeItemFromCart = async (
  partId: number,
  setSpinner: (arg0: boolean) => void,
  removeShoppingCartItemFx: (payload: number) => number
) => {
  try {
    setSpinner(true)
    await RemoveFromCartItemFx(`/shopping-cart/one/${partId}`)
    removeShoppingCartItemFx(partId)
  } catch (error) {
    toast.error((error as Error).message)
  } finally {
    setSpinner(false)
  }
}
