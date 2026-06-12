import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const MEMBER_ROUTES = ['/wishlist', '/account', '/design-your-own']
const ADMIN_ROUTES  = ['/admin']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isMemberRoute = MEMBER_ROUTES.some((r) => pathname.startsWith(r))
  const isAdminRoute  = ADMIN_ROUTES.some((r) => pathname.startsWith(r))

  if (isMemberRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAdminRoute) {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!session || session.user?.email !== adminEmail) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/wishlist/:path*',
    '/account/:path*',
    '/design-your-own/:path*',
    '/admin/:path*',
  ],
}
