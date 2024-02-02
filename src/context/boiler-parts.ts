import { IBoilerParts } from '@/types/boilerPart'
import { IFilterCheckboxItem } from '@/types/catalog'
import { boilerManufacturers, partsManufacturers } from '@/utils/catalog'
import { createEvent, createStore } from 'effector'

export const setBoilerParts = createEvent<IBoilerParts>()
export const setBoilerPartsCheapFirst = createEvent()
export const setBoilerPartsExpensiveFirst = createEvent()
export const setBoilerPartsByPopulatiry = createEvent()

export const setBoilerManufacturers = createEvent<IFilterCheckboxItem[]>()
export const setPartManufacturers = createEvent<IFilterCheckboxItem[]>()

export const setBoilerManufacturersFromQuery = createEvent<string[]>()
export const setPartManufacturersFromQuery = createEvent<string[]>()

export const setFiltredBoilerPart = createEvent<IBoilerParts>()

export const updateBoilerManufacturers = createEvent<IFilterCheckboxItem>()
export const updatePartManufacturers = createEvent<IFilterCheckboxItem>()

export const $boilerParts = createStore<IBoilerParts>({} as IBoilerParts)

export const $filtredBoilerPart = createStore<IBoilerParts>({} as IBoilerParts)

export const $boilerManufacturers = createStore<IFilterCheckboxItem[]>(
  boilerManufacturers as IFilterCheckboxItem[]
)
export const $partManufacturers = createStore<IFilterCheckboxItem[]>(
  partsManufacturers as IFilterCheckboxItem[]
)

const updateManufacturer = (
  manufacturers: IFilterCheckboxItem[],
  id: string,
  payload: Partial<IFilterCheckboxItem>
) =>
  manufacturers.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...payload,
      }
    }

    return item
  })

const updateManufacturerFromQuery = (
  manufacturers: IFilterCheckboxItem[],
  manufacturersFromQuery: string[]
) =>
  manufacturers.map((item) => {
    if (manufacturersFromQuery.find((title) => title === item.title)) {
      return {
        ...item,
        checked: true,
      }
    }

    return item
  })

$boilerParts
  .on(setBoilerParts, (_, boilerParts) => boilerParts)
  .on(setBoilerPartsCheapFirst, (state) => {
    return {
      ...state,
      rows: state.rows.sort((a, b) => a.price - b.price),
    }
  })
  .on(setBoilerPartsExpensiveFirst, (state) => {
    return {
      ...state,
      rows: state.rows.sort((a, b) => b.price - a.price),
    }
  })
  .on(setBoilerPartsByPopulatiry, (state) => {
    return {
      ...state,
      rows: state.rows.sort((a, b) => b.popularity - a.popularity),
    }
  })

$boilerManufacturers
  .on(setBoilerManufacturers, (_, parts) => parts)
  .on(updateBoilerManufacturers, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setBoilerManufacturersFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

$partManufacturers
  .on(setPartManufacturers, (_, parts) => parts)
  .on(updatePartManufacturers, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setPartManufacturersFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

$filtredBoilerPart.on(setFiltredBoilerPart, (_, parts) => parts)

// $mode.watch((counter: string) => {
//   console.log('counter is now', counter)
// })
