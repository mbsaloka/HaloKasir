import Link from "next/link"

import { AppLogo } from "@/components/brand/app-logo"

export default function Home() {
  return (
    <div className="bg-muted/40 flex min-h-dvh flex-col">
      <header className="border-border bg-background flex items-center gap-3 border-b px-6 py-4">
        <AppLogo variant="icon" className="h-9 w-9" iconClassName="h-9 w-9" />
        <span className="text-lg font-semibold tracking-tight">Halo Kasir</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="flex max-w-lg flex-col items-center gap-8 text-center">
          <AppLogo variant="full" className="max-h-56 w-auto" />
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Selamat datang
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Gunakan menu Inventori untuk mengelola stok, atau buka halaman lain
              dari navigasi aplikasi.
            </p>
          </div>
          <Link
            href="/inventory"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-8 text-base font-medium transition-colors"
          >
            Buka Inventori
          </Link>
        </div>
      </main>
    </div>
  )
}
