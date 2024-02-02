import { ISignInFx, ISignUpFx } from '@/types/auth'
import { createEffect } from 'effector'
import { $api } from '../api'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { HTTPStatus } from '@/const'

export const signUpFx = createEffect(
  async ({ email, url, password, username }: ISignUpFx) => {
    const { data } = await $api.post(url, { username, password, email })

    if (data.warningMessage) {
      return toast.warning(data.warningMessage)
    }

    toast.success('Регистрация прошла успешно')

    return data
  }
)

export const signInFx = createEffect(
  async ({ url, password, username }: ISignInFx) => {
    const { data } = await $api.post(url, { username, password })

    toast.success('Вход выполнен')

    return data
  }
)

export const logoutFx = createEffect(async (url: string) => {
  try {
    await $api.get(url)

    toast.success('Выход выполнен')
  } catch (error) {
    toast.error((error as Error).message)
  }
})

// export const checkUserAuthFx = createEffect(async (url: string) => {
//   try {
//     const { data } = await $api.get(url)

//     return data
//   } catch (error) {
//     const axiosError = error as AxiosError

//     if (axiosError.response) {
//       if (axiosError.response.status === HTTPStatus.FORBIDDEN) {
//         return false
//       }
//     }

//     toast.error((error as Error).message)
//   }
// })
