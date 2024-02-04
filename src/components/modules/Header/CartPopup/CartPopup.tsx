import { forwardRef, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { AnimatePresence, motion } from 'framer-motion'
import { $mode } from '@/context/mode'
import { withClickOutside } from '@/utils/withClickOutside'
import ShoppingCartSvg from '@/components/elements/ShoppingCartSvg/ShoppingCartSvg'
import CartPopupItem from './CartPopupItem'
import styles from '@/styles/cartPopup/index.module.scss'
import { formatPrice } from '@/utils/common'
import { IWrapperComponentProps } from '@/types/common'
import { useUnit } from 'effector-react'
import {
  $shoppingCart,
  $totalPrice,
  setShoppingCart,
  setTotalPrice,
} from '@/context/shopping-cart'
import { $user } from '@/context/user'
import { GetCartItemFx } from '@/api/shopping-cart/shopping-cart'

const CartPopup = forwardRef<HTMLDivElement, IWrapperComponentProps>(
  ({ open, setOpen }, ref) => {
    const [
      mode,
      shoppingCart,
      user,
      setShoppingCartFx,
      setTotalPriceFx,
      totalPrice,
    ] = useUnit([
      $mode,
      $shoppingCart,
      $user,
      setShoppingCart,
      setTotalPrice,
      $totalPrice,
    ])

    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

    const disableCart = false

    const toggleCartDropDown = () => {
      setOpen(!open)
    }

    useEffect(() => {
      if (user.userId) {
        loadCartItems()
      }
    }, [user])

    useEffect(() => {
      setTotalPriceFx(
        shoppingCart.reduce(
          (defaultCount, item) => defaultCount + item.totalPrice,
          0
        )
      )
    }, [shoppingCart])

    const loadCartItems = async () => {
      try {
        const cartItems = await GetCartItemFx(`/shopping-cart/${user.userId}`)

        setShoppingCartFx(cartItems)
      } catch (error) {
        toast.error((error as Error).message)
      }
    }

    return (
      <div className={styles.cart} ref={ref}>
        {disableCart ? (
          <button
            className={`${styles.cart__btn} ${darkModeClass}`}
            style={{ cursor: 'auto' }}
          >
            <span className={styles.cart__svg}>
              <ShoppingCartSvg />
            </span>
            <span className={styles.cart__text}>Корзина</span>
          </button>
        ) : (
          <button
            className={`${styles.cart__btn} ${darkModeClass}`}
            onClick={toggleCartDropDown}
          >
            {!!shoppingCart.length && (
              <span className={styles.cart__btn__count}>
                {shoppingCart.length}
              </span>
            )}
            <span className={styles.cart__svg}>
              <ShoppingCartSvg />
            </span>
            <span className={styles.cart__text}>Корзина</span>
          </button>
        )}
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className={`${styles.cart__popup} ${darkModeClass}`}
              style={{ transformOrigin: 'right top' }}
            >
              <h3 className={styles.cart__popup__title}>Корзина</h3>
              <ul className={styles.cart__popup__list}>
                {shoppingCart.length ? (
                  shoppingCart.map((item) => (
                    <CartPopupItem key={item.id} item={item} />
                  ))
                ) : (
                  <li className={styles.cart__popup__empty}>
                    <span
                      className={`${styles.cart__popup__empty__text} ${darkModeClass}`}
                    >
                      Корзина пуста
                    </span>
                  </li>
                )}
              </ul>
              <div className={styles.cart__popup__footer}>
                <div className={styles.cart__popup__footer__total}>
                  <span
                    className={`${styles.cart__popup__footer__text} ${darkModeClass}`}
                  >
                    Общая сумма заказа:
                  </span>
                  <span className={styles.cart__popup__footer__price}>
                    {formatPrice(totalPrice)} P
                  </span>
                </div>
                <Link href="/order" passHref legacyBehavior>
                  <button
                    className={styles.cart__popup__footer__btn}
                    disabled={!shoppingCart.length}
                  >
                    Оформить заказ
                  </button>
                </Link>
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

CartPopup.displayName = 'CartPopup'

export default withClickOutside(CartPopup)
