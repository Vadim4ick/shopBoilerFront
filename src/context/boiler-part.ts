import { IBoilerPart } from '@/types/boilerPart'
import { createEvent, createStore } from 'effector'

export const setBoilerPart = createEvent<IBoilerPart>()
export const $boilerPart = createStore<IBoilerPart>({} as IBoilerPart)

$boilerPart.on(setBoilerPart, (_, part) => part)
