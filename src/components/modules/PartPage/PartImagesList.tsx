import { useState } from 'react'
import PartImagesItem from './PartImagesItem'
import PartSlider from './PartSlider'
import styles from '@/styles/part/index.module.scss'
import { useUnit } from 'effector-react'
import { $boilerPart } from '@/context/boiler-part'
import { useMedia } from '@/hooks/useMediaQuery'

const PartImagesList = () => {
  const boilerPart = useUnit($boilerPart)
  const isMobile = useMedia('(max-width: 850px)')

  const images = boilerPart.images
    ? (JSON.parse(boilerPart.images) as string[])
    : []

  const [currentImgSrc, setCurrentImgSrc] = useState('')

  return (
    <div className={styles.part__images}>
      {isMobile.matches ? (
        <PartSlider images={images} />
      ) : (
        <>
          <div className={styles.part__images__main}>
            <img src={currentImgSrc || images[0]} alt={boilerPart.name} />
          </div>
          <ul className={styles.part__images__list}>
            {images.map((item, i) => (
              <PartImagesItem
                key={i}
                alt={`image-${i + 1}`}
                callback={setCurrentImgSrc}
                src={item}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default PartImagesList
