'use client'

import { $mode } from '@/context/mode'
import styles from '@/styles/catalog/index.module.scss'
import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import FilterSvg from '@/components/elements/FilterSvg/FilterSvg'
import { useUnit } from 'effector-react'
import ManufacturersBlock from '@/components/modules/CatalogPage/ManufacturersBlock'
import { GetBestselleresOrNewPartsFx } from '@/api/boilerParts/boilerParts'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { IBoilerParts } from '@/types/boilerPart'
import {
  $boilerManufacturers,
  $boilerParts,
  $filtredBoilerPart,
  $partManufacturers,
  setBoilerManufacturers as setBoilerManufacturersFx,
  setBoilerParts,
  setPartManufacturers as setPartManufacturersFx,
  updateBoilerManufacturers as updateBoilerManufacturersFx,
  updatePartManufacturers as updatePartManufacturersFx,
} from '@/context/boiler-parts'
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem'
import CatalogFilters from '@/components/modules/CatalogPage/CatalogFilters'
import ReactPaginate from 'react-paginate'
import FilterSelect from '@/components/modules/CatalogPage/FilterSelect'
import { usePopup } from '@/hooks/usePopup'
import { checkQueryParams } from '@/utils/catalog'

const CatalogPage = () => {
  const [
    mode,
    boilerParts,
    setBoilerPartsFx,
    boilerManufacturers,
    partsManufacturers,
    updatePartManufacturers,
    updateBoilerManufacturers,
    setBoilerManufacturers,
    setPartManufacturers,
    filteredBoilerParts,
  ] = useUnit([
    $mode,
    $boilerParts,
    setBoilerParts,
    $boilerManufacturers,
    $partManufacturers,
    updatePartManufacturersFx,
    updateBoilerManufacturersFx,
    setBoilerManufacturersFx,
    setPartManufacturersFx,
    $filtredBoilerPart,
  ])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = new URLSearchParams(searchParams.toString())
  const router = useRouter()

  const createQueryString = useCallback(
    (name: string, value: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, String(value))

      return params.toString()
    },
    [searchParams]
  )

  const [spinner, setSpinner] = useState(false)
  const [priceRange, setPriceRange] = useState([1000, 9000])
  const [isFilterInQuery, setIsFilterInQuery] = useState(false)
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false)
  const pagesCount = Math.ceil(boilerParts.count / 20)

  const firstParam = params.get('offset')
  const isValidOffset = firstParam && !isNaN(+firstParam) && +firstParam > 0

  const [currentPage, setCurrentPage] = useState(
    isValidOffset ? +firstParam - 1 : 0
  )

  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isAnyBoilerManufacturerChecked = boilerManufacturers.some(
    (item) => item.checked
  )
  const isAnyPartsManufacturerChecked = partsManufacturers.some(
    (item) => item.checked
  )
  const resetFilterBtnDisabled = !(
    isPriceRangeChanged ||
    isAnyBoilerManufacturerChecked ||
    isAnyPartsManufacturerChecked
  )
  const { toggleOpen, open, closePopup } = usePopup()

  useEffect(() => {
    loadBoilerParts()
  }, [isFilterInQuery, filteredBoilerParts])

  const loadBoilerParts = async () => {
    try {
      setSpinner(true)
      const data = await GetBestselleresOrNewPartsFx(
        '/boiler-parts?limit=20&offset=0'
      )

      if (!isValidOffset) {
        router.push(pathname + '?' + createQueryString('offset', 1))
        resetPagination(data)
        return
      }

      if (isValidOffset) {
        if (+firstParam > Math.ceil(data.count / 20)) {
          router.push(pathname + '?' + createQueryString('offset', 1))

          setCurrentPage(0)
          setBoilerPartsFx(isFilterInQuery ? filteredBoilerParts : data)
          return
        }

        const offset = +firstParam - 1
        const result = await GetBestselleresOrNewPartsFx(
          `/boiler-parts?limit=20&offset=${offset}`
        )

        setCurrentPage(offset)
        setBoilerPartsFx(isFilterInQuery ? filteredBoilerParts : result)
        return
      }

      setCurrentPage(0)
      setBoilerPartsFx(isFilterInQuery ? filteredBoilerParts : data)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetPagination = (data: IBoilerParts) => {
    setCurrentPage(0)
    setBoilerPartsFx(data)
  }

  const handlePageChange = async ({ selected }: { selected: number }) => {
    try {
      setSpinner(true)
      const data = await GetBestselleresOrNewPartsFx(
        '/boiler-parts?limit=20&offset=0'
      )

      if (selected > pagesCount) {
        resetPagination(isFilterInQuery ? filteredBoilerParts : data)
        return
      }

      const page = params.get('offset')
      if (isValidOffset && page && +page > Math.ceil(data.count / 2)) {
        resetPagination(isFilterInQuery ? filteredBoilerParts : data)
        return
      }

      const { isValidBoilerQuery, isValidPartsQuery, isValidPriceQuery } =
        checkQueryParams(searchParams)

      const boilerQuery = params.get('boiler')
      const partsQuery = params.get('parts')
      const priceFromQuery = params.get('priceFrom')
      const pricTOeQuery = params.get('priceTo')

      const result = await GetBestselleresOrNewPartsFx(
        `/boiler-parts?limit=20&offset=${selected}${
          isFilterInQuery && isValidBoilerQuery ? `&boiler=${boilerQuery}` : ''
        }${isFilterInQuery && isValidPartsQuery ? `&parts=${partsQuery}` : ''}${
          isFilterInQuery && isValidPriceQuery && pricTOeQuery
            ? `&priceFrom=${priceFromQuery}&priceTo=${pricTOeQuery}`
            : ''
        }`
      )

      router.push(pathname + '?' + createQueryString('offset', selected + 1))

      setCurrentPage(selected)
      setBoilerPartsFx(result)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetFilters = async () => {
    try {
      const data = await GetBestselleresOrNewPartsFx(
        '/boiler-parts?limit=20&offset=0'
      )

      router.push(pathname + '?' + `first=cheap&offset=1`)

      setBoilerManufacturers(
        boilerManufacturers.map((item) => ({ ...item, checked: false }))
      )
      setPartManufacturers(
        partsManufacturers.map((item) => ({ ...item, checked: false }))
      )
      setBoilerPartsFx(data)
      setPriceRange([1000, 9000])
      setIsPriceRangeChanged(false)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <section className={styles.catalog}>
      <div className={`container ${styles.catalog__container}`}>
        <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог товаров
        </h2>
        <div className={`${styles.catalog__top} ${darkModeClass}`}>
          <AnimatePresence>
            {isAnyBoilerManufacturerChecked && (
              <ManufacturersBlock
                title="Производитель котлов:"
                event={updateBoilerManufacturers}
                manufacturersList={boilerManufacturers}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAnyPartsManufacturerChecked && (
              <ManufacturersBlock
                title="Производитель запчастей:"
                event={updatePartManufacturers}
                manufacturersList={partsManufacturers}
              />
            )}
          </AnimatePresence>
          <div className={styles.catalog__top__inner}>
            <button
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={resetFilterBtnDisabled}
              onClick={resetFilters}
            >
              Сбросить фильтр
            </button>
            <button
              className={styles.catalog__top__mobile_btn}
              onClick={toggleOpen}
            >
              <span className={styles.catalog__top__mobile_btn__svg}>
                <FilterSvg />
              </span>
              <span className={styles.catalog__top__mobile_btn__text}>
                Фильтр
              </span>
            </button>
            <FilterSelect setSpinner={setSpinner} />
          </div>
        </div>
        <div className={styles.catalog__bottom}>
          <div className={styles.catalog__bottom__inner}>
            <CatalogFilters
              priceRange={priceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              setPriceRange={setPriceRange}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              resetFilters={resetFilters}
              isPriceRangeChanged={isPriceRangeChanged}
              currentPage={currentPage}
              setIsFilterInQuery={setIsFilterInQuery}
              closePopup={closePopup}
              filtersMobileOpen={open}
            />

            {spinner ? (
              <ul className={skeletonStyles.skeleton}>
                {Array.from(new Array(20)).map((_, i) => (
                  <li
                    key={i}
                    className={`${skeletonStyles.skeleton__item} ${
                      mode === 'dark' ? `${skeletonStyles.dark_mode}` : ''
                    }`}
                  >
                    <div className={skeletonStyles.skeleton__item__light} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.catalog__list}>
                {boilerParts.rows?.length ? (
                  boilerParts.rows.map((item) => (
                    <CatalogItem item={item} key={item.id} />
                  ))
                ) : (
                  <span>Список товаров пуст...</span>
                )}
              </ul>
            )}
          </div>
          <ReactPaginate
            containerClassName={styles.catalog__bottom__list}
            pageClassName={styles.catalog__bottom__list__item}
            pageLinkClassName={styles.catalog__bottom__list__item__link}
            previousClassName={styles.catalog__bottom__list__prev}
            nextClassName={styles.catalog__bottom__list__next}
            breakClassName={styles.catalog__bottom__list__break}
            breakLinkClassName={`${styles.catalog__bottom__list__break__link} ${darkModeClass}`}
            breakLabel="..."
            pageCount={pagesCount}
            forcePage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  )
}

export default CatalogPage
