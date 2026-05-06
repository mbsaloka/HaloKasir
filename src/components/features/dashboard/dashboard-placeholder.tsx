type DashboardPlaceholderProps = {
  title: string
  description?: string
}

export function DashboardPlaceholder({
  title,
  description = "Halaman ini menggunakan data mock; konten akan ditambahkan.",
}: DashboardPlaceholderProps) {
  return (
    <div className="border-border bg-card text-card-foreground mx-auto max-w-3xl rounded-xl border p-10 text-center shadow-xs">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-3 text-sm">{description}</p>
    </div>
  )
}
