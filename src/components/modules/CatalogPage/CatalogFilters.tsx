import { useMedia } from '@/hooks/useMediaQuery'
import CatalogFiltersDesktop from './CatalogFiltersDesktop'
import { ICatalogFiltersProps } from '@/types/catalog'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CatalogFiltersMobile from './CatalogFiltersMobile'
import { useUnit } from 'effector-react'
import {
  $boilerManufacturers,
  $partManufacturers,
  setBoilerManufacturersFromQuery as setBoilerManufacturersFromQueryFx,
  setFiltredBoilerPart as setFiltredBoilerPartFx,
  setPartManufacturersFromQuery as setPartManufacturersFromQueryFx,
} from '@/context/boiler-parts'
import { GetBestselleresOrNewPartsFx } from '@/api/boilerParts/boilerParts'
import { checkQueryParams } from '@/utils/catalog'

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
  const [
    boilerManufacturers,
    partsManufacturers,
    setFiltredBoilerPart,
    setBoilerManufacturersFromQuery,
    setPartManufacturersFromQuery,
  ] = useUnit([
    $boilerManufacturers,
    $partManufacturers,
    setFiltredBoilerPartFx,
    setBoilerManufacturersFromQueryFx,
    setPartManufacturersFromQueryFx,
  ])

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
    // const initialPage = currentPage > 0 ? 0 : currentPage

    router.push(pathname + '?' + `first=cheap`)

    createURLParams({
      ...updatedParams,
    })

    const data = await GetBestselleresOrNewPartsFx(
      `/boiler-parts?limit=20&offset=${path}`
    )

    setFiltredBoilerPart(data)
  }

  const updateParamsAndFiltersFromQuery = async (
    callback: VoidFunction,
    path: string
  ) => {
    callback()

    const data = await GetBestselleresOrNewPartsFx(
      `/boiler-parts?limit=20&offset=${path}`
    )

    setFiltredBoilerPart(data)
  }

  const applyFiltersFromQuery = async () => {
    try {
      const {
        boilerQueryValue,
        isValidBoilerQuery,
        isValidPartsQuery,
        isValidPriceQuery,
        partsQueryValue,
        priceFromQueryValue,
        priceToQueryValue,
      } = checkQueryParams(searchParams)

      const boilerQuery = `&boiler=${searchParams.get('boiler')}`
      const partsQuery = `&parts=${searchParams.get('parts')}`
      const priceQuery = `&priceFrom=${priceFromQueryValue}&priceTo=${priceToQueryValue}`

      if (isValidBoilerQuery && isValidPartsQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
          setBoilerManufacturersFromQuery(boilerQueryValue)
          setPartManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${priceQuery}${boilerQuery}${partsQuery}`)
        return
      }

      if (isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
        }, `${currentPage}${priceQuery}`)
      }

      if (isValidBoilerQuery && isValidPartsQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true)
          setBoilerManufacturersFromQuery(boilerQueryValue)
          setPartManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${boilerQuery}${partsQuery}`)
        return
      }
      if (isValidBoilerQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true)
          setBoilerManufacturersFromQuery(boilerQueryValue)
        }, `${currentPage}${boilerQuery}`)
      }
      if (isValidPartsQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true)
          setPartManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${partsQuery}`)
      }
      if (isValidPartsQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
          setPartManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${priceQuery}${partsQuery}`)
      }
      if (isValidBoilerQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
          setBoilerManufacturersFromQuery(boilerQueryValue)
        }, `${currentPage}${priceQuery}${boilerQuery}`)
      }
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

        return
      }
      if (isPriceRangeChanged) {
        updateParamsAndFilter(
          {
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${priceQuery}`
        )
      }

      if (boilers.length && parts.length) {
        updateParamsAndFilter(
          {
            boiler: encodedBoilerQuery,
            parts: encodedPartsQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${boilerQuery}${partsQuery}`
        )
        return
      }

      if (boilers.length) {
        updateParamsAndFilter(
          {
            boiler: encodedBoilerQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${boilerQuery}`
        )
      }

      if (parts.length) {
        updateParamsAndFilter(
          {
            parts: encodedPartsQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${partsQuery}`
        )
      }

      if (boilers.length && isPriceRangeChanged) {
        updateParamsAndFilter(
          {
            boiler: encodedBoilerQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${boilerQuery}${priceQuery}`
        )
      }

      if (parts.length && isPriceRangeChanged) {
        updateParamsAndFilter(
          {
            parts: encodedPartsQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${partsQuery}${priceQuery}`
        )
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
