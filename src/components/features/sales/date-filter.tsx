"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type DateFilterProps = {
  labelFrom?: string
  labelTo?: string
  className?: string
}

/** Pemilih rentang tanggal (mock — tidak mengubah data server) */
export function DateFilter({
  labelFrom = "Dari",
  labelTo = "Sampai",
  className,
}: DateFilterProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 md:gap-3",
        className
      )}
    >
      <Select defaultValue="placeholder-from">
        <SelectTrigger className="bg-background h-9 w-[min(100%,180px)] border-border shadow-xs">
          <SelectValue placeholder={`${labelFrom} Pilih Tanggal`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="placeholder-from">
            {labelFrom} Pilih Tanggal
          </SelectItem>
          <SelectItem value="2024-01-01">01/01/2024</SelectItem>
          <SelectItem value="2024-02-01">01/02/2024</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="placeholder-to">
        <SelectTrigger className="bg-background h-9 w-[min(100%,180px)] border-border shadow-xs">
          <SelectValue placeholder={`${labelTo} Pilih Tanggal`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="placeholder-to">
            {labelTo} Pilih Tanggal
          </SelectItem>
          <SelectItem value="2024-02-04">04/02/2024</SelectItem>
          <SelectItem value="2024-03-01">01/03/2024</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
