import { useCallback, useEffect, useState } from 'react'
import Select from 'react-select'
import { $mode } from '@/context/mode'
import {
  controlStyles,
  menuStyles,
  selectStyles,
} from '@/styles/catalog/select'
import { optionStyles } from '@/styles/searchInput'
import { IOption, SelectOptionType } from '@/types/common'
import { createSelectOption } from '@/utils/common'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useUnit } from 'effector-react'
import { categoryOptions } from '@/utils/selectContents'
import {
  $boilerParts,
  setBoilerPartsByPopulatiry,
  setBoilerPartsCheapFirst,
  setBoilerPartsExpensiveFirst,
} from '@/context/boiler-parts'

const FilterSelect = ({
  setSpinner,
}: {
  setSpinner: (arg0: boolean) => void
}) => {
  const [
    mode,
    boilerParts,
    setBoilerPartsCheapFirstFx,
    setBoilerPartsExpensiveFirstFx,
    setBoilerPartsByPopulatiryFx,
  ] = useUnit([
    $mode,
    $boilerParts,
    setBoilerPartsCheapFirst,
    setBoilerPartsExpensiveFirst,
    setBoilerPartsByPopulatiry,
  ])
  const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const params = new URLSearchParams(searchParams.toString())
  const router = useRouter()

  useEffect(() => {
    if (boilerParts.rows) {
      switch (params.get('first')) {
        case 'cheap':
          updateCategoryOption('Сначала дешевые')
          setBoilerPartsCheapFirstFx()
          break
        case 'expensive':
          updateCategoryOption('Сначала дорогие')
          setBoilerPartsExpensiveFirstFx()
          break
        case 'popular':
          updateCategoryOption('По популярности')
          setBoilerPartsByPopulatiryFx()
          break
        default:
          updateCategoryOption('Сначала дешевые')
          setBoilerPartsCheapFirstFx()
          break
      }
    }
  }, [boilerParts.rows, searchParams])

  const updateCategoryOption = (value: string) =>
    setCategoryOption({ value, label: value })

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleSortOptionChange = (selectedOption: SelectOptionType) => {
    setSpinner(true)
    setCategoryOption(selectedOption)

    switch ((selectedOption as IOption).value) {
      case 'Сначала дешевые':
        setBoilerPartsCheapFirstFx()

        router.push(pathname + '?' + createQueryString('first', 'cheap'))
        break
      case 'Сначала дорогие':
        setBoilerPartsExpensiveFirstFx()

        router.push(pathname + '?' + createQueryString('first', 'expensive'))
        break
      case 'По популярности':
        setBoilerPartsByPopulatiryFx()
        router.push(pathname + '?' + createQueryString('first', 'popular'))
        break
    }
    setTimeout(() => setSpinner(false), 1000)
  }

  return (
    <Select
      placeholder="Я ищу..."
      value={categoryOption || createSelectOption('Сначала дешевые')}
      onChange={handleSortOptionChange}
      styles={{
        ...selectStyles,
        control: (defaultStyles) => ({
          ...controlStyles(defaultStyles, mode),
        }),
        input: (defaultStyles) => ({
          ...defaultStyles,
          color: mode === 'dark' ? '#f2f2f2' : '#222222',
        }),
        menu: (defaultStyles) => ({
          ...menuStyles(defaultStyles, mode),
        }),
        option: (defaultStyles, state) => ({
          ...optionStyles(defaultStyles, state, mode),
        }),
      }}
      isSearchable={false}
      options={categoryOptions}
    />
  )
}

export default FilterSelect
