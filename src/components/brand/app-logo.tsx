import { cn } from "@/lib/utils"

type AppLogoProps = {
  /** `full` = ikon + wordmark (logo-text.svg), `icon` = logo.svg saja */
  variant?: "full" | "icon"
  className?: string
  /** Ukuran mengikat tinggi (Tailwind), mis. h-10 */
  iconClassName?: string
}

export function AppLogo({
  variant = "full",
  className,
  iconClassName,
}: AppLogoProps) {
  if (variant === "icon") {
    return (
      <img
        src="/logo.svg"
        alt="Halo Kasir"
        width={40}
        height={40}
        className={cn(
          "h-10 w-10 shrink-0 object-contain",
          iconClassName,
          className
        )}
      />
    )
  }

  return (
    <img
      src="/logo-text.svg"
      alt="Halo Kasir"
      width={280}
      height={280}
      className={cn(
        "h-auto w-[min(280px,72vw)] max-w-full object-contain",
        className
      )}
    />
  )
}
