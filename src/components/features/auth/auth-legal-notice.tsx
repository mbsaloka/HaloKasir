import Link from "next/link"

export function AuthLegalNotice() {
  return (
    <p className="text-muted-foreground text-center text-xs leading-relaxed sm:text-left">
      By confirming your email, you agree to our{" "}
      <Link
        href="#"
        className="text-primary font-medium underline-offset-2 hover:underline"
      >
        Terms of Service
      </Link>{" "}
      and that you have read and understood our{" "}
      <Link
        href="#"
        className="text-primary font-medium underline-offset-2 hover:underline"
      >
        Privacy Policy
      </Link>
      .
    </p>
  )
}
