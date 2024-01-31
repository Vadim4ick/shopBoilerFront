import { createEvent, createStore } from 'effector'

export const setMode = createEvent<string>()
export const $mode = createStore<string>('')

$mode.on(setMode, (_, mode) => mode)

// $mode.watch((counter: string) => {
//   console.log('counter is now', counter)
// })
