import { $api } from '@/api/api'
import { IGeolocation } from '@/types/common'
import axios from 'axios'
import { createEffect } from 'effector'
import { toast } from 'react-toastify'

export const getGeolocationFx = createEffect(async (params: IGeolocation) => {
  const { data } = await $api.get(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${params.latitude}&lon=${params.longitude}&lang=ru&apiKey=${process.env.NEXT_PUBLIC_GEOAPI_KEY}`,
    { withCredentials: false }
  )

  if (data.warningMessage) {
    return toast.warning(data.warningMessage)
  }

  toast.success('Регистрация прошла успешно')

  return data
})
