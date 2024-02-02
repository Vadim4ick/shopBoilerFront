import { ReadonlyURLSearchParams } from 'next/navigation'
import { idGenerator } from './common'

const createManufacturerCheckboxObj = (title: string) => ({
  title,
  checked: false,
  id: idGenerator(),
})

export const boilerManufacturers = [
  'Ariston',
  'Chaffoteaux&Maury',
  'Baxi',
  'Bongioanni',
  'Saunier Duval',
  'Buderus',
  'Strategist',
  'Henry',
  'Northwest',
].map(createManufacturerCheckboxObj)

export const partsManufacturers = [
  'Azure',
  'Gloves',
  'Cambridgeshire',
  'Salmon',
  'Montana',
  'Sensor',
  'Lesly',
  'Radian',
  'Gasoline',
  'Croatia',
].map(createManufacturerCheckboxObj)

const checkPriceFromQuery = (price: number) =>
  price && !isNaN(price) && price >= 0 && price <= 10000

export const checkQueryParams = (searchParams: ReadonlyURLSearchParams) => {
  const priceFromQueryValue = searchParams.get('priceFrom') as string
  const priceToQueryValue = searchParams.get('priceTo') as string
  const boilerQueryValue = JSON.parse(
    decodeURIComponent(searchParams.get('boiler') as string)
  )
  const partsQueryValue = JSON.parse(
    decodeURIComponent(searchParams.get('parts') as string)
  )

  const isValidBoilerQuery =
    Array.isArray(boilerQueryValue) && Boolean(boilerQueryValue?.length)
  const isValidPartsQuery =
    Array.isArray(partsQueryValue) && Boolean(partsQueryValue?.length)

  const isValidPriceQuery =
    checkPriceFromQuery(+priceFromQueryValue) &&
    checkPriceFromQuery(+priceToQueryValue)

  return {
    priceFromQueryValue,
    priceToQueryValue,
    boilerQueryValue,
    partsQueryValue,
    isValidBoilerQuery,
    isValidPartsQuery,
    isValidPriceQuery,
  }
}
