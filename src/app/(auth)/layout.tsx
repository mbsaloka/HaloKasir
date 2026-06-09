import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autentikasi — Halo Kasir",
  description: "Masuk atau daftar ke Halo Kasir",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
