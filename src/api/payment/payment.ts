import { $api } from '@/api/api'
import { ICheckPayFx, IMakePayFx } from '@/types/order'
import { createEffect } from 'effector'

export const makePaymentFx = createEffect(
  async ({ url, amount, description }: IMakePayFx) => {
    const { data } = await $api.post(url, { amount })

    return data
  }
)
export const checkPaymentFx = createEffect(
  async ({ url, paymentId }: ICheckPayFx) => {
    const { data } = await $api.post(url, { paymentId })

    return data
  }
)
