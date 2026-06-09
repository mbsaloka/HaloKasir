"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getSafeCallbackUrl } from "@/lib/auth/callback-url"
import { authClient } from "@/lib/auth/client"
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth"

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: RegisterFormValues) {
    const next = getSafeCallbackUrl(searchParams.get("callbackUrl"))
    const result = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: next,
    })

    if (result.error) {
      form.setError("root", {
        message: result.error.message ?? "Pendaftaran gagal.",
      })
      return
    }

    form.reset({ name: "", email: "", password: "" })
    router.refresh()
    router.push(next)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  placeholder="Ketik nama Anda"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kata Sandi</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Ketik kata sandi Anda"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-11 w-full text-base"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Memproses..." : "Daftar"}
        </Button>
        {form.formState.errors.root?.message ? (
          <p className="text-destructive text-center text-sm">
            {form.formState.errors.root.message}
          </p>
        ) : null}
      </form>
    </Form>
  )
}
