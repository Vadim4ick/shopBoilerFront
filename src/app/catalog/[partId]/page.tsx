import { PartPage } from '@/components/templates/PartPage/PartPage'
import { cookies } from 'next/headers'

export async function generateMetadata({
  params,
}: {
  params: { partId: string }
}) {
  const id = params.partId

  try {
    const res = await fetch(`http://localhost:3001/api/boilerPart?id=${id}`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        Cookie: `connect.sid=${cookies().get('connect.sid')?.value}`,
      },
    }).then((res) => res.json())

    return {
      title: res.name,
    }
  } catch (error) {
    console.log('err', error)
  }
}

const PageCatalogId = async ({ params }: { params: { partId: string } }) => {
  return <PartPage id={params.partId} />
}

export default PageCatalogId
