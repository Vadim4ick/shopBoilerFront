import { useUnit } from 'effector-react'
import { $mode } from '@/context/mode'
import { IFilterManufacturerAccordionProps } from '@/types/catalog'
import Accordion from '@/components/elements/Accordion/Accordion'
import FilterCheckboxItem from './FilterCheckboxItem'
import styles from '@/styles/catalog/index.module.scss'
import { useMedia } from '@/hooks/useMediaQuery'

const FilterManufacturerAccordion = ({
  manufacturersList,
  title,
  updateManufacturer,
  setManufacturer,
}: IFilterManufacturerAccordionProps) => {
  const [mode] = useUnit([$mode])
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isMobile = useMedia('(max-width: 820px)')

  const chooseAllManufacturers = () =>
    setManufacturer(
      manufacturersList.map((item) => ({ ...item, checked: true }))
    )

  return (
    <Accordion
      title={title}
      titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
      arrowOpenClass={styles.open}
      isMobileForFilters={isMobile.matches}
      hideArrowClass={isMobile.matches ? styles.hide_arrow : ''}
    >
      <div className={styles.filters__manufacturer__inner}>
        <button
          className={styles.filters__manufacturer__select_all}
          onClick={chooseAllManufacturers}
        >
          Выбрать все
        </button>
        <ul className={styles.filters__manufacturer__list}>
          {manufacturersList.map((item) => (
            <FilterCheckboxItem
              title={item.title}
              id={item.id}
              key={item.id}
              checked={item.checked}
              event={updateManufacturer}
            />
          ))}
        </ul>
        <div style={{ height: 24 }} />
      </div>
    </Accordion>
  )
}

export default FilterManufacturerAccordion
