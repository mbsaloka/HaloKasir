import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthCrossLink } from "@/components/features/auth/auth-cross-link"
import { AuthLegalNotice } from "@/components/features/auth/auth-legal-notice"
import { AuthModeTabs } from "@/components/features/auth/auth-mode-tabs"
import { AuthPageHeader } from "@/components/features/auth/auth-page-header"
import { AuthShell } from "@/components/features/auth/auth-shell"
import { RegisterForm } from "@/components/features/auth/register-form"

export const metadata: Metadata = {
  title: "Daftar — Halo Kasir",
}

export default function RegisterPage() {
  return (
    <AuthShell>
      <AuthModeTabs mode="register" />
      <AuthPageHeader
        title="Daftar Akun"
        description="Daftarkan akun Anda untuk mengakses dan menggunakan sistem CRM."
      />
      <Suspense
        fallback={
          <div className="bg-muted h-80 animate-pulse rounded-lg" aria-hidden />
        }
      >
        <RegisterForm />
      </Suspense>
      <AuthLegalNotice />
      <AuthCrossLink
        prompt="Already have an account?"
        href="/login"
        actionLabel="Log In"
      />
    </AuthShell>
  )
}
