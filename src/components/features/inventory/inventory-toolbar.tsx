"use client"

import { DownloadIcon, ListIcon, PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INVENTORY_CATEGORIES } from "@/lib/inventory/types"

type InventoryToolbarProps = {
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  onAddClick: () => void
}

export function InventoryToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onAddClick,
}: InventoryToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-heading text-base font-semibold tracking-tight">
          Detail Stok Barang
        </h2>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border h-9 shadow-xs"
            onClick={() => {

            }}
          >
            <ListIcon className="size-4" />
            Kolom
          </Button>

          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari"
              className="bg-background border-border h-9 pl-9 shadow-xs"
              aria-label="Cari barang"
            />
          </div>

          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="bg-background h-9 w-full border-border shadow-xs sm:w-[160px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {INVENTORY_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            className="h-9 gap-1 shadow-xs"
            onClick={onAddClick}
          >
            <PlusIcon className="size-4" />
            Tambah Stok
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-border h-9 shadow-xs"
            onClick={() => {

            }}
          >
            <DownloadIcon className="size-4" />
            Unduh Data
          </Button>
        </div>
      </div>
    </div>
  )
}
