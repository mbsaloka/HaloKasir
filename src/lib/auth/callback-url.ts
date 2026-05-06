/**
 * Cegah open-redirect: hanya path relatif internal yang diizinkan.
 */
export function getSafeCallbackUrl(raw: string | null): string {
  if (!raw || raw.startsWith("//")) {
    return "/"
  }
  if (!raw.startsWith("/")) {
    return "/"
  }
  try {
    const base = "http://local.invalid"
    const u = new URL(raw, base)
    if (u.origin !== base) {
      return "/"
    }
    return u.pathname + u.search + u.hash
  } catch {
    return "/"
  }
}
