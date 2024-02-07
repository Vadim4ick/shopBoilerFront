'use client'

import { GetBoilerPartFx } from '@/api/boilerParts/boilerParts'
import {
  $boilerPart,
  setBoilerPart as setBoilerPartFx,
} from '@/context/boiler-part'
import { useUnit } from 'effector-react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import PagePart from './PagePart'
import { setBreadcrumbName as setBreadcrumbNameFx } from '@/context/breadcrumbsPath'

const PartPage = ({ id }: { id: string }) => {
  const [setBoilerPart, setBreadcrumbName] = useUnit([
    setBoilerPartFx,
    setBreadcrumbNameFx,
  ])

  useEffect(() => {
    loadBoilerPart()

    return () => {
      setBreadcrumbName(null)
    }
  }, [])

  const loadBoilerPart = async () => {
    try {
      const data = await GetBoilerPartFx(`/boiler-parts/find/${id}`)
      setBoilerPart(data)
      setBreadcrumbName(data.name)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <>
      <PagePart />
    </>
  )
}

export { PartPage }
