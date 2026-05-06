import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthCrossLink } from "@/components/features/auth/auth-cross-link"
import { AuthLegalNotice } from "@/components/features/auth/auth-legal-notice"
import { AuthModeTabs } from "@/components/features/auth/auth-mode-tabs"
import { AuthPageHeader } from "@/components/features/auth/auth-page-header"
import { AuthShell } from "@/components/features/auth/auth-shell"
import { LoginForm } from "@/components/features/auth/login-form"

export const metadata: Metadata = {
  title: "Masuk — Halo Kasir",
}

export default function LoginPage() {
  return (
    <AuthShell>
      <AuthModeTabs mode="login" />
      <AuthPageHeader
        title="Masuk ke Akun"
        description="Silakan masukkan kredensial Anda untuk mengakses kembali sistem CRM."
      />
      <Suspense
        fallback={
          <div className="bg-muted h-64 animate-pulse rounded-lg" aria-hidden />
        }
      >
        <LoginForm />
      </Suspense>
      <AuthLegalNotice />
      <AuthCrossLink
        prompt="Belum punya akun?"
        href="/register"
        actionLabel="Sign Up"
      />
    </AuthShell>
  )
}
