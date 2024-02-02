import { useMedia } from '@/hooks/useMediaQuery'
import CatalogFiltersDesktop from './CatalogFiltersDesktop'
import { ICatalogFiltersProps } from '@/types/catalog'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getQueryParamOnFirstRender } from '@/utils/common'
import CatalogFiltersMobile from './CatalogFiltersMobile'
import { useUnit } from 'effector-react'
import {
  $boilerManufacturers,
  $partManufacturers,
  setFiltredBoilerPart as setFiltredBoilerPartFx,
} from '@/context/boiler-parts'
import { GetBestselleresOrNewPartsFx } from '@/api/boilerParts/boilerParts'

interface NewParams {
  boiler: string
  parts: string
  priceFrom: number
  priceTo: number
  offset: number
}

const CatalogFilters = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  resetFilters,
  isPriceRangeChanged,
  currentPage,
  setIsFilterInQuery,
  closePopup,
  filtersMobileOpen,
}: ICatalogFiltersProps) => {
  const isMobile = useMedia('(max-width: 820px)')
  const [spinner, setSpinner] = useState(false)
  const [boilerManufacturers, partsManufacturers, setFiltredBoilerPart] =
    useUnit([$boilerManufacturers, $partManufacturers, setFiltredBoilerPartFx])

  // const router = useRouter()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Обновление маршрута с новыми параметрами поиска
  const createURLParams = useCallback(
    (paramsQuery: Partial<NewParams>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(paramsQuery).map(([key, value]) => {
        return params.set(key, String(value))
      })

      router.push(pathname + '?' + params.toString())
    },
    [searchParams]
  )

  useEffect(() => {
    applyFiltersFromQuery()
  }, [])

  const updatePriceFromQuery = (priceFrom: number, priceTo: number) => {
    setIsFilterInQuery(true)
    setPriceRange([+priceFrom, +priceTo])
    setIsPriceRangeChanged(true)
  }

  async function updateParamsAndFilter<T extends Partial<NewParams>>(
    updatedParams: T,
    path: string
  ) {
    // router.push(pathname + '?' + `first=cheap`)

    // createURLParams({
    //   ...updatedParams,
    // })

    console.log(updatedParams)
    console.log(path)

    // const data = await GetBestselleresOrNewPartsFx(
    //   `/boiler-parts?limit=20&offset=${path}`
    // )

    // setFiltredBoilerPart(data)
  }

  const applyFiltersFromQuery = async () => {
    try {
      const priceFromQueryValue = searchParams.get('priceFrom')
      const priceToQueryValue = searchParams.get('priceTo')
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
      // const {
      //   isValidBoilerQuery,
      //   isValidPartsQuery,
      //   isValidPriceQuery,
      //   partsQueryValue,
      //   priceFromQueryValue,
      //   boilerQueryValue,
      //   priceToQueryValue,
      // } = checkQueryParams(router)
      const boilerQuery = `&boiler=${searchParams.get('boiler')}`
      const partsQuery = `&parts=${searchParams.get('parts')}`
      const priceQuery = `&priceFrom=${priceFromQueryValue}&priceTo=${priceToQueryValue}`

      // if (isValidBoilerQuery && isValidPartsQuery && isValidPriceQuery) {
      //   updateParamsAndFiltersFromQuery(() => {
      //     updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
      //     setBoilerManufacturersFromQuery(boilerQueryValue)
      //     setPartsManufacturersFromQuery(partsQueryValue)
      //   }, `${currentPage}${priceQuery}${boilerQuery}${partsQuery}`)
      //   return
      // }
      // if (isValidPriceQuery) {
      //   updateParamsAndFiltersFromQuery(() => {
      //     updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
      //   }, `${currentPage}${priceQuery}`)
      // }
      // if (isValidBoilerQuery && isValidPartsQuery) {
      //   updateParamsAndFiltersFromQuery(() => {
      //     setIsFilterInQuery(true)
      //     setBoilerManufacturersFromQuery(boilerQueryValue)
      //     setPartsManufacturersFromQuery(partsQueryValue)
      //   }, `${currentPage}${boilerQuery}${partsQuery}`)
      //   return
      // }
      // if (isValidBoilerQuery) {
      //   updateParamsAndFiltersFromQuery(() => {
      //     setIsFilterInQuery(true)
      //     setBoilerManufacturersFromQuery(boilerQueryValue)
      //   }, `${currentPage}${boilerQuery}`)
      // }
      // if (isValidPartsQuery) {
      //   updateParamsAndFiltersFromQuery(() => {
      //     setIsFilterInQuery(true)
      //     setPartsManufacturersFromQuery(partsQueryValue)
      //   }, `${currentPage}${partsQuery}`)
      // }
      // if (isValidPartsQuery && isValidPriceQuery) {
      //   updateParamsAndFiltersFromQuery(() => {
      //     updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
      //     setPartsManufacturersFromQuery(partsQueryValue)
      //   }, `${currentPage}${priceQuery}${partsQuery}`)
      // }
      // if (isValidBoilerQuery && isValidPriceQuery) {
      //   updateParamsAndFiltersFromQuery(() => {
      //     updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
      //     setBoilerManufacturersFromQuery(boilerQueryValue)
      //   }, `${currentPage}${priceQuery}${boilerQuery}`)
      // }
    } catch (error) {
      const err = error as Error
      if (err.message === 'URI malformed') {
        toast.warning('Неправильный url для фильтров')
        return
      }
      toast.error(err.message)
    }
  }

  const applyFilters = async () => {
    setIsFilterInQuery(true)

    try {
      setSpinner(true)
      const priceFrom = Math.ceil(priceRange[0])
      const priceTo = Math.ceil(priceRange[1])

      const priceQuery = isPriceRangeChanged
        ? `&priceFrom=${priceFrom}&priceTo=${priceTo}`
        : ''

      const boilers = boilerManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title)

      const parts = partsManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title)

      const encodedBoilerQuery = encodeURIComponent(JSON.stringify(boilers))
      const encodedPartsQuery = encodeURIComponent(JSON.stringify(parts))

      const boilerQuery = `&boiler=${encodedBoilerQuery}`
      const partsQuery = `&parts=${encodedPartsQuery}`

      const initialPage = currentPage > 0 ? 0 : currentPage

      if (boilers.length && parts.length && isPriceRangeChanged) {
        updateParamsAndFilter(
          {
            boiler: encodedBoilerQuery,
            parts: encodedPartsQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${priceQuery}${boilerQuery}${partsQuery}`
        )
        createURLParams({
          boiler: encodedBoilerQuery,
          parts: encodedPartsQuery,
          priceFrom,
          priceTo,
          offset: initialPage + 1,
        })

        const data = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${initialPage}${priceQuery}${boilerQuery}${partsQuery}`
        )

        setFiltredBoilerPart(data)

        return
      }
      if (isPriceRangeChanged) {
        createURLParams({
          priceFrom,
          priceTo,
          offset: initialPage + 1,
        })

        const data = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${initialPage}${priceQuery}`
        )

        setFiltredBoilerPart(data)
      }

      if (boilers.length && parts.length) {
        createURLParams({
          boiler: encodedBoilerQuery,
          parts: encodedPartsQuery,
          offset: initialPage + 1,
        })

        const data = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${initialPage}${boilerQuery}${partsQuery}`
        )

        setFiltredBoilerPart(data)
        return
      }

      if (boilers.length) {
        createURLParams({
          boiler: encodedBoilerQuery,
          offset: initialPage + 1,
        })

        const data = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${initialPage}${boilerQuery}`
        )

        setFiltredBoilerPart(data)
      }

      if (parts.length) {
        createURLParams({
          parts: encodedPartsQuery,
          offset: initialPage + 1,
        })

        const data = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${initialPage}${partsQuery}`
        )

        setFiltredBoilerPart(data)
      }

      if (boilers.length && isPriceRangeChanged) {
        createURLParams({
          boiler: encodedBoilerQuery,
          priceFrom,
          priceTo,
          offset: initialPage + 1,
        })

        const data = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${initialPage}${boilerQuery}${priceQuery}`
        )

        setFiltredBoilerPart(data)
      }

      if (parts.length && isPriceRangeChanged) {
        createURLParams({
          parts: encodedPartsQuery,
          priceFrom,
          priceTo,
          offset: initialPage + 1,
        })

        const data = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${initialPage}${partsQuery}${priceQuery}`
        )

        setFiltredBoilerPart(data)
      }
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  return (
    <>
      {isMobile.matches ? (
        <CatalogFiltersMobile
          closePopup={closePopup}
          spinner={spinner}
          applyFilters={applyFilters}
          priceRange={priceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          setPriceRange={setPriceRange}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          resetFilters={resetFilters}
          filtersMobileOpen={filtersMobileOpen}
        />
      ) : (
        <CatalogFiltersDesktop
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          spinner={spinner}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      )}
    </>
  )
}

export default CatalogFilters
