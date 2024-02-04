import Link from 'next/link'
import { IShoppingCartItem } from '@/types/shopping-cart'
import { $mode } from '@/context/mode'
import CartItemCounter from '@/components/elements/CartItemCounter/CartItemCounter'
import { formatPrice } from '@/utils/common'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import styles from '@/styles/order/index.module.scss'
import { useUnit } from 'effector-react'
import { useMedia } from '@/hooks/useMediaQuery'
import {
  removeShoppingCartItem,
  updateCartItemTotalPrice as updateCartItemTotalPriceFx,
} from '@/context/shopping-cart'
import { usePrice } from '@/hooks/usePrice'

const OrderItem = ({ item }: { item: IShoppingCartItem }) => {
  const [mode, updateCartItemTotalPrice, removeShoppingCartItemFx] = useUnit([
    $mode,
    updateCartItemTotalPriceFx,
    removeShoppingCartItem,
  ])
  const isMedia1160 = useMedia('(max-width: 1160px)')
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const spinnerDarkModeClass =
    mode === 'dark' ? '' : `${spinnerStyles.dark_mode}`

  const { price, spinner, decPrice, deleteCartItem, incPrice } = usePrice(
    item.count,
    item.partId,
    item.price,
    updateCartItemTotalPrice,
    removeShoppingCartItemFx
  )

  return (
    <li className={styles.order__cart__list__item}>
      <div className={styles.order__cart__list__item__left}>
        <div className={styles.order__cart__list__item__left__inner}>
          <div className={styles.order__cart__list__item__img}>
            <img src={item.image} alt={item.name} />
          </div>
          <Link href={`/catalog/${item.partId}`} passHref legacyBehavior>
            <a
              className={`${styles.order__cart__list__item__text} ${darkModeClass}`}
            >
              <span>
                {item.name.replace('.', '')}, {item.parts_manufacturer},{' '}
                {item.boiler_manufacturer}
              </span>
            </a>
          </Link>
        </div>
        {isMedia1160.matches &&
          (item.in_stock === 0 ? (
            <span className={styles.order__cart__list__item__empty}>
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
          ))}
      </div>
      <div className={styles.order__cart__list__item__right}>
        {!isMedia1160.matches &&
          (item.in_stock === 0 ? (
            <span className={styles.order__cart__list__item__empty}>
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
          ))}
        <span
          className={`${styles.order__cart__list__item__price} ${darkModeClass}`}
        >
          {formatPrice(price)} P
        </span>
        <button
          className={styles.order__cart__list__item__delete}
          onClick={deleteCartItem}
        >
          {spinner ? (
            <span
              className={`${spinnerStyles.spinner} ${spinnerDarkModeClass}`}
              style={{ top: '-13px', left: '-30px', width: 25, height: 25 }}
            />
          ) : (
            'Удалить'
          )}
        </button>
      </div>
    </li>
  )
}

export default OrderItem
