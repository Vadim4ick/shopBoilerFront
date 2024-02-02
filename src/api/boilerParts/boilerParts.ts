import { createEffect } from 'effector'
import { $api } from '../api'

export const GetBestselleresOrNewPartsFx = createEffect(async (url: string) => {
  const { data } = await $api.get(url)

  return data
})
