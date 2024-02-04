import { forwardRef, useEffect } from 'react'
import ProfileSvg from '@/components/elements/ProfileSvg/ProfileSvg'
import { $mode } from '@/context/mode'

import LogoutSvg from '@/components/elements/LogoutSvg/LogoutSvg'
import { withClickOutside } from '../../../utils/withClickOutside'
import styles from '@/styles/profileDropDown/index.module.scss'
import { useRouter } from 'next/navigation'
import { IWrapperComponentProps } from '@/types/common'
import { useUnit } from 'effector-react'
import { AnimatePresence, motion } from 'framer-motion'
import { $user, setUser } from '@/context/user'
import { logoutFx } from '@/api/auth/auth'
import nookies from 'nookies'

const ProfileDropDown = forwardRef<HTMLDivElement, IWrapperComponentProps>(
  ({ open, setOpen }, ref) => {
    const router = useRouter()
    const [mode, user, setUserFn] = useUnit([$mode, $user, setUser])
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

    useEffect(() => {
      if (nookies.get().user) {
        const data = JSON.parse(nookies.get().user)
        setUserFn(data)
      }
    }, [])

    const toggleProfileDropDown = () => setOpen(!open)

    const handleLogout = async () => {
      await logoutFx('/users/logout')
      router.push('/')
    }

    return (
      <div className={styles.profile} ref={ref}>
        <button className={styles.profile__btn} onClick={toggleProfileDropDown}>
          <span className={styles.profile__span}>
            <ProfileSvg />
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className={`${styles.profile__dropdown} ${darkModeClass}`}
              style={{ transformOrigin: 'right top' }}
            >
              <li className={styles.profile__dropdown__user}>
                <span
                  className={`${styles.profile__dropdown__username} ${darkModeClass}`}
                >
                  {user.username}
                </span>
                <span
                  className={`${styles.profile__dropdown__email} ${darkModeClass}`}
                >
                  {user.email}
                </span>
              </li>
              <li className={styles.profile__dropdown__item}>
                <button
                  className={styles.profile__dropdown__item__btn}
                  onClick={handleLogout}
                >
                  <span
                    className={`${styles.profile__dropdown__item__text} ${darkModeClass}`}
                  >
                    Выйти
                  </span>
                  <span
                    className={`${styles.profile__dropdown__item__svg} ${darkModeClass}`}
                  >
                    <LogoutSvg />
                  </span>
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

ProfileDropDown.displayName = 'ProfileDropDown'

export default withClickOutside(ProfileDropDown)
