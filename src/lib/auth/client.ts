"use client"

import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "@/lib/auth/constants"

/** Set cookie sesi mock (bukan httpOnly — sengaja untuk demo tanpa API) */
export function setMockSessionCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function clearMockSessionCookie() {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
}
