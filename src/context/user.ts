import { IUser } from '@/types/auth'
import { createEvent, createStore } from 'effector'
import nookies from 'nookies'

export const setUser = createEvent<IUser>()
export const $user = createStore<IUser>({} as IUser)

$user.on(setUser, (_, user) => {
  return user
})

// checkUserCookie.watch(() => {
//   if (nookies.get().user) {
//     const data = JSON.parse(nookies.get().user)
//     setUser(data)
//   }
// })
