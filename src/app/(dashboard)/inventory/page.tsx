import Link from "next/link"

import { AppLogo } from "@/components/brand/app-logo"

export default function InventoryPage() {
  return (
    <div className="bg-muted/40 flex min-h-dvh flex-col">
      <header className="border-border bg-background flex items-center gap-3 border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <AppLogo variant="icon" className="h-9 w-9" iconClassName="h-9 w-9" />
          <span className="text-lg font-semibold tracking-tight">Halo Kasir</span>
        </Link>
      </header>
      <main className="flex flex-1 flex-col p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Inventori</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Halaman inventori — konten akan ditambahkan di sini.
        </p>
      </main>
    </div>
  )
}
