import { $mode } from '@/context/mode'
import Link from 'next/link'
import DeleteSvg from '@/components/elements/DeleteSvg/DeleteSvg'
import { IShoppingCartItem } from '../../../../types/shopping-cart'
import { formatPrice } from '@/utils/common'
import CartItemCounter from '@/components/elements/CartItemCounter/CartItemCounter'
// import { usePrice } from '@/hooks/usePrice'
import styles from '@/styles/cartPopup/index.module.scss'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import { useUnit } from 'effector-react'
import { removeItemFromCart } from '@/utils/shopping-cart'
import { useEffect, useState } from 'react'
import {
  removeShoppingCartItem,
  updateCartItemTotalPrice as updateCartItemTotalPriceFx,
} from '@/context/shopping-cart'
import { updateTotalPrice } from '@/utils/shopping-cart'

const CartPopupItem = ({ item }: { item: IShoppingCartItem }) => {
  const [mode, removeShoppingCartItemFx, updateCartItemTotalPrice] = useUnit([
    $mode,
    removeShoppingCartItem,
    updateCartItemTotalPriceFx,
  ])
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const [spinner, setSpinner] = useState(false)
  const [price, setPrice] = useState(item.price)

  const spinnerDarkModeClass =
    mode === 'dark' ? '' : `${spinnerStyles.dark_mode}`

  const incPrice = () => {
    setPrice(price + item.price)
  }
  const decPrice = () => setPrice(price - item.price)

  useEffect(() => {
    setPrice(price * item.count)
  }, [])

  useEffect(() => {
    updateTotalPrice(price, item.partId, updateCartItemTotalPrice)
  }, [price])

  const deleteCartItem = () =>
    removeItemFromCart(item.partId, setSpinner, removeShoppingCartItemFx)

  // const { price, spinner, decreasePrice, deleteCartItem, increasePrice } =
  //   usePrice(item.count, item.partId, item.price)

  return (
    <li className={styles.cart__popup__list__item}>
      <div className={styles.cart__popup__list__item__top}>
        <div className={styles.cart__popup__list__item__img}>
          <img src={item.image} alt={item.name} />
        </div>
        <Link href={`/catalog/${item.partId}`} passHref legacyBehavior>
          <a
            className={`${styles.cart__popup__list__item__text} ${darkModeClass}`}
          >
            <span>
              {item.name.replace('.', '')}, {item.parts_manufacturer},
              {item.boiler_manufacturer}
            </span>
          </a>
        </Link>
        <button onClick={deleteCartItem}>
          <span>
            {spinner ? (
              <span
                className={`${spinnerStyles.spinner} ${spinnerDarkModeClass}`}
                style={{ top: 0, left: 0, width: 20, height: 20 }}
              />
            ) : (
              <DeleteSvg />
            )}
          </span>
        </button>
      </div>
      <div className={styles.cart__popup__list__item__bottom}>
        {item.in_stock === 0 ? (
          <span className={styles.cart__popup__list__item__empty}>
            Нет на складе
          </span>
        ) : (
          <CartItemCounter
            totalCount={item.in_stock}
            partId={item.partId}
            initialCount={item.count}
            increasePrice={incPrice}
            decreasePrice={decPrice}
          />
        )}

        <span
          className={`${styles.cart__popup__list__item__price} ${darkModeClass}`}
        >
          {formatPrice(price)} P
        </span>
      </div>
    </li>
  )
}

export default CartPopupItem
