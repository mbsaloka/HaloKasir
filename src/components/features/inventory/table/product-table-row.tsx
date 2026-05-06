import Image from "next/image"
import { PencilIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { StockBadge } from "@/components/features/inventory/stock-badge"
import { formatRupiah } from "@/lib/cashier/format-rupiah"
import type { InventoryProduct } from "@/lib/inventory/mock-data"
import { getStockLevel } from "@/lib/inventory/stock-status"

type ProductTableRowProps = {
  product: InventoryProduct
  onEdit: (product: InventoryProduct) => void
  onDelete: (product: InventoryProduct) => void
}

export function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const level = getStockLevel(product)

  return (
    <TableRow>
      <TableCell className="w-[72px]">
        <div className="bg-muted relative size-11 overflow-hidden rounded-lg ring-1 ring-border">
          <Image
            src={product.imageSrc}
            alt=""
            width={44}
            height={44}
            className="size-full object-cover"
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{product.name}</span>
          <span className="text-muted-foreground text-xs tabular-nums">
            ID Stok {product.stockId}
          </span>
        </div>
      </TableCell>
      <TableCell className="tabular-nums">{product.itemId}</TableCell>
      <TableCell className="tabular-nums font-medium">
        {formatRupiah(product.price)}
      </TableCell>
      <TableCell className="tabular-nums">{product.stock}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>
        <StockBadge level={level} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="border-border shadow-xs"
            onClick={() => onEdit(product)}
            aria-label={`Edit ${product.name}`}
          >
            <PencilIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="border-border text-destructive shadow-xs hover:bg-destructive/10"
            onClick={() => onDelete(product)}
            aria-label={`Hapus ${product.name}`}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
