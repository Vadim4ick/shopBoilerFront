import { $mode, setMode } from '@/context/mode'
import { useUnit } from 'effector-react'
import { useEffect } from 'react'

const useTheme = () => {
  const [mode, setModes] = useUnit([$mode, setMode])

  const toggleTheme = () => {
    if (mode === 'dark') {
      localStorage.setItem('mode', JSON.stringify('light'))
      setModes('light')
    } else {
      localStorage.setItem('mode', JSON.stringify('dark'))
      setModes('dark')
    }
  }

  useEffect(() => {
    const localTheme = JSON.parse(localStorage.getItem('mode') as string)

    if (localTheme) {
      setModes(localTheme)
    }
  }, [])

  return { toggleTheme }
}

export { useTheme }
