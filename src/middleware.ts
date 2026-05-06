import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_COOKIE_NAME } from "@/lib/auth/constants"

const STATIC_EXT = /\.(?:svg|ico|png|jpg|jpeg|gif|webp|woff2?)$/i

function isStaticAsset(pathname: string) {
  return (
    pathname === "/favicon.ico" ||
    STATIC_EXT.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  )
}

function isAuthPath(pathname: string) {
  return pathname === "/login" || pathname === "/register"
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value)

  if (isAuthPath(pathname)) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
    "/",
  ],
}
