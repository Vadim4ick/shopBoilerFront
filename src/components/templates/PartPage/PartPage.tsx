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

const PartPage = ({ id }: { id: string }) => {
  const [boilerPart, setBoilerPart] = useUnit([$boilerPart, setBoilerPartFx])

  useEffect(() => {
    loadBoilerPart()
  }, [])

  const loadBoilerPart = async () => {
    try {
      const data = await GetBoilerPartFx(`/boiler-parts/find/${id}`)
      setBoilerPart(data)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <>
      {/* <Breadcrumbs
        getDefaultTextGenerator={getDefaultTextGenerator}
        getTextGenerator={getTextGenerator}
      />

     */}

      <PagePart />
    </>
  )
}

export { PartPage }
