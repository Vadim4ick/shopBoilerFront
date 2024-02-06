import {
  removeClassNamesForOverlayAndBody,
  toggleClassNamesForOverlayAndBody,
} from '@/utils/common'
import { useEffect, useState } from 'react'

const usePopup = (callback: (payload: number) => number) => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    window.scrollTo(0, 0)
    toggleClassNamesForOverlayAndBody()
    setOpen(!open)
  }

  const closePopup = () => {
    removeClassNamesForOverlayAndBody()
    setOpen(false)
    callback(1)
  }

  useEffect(() => {
    const overlay = document.querySelector('.overlay')

    overlay?.addEventListener('click', closePopup)

    return () => overlay?.removeEventListener('click', closePopup)
  }, [open])

  return { toggleOpen, open, closePopup }
}

export { usePopup }
