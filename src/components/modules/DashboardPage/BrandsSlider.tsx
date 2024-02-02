import { useUnit } from 'effector-react'
import { useEffect } from 'react'
import Slider, { Settings } from 'react-slick'

import styles from '@/styles/dashboard/index.module.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useMedia } from '@/hooks/useMediaQuery'
import { $mode } from '@/context/mode'
import BrandsSliderNextArrow from '@/components/elements/BrandsSliderNextArrow/BrandsSliderNextArrow'
import BrandsSliderPrevArrow from '@/components/elements/BrandsSliderPrevArrow/BrandsSliderPrevArrow'

const BrandsSlider = () => {
  const isMedia768 = useMedia('(max-width: 750px)')

  const [mode] = useUnit([$mode])
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const settings: Settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    variableWidth: true,
    slidesToScroll: 1,
    nextArrow: <BrandsSliderNextArrow modeClass={darkModeClass} />,
    prevArrow: <BrandsSliderPrevArrow modeClass={darkModeClass} />,
  }

  const brandItems = [
    { id: 1, img: '/img/brand-1.png', alt: 'brand-1' },
    { id: 2, img: '/img/brand-3.png', alt: 'brand-3' },
    { id: 3, img: '/img/brand-2.svg', alt: 'brand-2' },
    { id: 4, img: '/img/brand-4.png', alt: 'brand-4' },
    { id: 5, img: '/img/brand-1.png', alt: 'brand-1' },
    { id: 6, img: '/img/brand-3.png', alt: 'brand-3' },
    { id: 7, img: '/img/brand-2.svg', alt: 'brand-2' },
    { id: 8, img: '/img/brand-1.png', alt: 'brand-1' },
    { id: 9, img: '/img/brand-3.png', alt: 'brand-3' },
    { id: 10, img: '/img/brand-4.png', alt: 'brand-4' },
    { id: 11, img: '/img/brand-2.svg', alt: 'brand-2' },
    { id: 12, img: '/img/brand-1.png', alt: 'brand-1' },
  ]

  useEffect(() => {
    const slider = document.querySelector(
      `.${styles.dashboard__brands__slider}`
    )

    const list = slider?.querySelector('.slick-list') as HTMLElement

    list.style.height = isMedia768.matches ? '60px' : '80px'
  }, [isMedia768.matches])

  return (
    <>
      <Slider {...settings} className={styles.dashboard__brands__slider}>
        {brandItems.map((el) => (
          <div
            className={`${styles.dashboard__brands__slide} ${darkModeClass}`}
            key={el.id}
            style={{ width: isMedia768.matches ? 124 : 180 }}
          >
            <img src={el.img} alt={el.alt} />
          </div>
        ))}
      </Slider>
    </>
  )
}

export { BrandsSlider }
