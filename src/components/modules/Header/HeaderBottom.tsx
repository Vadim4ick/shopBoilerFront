import { useUnit } from 'effector-react'
import Link from 'next/link'
import { $mode } from '@/context/mode'
import SearchInput from '@/components/elements/Header/SearchInput'
import ModeToggler from '@/components/elements/ModeToggler/ModeToggler'
import CartPopup from './CartPopup/CartPopup'
import styles from '@/styles/header/index.module.scss'
import { useRouter } from 'next/navigation'
import { useMedia } from '@/hooks/useMediaQuery'
import { useEffect } from 'react'

const HeaderBottom = () => {
  const isMedia950 = useMedia('(max-width: 950px)')

  const [mode] = useUnit([$mode])
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const router = useRouter()

  // useEffect(() => {
  //   // if (router.pathname === '/order') {
  //   //   setDisableCart(true)
  //   //   return
  //   // }

  //   // setDisableCart(false)
  // }, [router])

  return (
    <div className={styles.header__bottom}>
      <div className={`container ${styles.header__bottom__container}`}>
        <h1 className={styles.header__logo}>
          <Link href="/dashboard" legacyBehavior passHref>
            <a className={styles.header__logo__link}>
              <img src="/img/logo.svg" alt="logo" />
              <span
                className={`${styles.header__logo__link__text} ${darkModeClass}`}
              >
                Детали для газовых котлов
              </span>
            </a>
          </Link>
        </h1>
        <div className={styles.header__search}>
          <SearchInput />
        </div>
        <div className={styles.header__shopping_cart}>
          {!isMedia950.matches && <ModeToggler />}
          <CartPopup />
        </div>
      </div>
    </div>
  )
}

export default HeaderBottom
