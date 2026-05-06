import Link from "next/link"

type AuthCrossLinkProps = {
  prompt: string
  href: string
  actionLabel: string
}

export function AuthCrossLink({
  prompt,
  href,
  actionLabel,
}: AuthCrossLinkProps) {
  return (
    <p className="text-muted-foreground text-center text-sm">
      {prompt}{" "}
      <Link
        href={href}
        className="text-primary font-semibold underline-offset-2 hover:underline"
      >
        {actionLabel}
      </Link>
    </p>
  )
}
