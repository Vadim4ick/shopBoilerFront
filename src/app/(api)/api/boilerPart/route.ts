// app/api/hello/route.ts

import { $api } from '@/api/api'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id')

  const { data } = await $api.get(`/boiler-parts/find/${id}`, {
    headers: {
      Cookie: `connect.sid=${cookies().get('connect.sid')?.value}`,
    },
  })

  return NextResponse.json(data)
}
