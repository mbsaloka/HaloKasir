import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { nextCookies } from "better-auth/next-js"
import { betterAuth } from "better-auth"

import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  appName: "Halo Kasir",
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: false,
      },
      role: {
        type: "string",
        required: false,
        input: false,
      },
      address: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
})

export type AuthSession = typeof auth.$Infer.Session
