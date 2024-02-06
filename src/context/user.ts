import { IUser } from '@/types/auth'
import { createEvent, createStore } from 'effector'

export const setUser = createEvent<IUser>()
export const setUserCity = createEvent<{
  city: string
  street: string
  country: string
}>()

export const $user = createStore<IUser>({} as IUser)
export const $userCity = createStore<{
  city: string
  street: string
  country: string
}>({ city: '', street: '', country: '' })

$user.on(setUser, (_, user) => {
  return user
})

$userCity.on(setUserCity, (_, user) => {
  return user
})
