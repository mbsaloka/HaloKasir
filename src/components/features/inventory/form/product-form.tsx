"use client"

import { useRef } from "react"
import { ImagePlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INVENTORY_CATEGORIES } from "@/lib/inventory/mock-data"
import { cn } from "@/lib/utils"

export type ProductFormState = {
  name: string
  price: string
  stock: string
  category: string
  imageLabel: string
}

export type ProductFieldErrors = Partial<
  Record<"name" | "price" | "stock" | "category", string>
>

const CATEGORY_OPTIONS = INVENTORY_CATEGORIES.filter((c) => c !== "Semua")

type ProductFormProps = {
  value: ProductFormState
  onChange: (next: ProductFormState) => void
  errors: ProductFieldErrors
  idPrefix: string
}

export function ProductForm({
  value,
  onChange,
  errors,
  idPrefix,
}: ProductFormProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  function patch(partial: Partial<ProductFormState>) {
    onChange({ ...value, ...partial })
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-x-4">
        <Label htmlFor={`${idPrefix}-name`} className="text-muted-foreground">
          Nama Item
        </Label>
        <div className="space-y-1">
          <Input
            id={`${idPrefix}-name`}
            value={value.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Tulis"
            className={cn(errors.name && "border-destructive")}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <p className="text-destructive text-xs">{errors.name}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-x-4">
        <Label htmlFor={`${idPrefix}-price`} className="text-muted-foreground">
          Harga
        </Label>
        <div className="space-y-1">
          <Input
            id={`${idPrefix}-price`}
            inputMode="numeric"
            value={value.price}
            onChange={(e) => patch({ price: e.target.value })}
            placeholder="Tulis"
            className={cn(errors.price && "border-destructive")}
            aria-invalid={Boolean(errors.price)}
          />
          {errors.price ? (
            <p className="text-destructive text-xs">{errors.price}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-x-4">
        <Label htmlFor={`${idPrefix}-stock`} className="text-muted-foreground">
          Jumlah Stok
        </Label>
        <div className="space-y-1">
          <Input
            id={`${idPrefix}-stock`}
            inputMode="numeric"
            value={value.stock}
            onChange={(e) => patch({ stock: e.target.value })}
            placeholder="Tulis"
            className={cn(errors.stock && "border-destructive")}
            aria-invalid={Boolean(errors.stock)}
          />
          {errors.stock ? (
            <p className="text-destructive text-xs">{errors.stock}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-x-4">
        <Label htmlFor={`${idPrefix}-category`} className="text-muted-foreground">
          Kategori
        </Label>
        <div className="space-y-1">
          <Select
            value={value.category || undefined}
            onValueChange={(v) => patch({ category: v })}
          >
            <SelectTrigger
              id={`${idPrefix}-category`}
              className={cn(
                "bg-background w-full",
                errors.category && "border-destructive"
              )}
              aria-invalid={Boolean(errors.category)}
            >
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category ? (
            <p className="text-destructive text-xs">{errors.category}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[140px_1fr] sm:items-start sm:gap-x-4">
        <Label className="text-muted-foreground pt-2">Gambar</Label>
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              patch({ imageLabel: f ? f.name : "" })
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="border-border bg-muted/30 hover:bg-muted/50 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center transition-colors"
          >
            <ImagePlusIcon className="text-muted-foreground size-8" />
            <span className="text-muted-foreground text-sm">
              Unggah gambar (mock)
            </span>
            {value.imageLabel ? (
              <span className="text-foreground text-xs font-medium break-all">
                {value.imageLabel}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  )
}

export function emptyProductForm(): ProductFormState {
  return {
    name: "",
    price: "",
    stock: "",
    category: "",
    imageLabel: "",
  }
}

export function productToFormState(p: {
  name: string
  price: number
  stock: number
  category: string
}): ProductFormState {
  return {
    name: p.name,
    price: String(p.price),
    stock: String(p.stock),
    category: p.category,
    imageLabel: "",
  }
}
