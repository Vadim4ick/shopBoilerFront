'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from '@/styles/breadcrumbs/index.module.scss'
import { $mode } from '@/context/mode'
import { useUnit } from 'effector-react'
import CrumbArrowSvg from '@/components/elements/CrumbArrowSvg/CrumbArrowSvg'
import { $breadcrumbName } from '@/context/breadcrumbsPath'

type TPath =
  | 'dashboard'
  | 'catalog'
  | 'shipping-payment'
  | 'about'
  | 'contacts'
  | 'order'
  | 'wholesale-buyers'

const pathToRussian: Record<TPath, string> = {
  dashboard: 'Главная',
  catalog: 'Каталог',
  'shipping-payment': 'Доставка и оплата',
  about: 'О компании',
  contacts: 'Контакты',
  order: 'Корзина товаров',
  'wholesale-buyers': 'Оптовым покупателям',
}

const NextBreadcrumb = () => {
  const breadcrumbName = useUnit($breadcrumbName)
  const paths = usePathname()
  let pathNames = paths.split('/').filter((path) => path)

  const mode = useUnit($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  if (breadcrumbName) {
    pathNames = pathNames.filter((el) => el !== pathNames.at(-1))
    pathNames.push(breadcrumbName)
  }

  return (
    <div className="container">
      <ul className={styles.breadcrumbs}>
        <li className={styles.breadcrumbs__item}>
          <Link href="/dashboard" passHref legacyBehavior>
            <a>
              <span
                className={`${styles.breadcrumbs__item__icon} ${darkModeClass}`}
                style={{ marginRight: 0 }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.6667 13.9993H3.33341C3.1566 13.9993 2.98703 13.9291 2.86201 13.804C2.73699 13.679 2.66675 13.5094 2.66675 13.3326V7.33263H0.666748L7.55141 1.07396C7.67415 0.962281 7.83414 0.900391 8.00008 0.900391C8.16603 0.900391 8.32601 0.962281 8.44875 1.07396L15.3334 7.33263H13.3334V13.3326C13.3334 13.5094 13.2632 13.679 13.1382 13.804C13.0131 13.9291 12.8436 13.9993 12.6667 13.9993ZM4.00008 12.666H12.0001V6.10396L8.00008 2.46796L4.00008 6.10396V12.666Z" />
                </svg>
              </span>
            </a>
          </Link>
        </li>

        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join('/')}`

          let itemLink = pathToRussian[link as TPath] || link

          return (
            <li
              key={index}
              className={`${styles.breadcrumbs__item} ${darkModeClass}`}
            >
              {index === pathNames.length - 1 ? (
                <a>
                  <span
                    className={`${styles.breadcrumbs__item__icon} ${darkModeClass}`}
                    style={{ marginRight: 13 }}
                  >
                    <CrumbArrowSvg />
                  </span>
                  <span className={styles.breadcrumbs__item__text}>
                    {itemLink}
                  </span>
                </a>
              ) : (
                <Link href={href}>
                  <span
                    className={`${styles.breadcrumbs__item__icon} ${darkModeClass}`}
                    style={{ marginRight: 13 }}
                  >
                    <CrumbArrowSvg />
                  </span>
                  <span className={styles.breadcrumbs__item__text}>
                    {itemLink}
                  </span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export { NextBreadcrumb }
