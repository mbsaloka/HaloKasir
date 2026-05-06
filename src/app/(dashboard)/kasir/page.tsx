import { redirect } from "next/navigation"

/** URL lama menu Kasir → halaman POS baru */
export default function KasirRedirectPage() {
  redirect("/cashier")
}
