import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db, assertDatabaseConfigured } from "@/db"
import { user } from "@/db/schema"
import { auth } from "@/lib/auth"

export type CurrentUser = {
  id: string
  name: string
  email: string
  image: string | null
  username: string | null
  phone: string | null
  role: string
  address: string | null
}

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  assertDatabaseConfigured()

  const session = await getCurrentSession()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username,
      phone: user.phone,
      role: user.role,
      address: user.address,
    })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (!row) {
    redirect("/login")
  }

  return row
}
