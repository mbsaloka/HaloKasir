import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
})

export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").min(2, "Nama minimal 2 karakter"),
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
