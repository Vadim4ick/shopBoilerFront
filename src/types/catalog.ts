export interface IQueryParams {
  offset: string
  firs: string
  boiler: string
  parts: string
  priceFrom: string
  priceTo: string
  partId: string
}

export interface IFilterCheckboxItem {
  title: string
  checked: boolean
  id?: string
  event: (payload: IFilterCheckboxItem) => IFilterCheckboxItem
}

export interface IManufacturersBlockProps {
  title: string
  event: (payload: IFilterCheckboxItem) => IFilterCheckboxItem
  manufacturersList: IFilterCheckboxItem[]
}

export interface IManufacturersBlockItemProps {
  item: IFilterCheckboxItem
  event: (payload: IFilterCheckboxItem) => IFilterCheckboxItem
}

export interface IFilterManufacturerAccordionProps {
  manufacturersList: IFilterCheckboxItem[]
  title: string | false
  setManufacturer: (payload: IFilterCheckboxItem[]) => IFilterCheckboxItem[]
  updateManufacturer: (payload: IFilterCheckboxItem) => IFilterCheckboxItem
}

interface ICatalogBaseTypes {
  priceRange: number[]
  setPriceRange: (arg0: number[]) => void
  setIsPriceRangeChanged: (arg0: boolean) => void
}

interface ICatalogFiltersBaseTypes {
  resetFilterBtnDisabled: boolean
  resetFilters: VoidFunction
}

export interface ICatalogFiltersProps
  extends ICatalogBaseTypes,
    ICatalogFiltersBaseTypes {
  isPriceRangeChanged: boolean
  currentPage: number
  setIsFilterInQuery: (arg0: boolean) => void
  closePopup: VoidFunction
  filtersMobileOpen: boolean
}

export type IPriceRangeProps = ICatalogBaseTypes

export interface ICatalogFilterDesktopProps
  extends ICatalogBaseTypes,
    ICatalogFiltersBaseTypes {
  spinner: boolean
  applyFilters: VoidFunction
}

export interface ICatalogFilterMobileProps
  extends ICatalogBaseTypes,
    ICatalogFiltersBaseTypes {
  spinner: boolean
  applyFilters: VoidFunction
  closePopup: VoidFunction
  filtersMobileOpen: boolean
}

export interface IFiltersPopupTop {
  resetBtnText: string
  title: string
  resetFilters: VoidFunction
  resetFilterBtnDisabled: boolean
  closePopup: VoidFunction
}

export interface IFiltersPopupProps extends IFilterManufacturerAccordionProps {
  resetFilterBtnDisabled: boolean
  resetAllManufacturers: VoidFunction
  handleClosePopup: VoidFunction
  applyFilters: VoidFunction
  openPopup: boolean
}
