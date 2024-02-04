import { IAddToCartFx } from './../../types/shopping-cart'
import { createEffect } from 'effector'
import { $api } from '../api'

export const GetCartItemFx = createEffect(async (url: string) => {
  const { data } = await $api.get(url)

  return data
})

export const AddToCartItemFx = createEffect(
  async ({ url, username, partId }: IAddToCartFx) => {
    const { data } = await $api.post(url, { username, partId })

    return data
  }
)

export const RemoveFromCartItemFx = createEffect(async (url: string) => {
  await $api.delete(url)
})
