import { useUnit } from 'effector-react'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { $mode } from '@/context/mode'
import { formatPrice } from '@/utils/common'
import {
  $shoppingCart,
  removeShoppingCartItem,
  updateShoppingCart,
} from '@/context/shopping-cart'
import CartHoverCheckedSvg from '@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg'
import CartHoverSvg from '@/components/elements/CartHoverSvg/CartHoverSvg'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import { toggleCartItem } from '@/utils/shopping-cart'
import { $user } from '@/context/user'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import styles from '@/styles/part/index.module.scss'
import { $boilerPart } from '@/context/boiler-part'
import {
  $boilerParts,
  setBoilerPartsByPopulatiry,
  setBoilerParts as setBoilerPartsFx,
} from '@/context/boiler-parts'

import { useMedia } from '@/hooks/useMediaQuery'
import { GetBoilerPartFx } from '@/api/boilerParts/boilerParts'
import PartImagesList from '@/components/modules/PartPage/PartImagesList'
import PartAccordion from '@/components/modules/PartPage/PartAccordion'
import PartTabs from '@/components/modules/PartPage/PartTabs'

const PagePart = () => {
  const [
    mode,
    user,
    boilerPart,
    boilerParts,
    cartItems,
    setBoilerParts,
    removeShoppingCartItemFx,
    updateShoppingCartFx,
    setBoilerPartsByPopulatiryFx,
  ] = useUnit([
    $mode,
    $user,
    $boilerPart,
    $boilerParts,
    $shoppingCart,
    setBoilerPartsFx,
    removeShoppingCartItem,
    updateShoppingCart,
    setBoilerPartsByPopulatiry,
  ])

  const isMobile = useMedia('(max-width: 850px)')
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isInCart = cartItems.some((item) => item.partId === boilerPart.id)

  // const [spinnerToggleCart,setSpinnerToggleCart] = useStore(removeFromCartFx.pending)
  const [spinnerToggleCart, setSpinnerToggleCart] = useState(false)
  const [spinnerSlider, setSpinnerSlider] = useState(false)

  useEffect(() => {
    loadBoilerPart()
  }, [])

  const loadBoilerPart = async () => {
    try {
      setSpinnerSlider(true)
      const data = await GetBoilerPartFx('/boiler-parts?limit=20&offset=0')

      setBoilerParts(data)
      setBoilerPartsByPopulatiryFx()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => {
        setSpinnerSlider(false)
      }, 1000)
    }
  }

  const toggleToCart = () =>
    toggleCartItem(
      user.username,
      boilerPart.id,
      isInCart,
      setSpinnerToggleCart,
      removeShoppingCartItemFx,
      updateShoppingCartFx
    )

  return (
    <section>
      <div className="container">
        <div className={`${styles.part__top} ${darkModeClass}`}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            {boilerPart.name}
          </h2>
          <div className={styles.part__inner}>
            <PartImagesList />
            <div className={styles.part__info}>
              <span className={`${styles.part__info__price} ${darkModeClass}`}>
                {formatPrice(boilerPart.price || 0)} P
              </span>
              <span className={styles.part__info__stock}>
                {boilerPart.in_stock > 0 ? (
                  <span className={styles.part__info__stock__success}>
                    Есть на складе
                  </span>
                ) : (
                  <span className={styles.part__info__stock__not}>
                    Нет на складе
                  </span>
                )}
              </span>
              <span className={styles.part__info__code}>
                Артикул: {boilerPart.vendor_code}
              </span>
              <button
                className={`${styles.part__info__btn} ${
                  isInCart ? styles.in_cart : ''
                }`}
                onClick={toggleToCart}
              >
                {spinnerToggleCart ? (
                  <span
                    className={spinnerStyles.spinner}
                    style={{ top: 10, left: '45%' }}
                  />
                ) : (
                  <>
                    <span className={styles.part__info__btn__icon}>
                      {isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}
                    </span>
                    {isInCart ? (
                      <span>Добавлено в карзину</span>
                    ) : (
                      <span>Положить в корзину</span>
                    )}
                  </>
                )}
              </button>
              {!isMobile.matches && <PartTabs />}
            </div>
          </div>
        </div>
        {isMobile.matches && (
          <div className={styles.part__accordion}>
            <div className={styles.part__accordion__inner}>
              <PartAccordion title="Описание">
                <div
                  className={`${styles.part__accordion__content} ${darkModeClass}`}
                >
                  <h3
                    className={`${styles.part__tabs__content__title} ${darkModeClass}`}
                  >
                    {boilerPart.name}
                  </h3>
                  <p
                    className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                  >
                    {boilerPart.description}
                  </p>
                </div>
              </PartAccordion>
            </div>
            <PartAccordion title="Совместимость">
              <div
                className={`${styles.part__accordion__content} ${darkModeClass}`}
              >
                <p
                  className={`${styles.part__tabs__content__text} ${darkModeClass}`}
                >
                  {boilerPart.compatibility}
                </p>
              </div>
            </PartAccordion>
          </div>
        )}
        <div className={styles.part__bottom}>
          <h2 className={`${styles.part__title} ${darkModeClass}`}>
            Вам понравится
          </h2>
          <DashboardSlider
            goToPartPage
            spinner={spinnerSlider}
            items={boilerParts.rows || []}
          />
        </div>
      </div>
    </section>
  )
}

export default PagePart
