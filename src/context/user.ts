import { IUser } from '@/types/auth'
import { createEvent, createStore } from 'effector'

export const setUser = createEvent<IUser>()
export const $user = createStore<IUser>({} as IUser)

$user.on(setUser, (_, user) => user)

// $user.watch((user: IUser) => {
//   return user
// })
