import { createEffect } from 'effector'
import { $api } from '../api'
import { toast } from 'react-toastify'

export const GetBestselleresOrNewPartsFx = createEffect(async (url: string) => {
  const { data } = await $api.get(url)

  return data
})

export const GetBoilerPartFx = createEffect(async (url: string) => {
  const { data } = await $api.get(url)

  return data
})

export const searchPartsFx = createEffect(
  async ({ url, search }: { url: string; search: string }) => {
    try {
      const { data } = await $api.post(url, { search })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)
export const GetPartByNameFx = createEffect(
  async ({ url, name }: { url: string; name: string }) => {
    try {
      const { data } = await $api.post(url, { name })

      return data
    } catch (error) {
      toast.error((error as Error).message)
    }
  }
)
