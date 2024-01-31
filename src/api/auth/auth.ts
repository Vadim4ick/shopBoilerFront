import { ISignInFx, ISignUpFx } from '@/types/auth'
import { createEffect } from 'effector'
import { $api } from '../api'
import { toast } from 'react-toastify'

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
