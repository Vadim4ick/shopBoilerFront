import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Если путь начинается с /api, пропустите middleware
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const response = await fetch(`http://node:3000/users/login-check`, {
    headers: request.headers,
    credentials: 'include',
  })

  const user = await response.json()

  if (
    user.error === 'Forbidden' &&
    user.statusCode === 403 &&
    pathname !== '/'
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!user.error && user.statusCode !== 403 && user && pathname === '/') {
    const res = NextResponse.redirect(new URL('/dashboard', request.url))

    res.cookies.delete('user')

    return res
  }

  if (user.error && pathname === '/') {
    const res = NextResponse.next()

    res.cookies.delete('user')

    return res
  }

  // Добавляем куки в ответ
  const redirectResponse = NextResponse.next()
  redirectResponse.cookies.set('user', JSON.stringify(user))

  return redirectResponse
}

export const config = {
  matcher: ['/((?!.*\\.).*)', '/favicon.ico'],
}
