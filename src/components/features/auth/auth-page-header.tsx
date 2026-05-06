type AuthPageHeaderProps = {
  title: string
  description: string
}

export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </header>
  )
}
