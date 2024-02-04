import Link from 'next/link'
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
import { $user } from '@/context/user'
import styles from '@/styles/catalog/index.module.scss'
import { useUnit } from 'effector-react'
import { IBoilerPart } from '@/types/boilerPart'
import { toggleCartItem } from '@/utils/shopping-cart'
import { useState } from 'react'

const CatalogItem = ({ item }: { item: IBoilerPart }) => {
  const [mode, shoppingCart, removeShoppingCartItemFx, updateShoppingCartFx] =
    useUnit([$mode, $shoppingCart, removeShoppingCartItem, updateShoppingCart])
  const user = useUnit($user)

  const isInCart = shoppingCart.some((cartItem) => cartItem.partId === item.id)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  // const spinner = useStore(removeFromCart.pending)

  const [spinner, setSpinner] = useState(false)

  const toggleToCart = () =>
    toggleCartItem(
      user.username,
      item.id,
      isInCart,
      setSpinner,
      removeShoppingCartItemFx,
      updateShoppingCartFx
    )

  return (
    <li className={`${styles.catalog__list__item} ${darkModeClass}`}>
      <img src={JSON.parse(item.images)[0]} alt={item.name} />
      <div className={styles.catalog__list__item__inner}>
        <Link href={`/catalog/${item.id}`} passHref legacyBehavior>
          <h3 className={styles.catalog__list__item__title}>{item.name}</h3>
        </Link>
        <span className={styles.catalog__list__item__code}>
          Артикул: {item.boiler_manufacturer}
        </span>
        <span className={styles.catalog__list__item__price}>
          {formatPrice(item.price)} P
        </span>
      </div>
      <button
        className={`${styles.catalog__list__item__cart} ${
          isInCart ? styles.added : ''
        }`}
        disabled={spinner}
        onClick={toggleToCart}
      >
        {spinner ? (
          <div className={spinnerStyles.spinner} style={{ top: 6, left: 6 }} />
        ) : (
          <span>{isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}</span>
        )}
      </button>
    </li>
  )
}

export default CatalogItem
