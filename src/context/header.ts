import { createEvent, createStore } from 'effector'

export const setSearchInputZIndex = createEvent<number>()
export const $searchInputZIndex = createStore<number>(0)

$searchInputZIndex.on(setSearchInputZIndex, (_, mode) => mode)
