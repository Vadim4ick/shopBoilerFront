import { PartPage } from '@/components/templates/PartPage/PartPage'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { partId: string }
}) {
  const id = params.partId

  const res = await fetch(`http://localhost:3001/api/boilerPart?id=${id}`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      Cookie: `connect.sid=${cookies().get('connect.sid')?.value}`,
    },
  }).then((res) => res.json())

  if (!res.name) {
    return notFound()
  }

  return {
    title: res.name,
  }
}

const PageCatalogId = async ({ params }: { params: { partId: string } }) => {
  return <PartPage id={params.partId} />
}

export default PageCatalogId
