import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  const hasSession = Boolean(getSessionCookie(request))

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
  matcher: ["/((?!_next/static|_next/image).*)", "/"],
}
